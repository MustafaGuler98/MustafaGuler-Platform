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

namespace MustafaGuler.Service.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;
        private readonly IGenericRepository<Image> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public ImageService(
            IWebHostEnvironment env,
            IGenericRepository<Image> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICurrentUserService currentUserService)
        {
            _env = env;
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<Result<ImageInfoDto>> UploadAsync(FileUploadData fileData, string customName)
        {
            if (fileData == null || fileData.Length == 0)
                return Result<ImageInfoDto>.Failure(400, Messages.NoFileUploaded);

            long fileSizeLimit = 10 * 1024 * 1024;
            if (fileData.Length > fileSizeLimit)
                return Result<ImageInfoDto>.Failure(400, Messages.FileSizeLimitExceeded);

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(fileData.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return Result<ImageInfoDto>.Failure(400, Messages.InvalidFileType);

            string safeName = SlugHelper.GenerateSlug(customName);

            if (string.IsNullOrEmpty(safeName))
                return Result<ImageInfoDto>.Failure(400, Messages.InvalidFilename);

            string fileName = $"{safeName}{extension}";
            string folderPath = Path.Combine(_env.WebRootPath, "uploads", "articles");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string filePath = Path.Combine(folderPath, fileName);

            // Check if file already exists in filesystem or DB
            if (File.Exists(filePath) || await _repository.AnyAsync(x => x.FileName == fileName))
                return Result<ImageInfoDto>.Failure(409, string.Format(Messages.FileAlreadyExists, safeName));

            string url = $"/uploads/articles/{fileName}";

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

                var dto = _mapper.Map<ImageInfoDto>(imageEntity);
                return Result<ImageInfoDto>.Success(dto, 201, Messages.ImageUploaded);
            }
            catch
            {
                if (File.Exists(filePath))
                    File.Delete(filePath);

                throw;
            }
        }

        public async Task<PagedResult<ImageInfoDto>> GetPagedAsync(PaginationParams paginationParams, string? searchTerm = null)
        {
            Expression<Func<Image, bool>> filter = x => !x.IsDeleted;

            if (!string.IsNullOrEmpty(searchTerm))
            {
                var lowerSearch = searchTerm.ToLower();
                filter = x => !x.IsDeleted && x.FileName.ToLower().Contains(lowerSearch);
            }

            var pagedResult = await _repository.GetPagedListAsync(
                paginationParams,
                filter,
                q => q.OrderByDescending(x => x.CreatedDate),
                x => x.UploadedBy!
            );

            var dtos = _mapper.Map<List<ImageInfoDto>>(pagedResult.Data);

            return new PagedResult<ImageInfoDto>(dtos, pagedResult.TotalCount, pagedResult.PageNumber, pagedResult.PageSize);
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
                return Result.Failure(404, Messages.ImageNotFound);

            string filePath = Path.Combine(_env.WebRootPath, "uploads", "articles", image.FileName);
            if (File.Exists(filePath))
                File.Delete(filePath);

            image.IsDeleted = true;
            image.UpdatedDate = DateTime.UtcNow;

            _repository.Update(image);
            await _unitOfWork.CommitAsync();

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