using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Utilities.Helpers;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

namespace MustafaGuler.Service.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;
        private readonly IGenericRepository<Image> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<ImageService> _logger;

        public ImageService(
            IWebHostEnvironment env,
            IGenericRepository<Image> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICurrentUserService currentUserService,
            ILogger<ImageService> logger)
        {
            _env = env;
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _currentUserService = currentUserService;
            _logger = logger;
        }

        public async Task<Result<ImageInfoDto>> UploadAsync(FileUploadData fileData, string customName, string folder = "articles")
        {
            if (fileData == null || fileData.Length == 0)
                return Result<ImageInfoDto>.Failure(400, Messages.NoFileUploaded);

            long fileSizeLimit = 10 * 1024 * 1024;
            if (fileData.Length > fileSizeLimit)
            {
                _logger.LogWarning("File upload failed: Size limit exceeded ({Size} bytes)", fileData.Length);
                return Result<ImageInfoDto>.Failure(400, Messages.FileSizeLimitExceeded);
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(fileData.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return Result<ImageInfoDto>.Failure(400, Messages.InvalidFileType);

            string safeName = SlugHelper.GenerateSlug(customName);

            if (string.IsNullOrEmpty(safeName))
                return Result<ImageInfoDto>.Failure(400, Messages.InvalidFilename);

            folder = folder.ToLowerInvariant().Replace(".", "").Replace("/", "").Replace("\\", "");
            if (string.IsNullOrWhiteSpace(folder)) folder = "articles";

            string fileName = $"{safeName}{extension}";
            string folderPath = Path.Combine(_env.WebRootPath, "uploads", folder);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string filePath = Path.Combine(folderPath, fileName);

            // Check if file already exists in filesystem or DB
            string url = $"/uploads/{folder}/{fileName}";

            if (File.Exists(filePath) || await _repository.AnyAsync(x => x.Url == url))
            {
                _logger.LogWarning("File upload failed: File already exists ({FileName})", fileName);
                return Result<ImageInfoDto>.Failure(409, string.Format(Messages.FileAlreadyExists, safeName));
            }

            var imageEntity = new Image
            {
                FileName = fileName,
                Url = url,
                SizeBytes = fileData.Length,
                ContentType = fileData.ContentType ?? GetContentType(extension),
                UploadedById = _currentUserService.UserId
            };

            try
            {
                await _repository.AddAsync(imageEntity);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await fileData.Content.CopyToAsync(stream);
                }

                await _unitOfWork.CommitAsync();

                _logger.LogInformation("File uploaded: {FileName}, Size: {Size} bytes, User: {UserId}", fileName, fileData.Length, _currentUserService.UserId);

                var dto = _mapper.Map<ImageInfoDto>(imageEntity);
                return Result<ImageInfoDto>.Success(dto, 201, Messages.ImageUploaded);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "File upload failed with exception: {FileName}", fileName);
                if (File.Exists(filePath))
                    File.Delete(filePath);

                throw;
            }
        }

        public async Task<Result<PagedResult<ImageInfoDto>>> GetPagedAsync(ImageQueryParams queryParams)
        {
            Expression<Func<Image, bool>> filter = x => !x.IsDeleted;

            var lowerSearch = queryParams.SearchTerm?.ToLower();
            var folderPrefix = !string.IsNullOrEmpty(queryParams.Folder) ? $"/uploads/{queryParams.Folder}/".ToLower() : null;

            filter = x => !x.IsDeleted
                          && (string.IsNullOrEmpty(lowerSearch) || x.FileName.ToLower().Contains(lowerSearch))
                          && (string.IsNullOrEmpty(folderPrefix) || x.Url.ToLower().StartsWith(folderPrefix));

            var paginationParams = new PaginationParams
            {
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize
            };

            var pagedResult = await _repository.GetPagedListAsync(
                paginationParams,
                filter,
                q => q.OrderByDescending(x => x.CreatedDate),
                x => x.UploadedBy!
            );

            var dtos = _mapper.Map<List<ImageInfoDto>>(pagedResult.Items);
            var result = new PagedResult<ImageInfoDto>(dtos, pagedResult.TotalCount, pagedResult.PageNumber, pagedResult.PageSize);
            return Result<PagedResult<ImageInfoDto>>.Success(result);
        }

        public async Task<Result<ImageInfoDto>> UpdateAsync(Guid id, ImageUpdateDto dto)
        {
            var image = await _repository.GetByIdAsync(id);

            if (image == null || image.IsDeleted)
                return Result<ImageInfoDto>.Failure(404, Messages.ImageNotFound);

            _mapper.Map(dto, image);
            image.UpdatedDate = DateTime.UtcNow;

            _repository.Update(image);
            await _unitOfWork.CommitAsync();

            var resultDto = _mapper.Map<ImageInfoDto>(image);
            return Result<ImageInfoDto>.Success(resultDto, 200, Messages.ImageUpdated);
        }

        public async Task<Result> DeleteAsync(Guid id)
        {
            var image = await _repository.GetByIdAsync(id);

            if (image == null || image.IsDeleted)
            {
                _logger.LogWarning("Delete failed: Image not found {Id}", id);
                return Result.Failure(404, Messages.ImageNotFound);
            }


            // URL format: /uploads/folder/filename.ext
            string relativePath = image.Url.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
            string sourcePath = Path.Combine(_env.WebRootPath, relativePath);
            string deletedFolderPath = Path.Combine(_env.WebRootPath, "uploads", "deleted");
            string destinationPath = Path.Combine(deletedFolderPath, image.FileName);

            image.IsDeleted = true;
            image.UpdatedDate = DateTime.UtcNow;

            _repository.Update(image);
            await _unitOfWork.CommitAsync();

            if (File.Exists(sourcePath))
            {
                if (!Directory.Exists(deletedFolderPath))
                    Directory.CreateDirectory(deletedFolderPath);

                var fileNameWithoutExt = Path.GetFileNameWithoutExtension(image.FileName);
                var extension = Path.GetExtension(image.FileName);
                var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
                destinationPath = Path.Combine(deletedFolderPath, $"{fileNameWithoutExt}_{timestamp}{extension}");

                File.Move(sourcePath, destinationPath);
            }

            _logger.LogWarning("Image deleted: {FileName} ({Id})", image.FileName, id);
            return Result.Success(200, Messages.ImageDeleted);
        }

        private static string GetContentType(string extension)
        {
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };
        }
    }
}