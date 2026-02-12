using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Utilities.Helpers;
using MustafaGuler.Core.Utilities.Results;
using MustafaGuler.Core.Utilities.Security;
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
        private readonly System.Net.Http.IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ImageService> _logger;

        public ImageService(
            IWebHostEnvironment env,
            IGenericRepository<Image> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICurrentUserService currentUserService,
            System.Net.Http.IHttpClientFactory httpClientFactory,
            ILogger<ImageService> logger)
        {
            _env = env;
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _currentUserService = currentUserService;
            _httpClientFactory = httpClientFactory;
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

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(fileData.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return Result<ImageInfoDto>.Failure(400, Messages.InvalidFileType);

            // Signature Validation
            if (!fileData.Content.CanRead)
            {
                return Result<ImageInfoDto>.Failure(400, "File stream is not readable.");
            }

            if (fileData.Content.CanSeek)
            {
                fileData.Content.Position = 0;
            }

            if (!FileSignatureValidator.IsValidSignature(fileData.Content, extension))
            {
                _logger.LogWarning("File signature validation failed for {FileName}. Extension: {Extension}", fileData.FileName, extension);
                return Result<ImageInfoDto>.Failure(400, "Invalid file signature (File content does not match extension).");
            }

            if (fileData.Content.CanSeek)
            {
                fileData.Content.Position = 0;
            }

            string safeName = SlugHelper.GenerateSlug(customName);

            if (string.IsNullOrEmpty(safeName))
                return Result<ImageInfoDto>.Failure(400, Messages.InvalidFilename);

            folder = folder.ToLowerInvariant()
               .Replace("..", "")
               .Replace("\\", "/")
               .Trim('/');

            if (string.IsNullOrWhiteSpace(folder) || folder.Contains(".."))
                folder = "articles";

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
                ContentType = fileData.ContentType,
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

        public async Task<Result<string>> DownloadAndUploadAsync(string imageUrl, string folder = "uploads")
        {
            folder = folder.ToLowerInvariant()
               .Replace("..", "")
               .Replace("\\", "/")
               .Trim('/');

            if (string.IsNullOrWhiteSpace(folder) || folder.Contains(".."))
                folder = "uploads";

            if (!Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps)
            {
                return Result<string>.Failure(400, "Security Violation: Only HTTPS URLs are allowed.");
            }

            if (NetworkValidator.IsPrivateOrLocalhost(uri.Host))
            {
                _logger.LogWarning("SSRF Attempt blocked for host: {Host}", uri.Host);
                return Result<string>.Failure(403, "Security Violation: Access to private networks is denied.");
            }

            try
            {
                using var httpClient = _httpClientFactory.CreateClient("ImageDownloader");

                // We check headers first before downloading certain body content to fail fast on large files or wrong types.
                using var request = new HttpRequestMessage(HttpMethod.Get, uri);
                using var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

                if (!response.IsSuccessStatusCode)
                    return Result<string>.Failure((int)response.StatusCode, $"Remote server returned {response.StatusCode}");

                var contentLength = response.Content.Headers.ContentLength;
                if (contentLength > 10 * 1024 * 1024) // 10 MB Limit
                    return Result<string>.Failure(413, "Image too large (Max 10MB)");

                var contentType = response.Content.Headers.ContentType?.MediaType;
                if (contentType == null || !contentType.StartsWith("image/"))
                    return Result<string>.Failure(400, "URL does not point to a valid image");

                // Instead of loading the whole file into RAM, we read it as a stream.
                using var stream = await response.Content.ReadAsStreamAsync();
                using var memoryStream = new MemoryStream();

                var buffer = new byte[8192];
                int bytesRead;
                long totalRead = 0;
                bool signatureChecked = false;

                bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
                if (bytesRead > 0)
                {
                    totalRead += bytesRead;
                    await memoryStream.WriteAsync(buffer, 0, bytesRead);

                    var extension = Path.GetExtension(uri.LocalPath)?.ToLowerInvariant().Split('?')[0];
                    if (string.IsNullOrEmpty(extension))
                    {
                        extension = contentType switch
                        {
                            "image/jpeg" => ".jpg",
                            "image/png" => ".png",
                            "image/gif" => ".gif",
                            "image/webp" => ".webp",
                            _ => null
                        };
                    }

                    if (string.IsNullOrEmpty(extension))
                        return Result<string>.Failure(400, "Missing extension and unknown content type.");

                    memoryStream.Position = 0;
                    if (!FileSignatureValidator.IsValidSignature(memoryStream, extension))
                    {
                        return Result<string>.Failure(400, "Invalid file signature (File content does not match extension).");
                    }
                    memoryStream.Position = memoryStream.Length;
                    signatureChecked = true;
                }

                while ((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                {
                    totalRead += bytesRead;

                    if (totalRead > 10 * 1024 * 1024)
                        return Result<string>.Failure(413, "Image exceeded size limit during download");

                    await memoryStream.WriteAsync(buffer, 0, bytesRead);
                }

                if (!signatureChecked) return Result<string>.Failure(400, "Empty file.");

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(uri.LocalPath)?.Split('?')[0] ?? ".jpg"}";
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", folder);

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);

                memoryStream.Position = 0;
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await memoryStream.CopyToAsync(fileStream);
                }

                return Result<string>.Success($"/uploads/{folder}/{fileName}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to download image from {Url}", imageUrl);
                return Result<string>.Failure(500, $"Image download failed: {ex.Message}");
            }
        }
    }
}