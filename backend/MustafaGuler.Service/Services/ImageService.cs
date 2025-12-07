using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Helpers;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;

        public ImageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<Result<string>> UploadAsync(IFormFile file, string customName)
        {
            if (file == null || file.Length == 0)
                return Result<string>.Failure(400, Messages.NoFileUploaded);

            long fileSizeLimit = 5 * 1024 * 1024;
            if (file.Length > fileSizeLimit)
                return Result<string>.Failure(400, Messages.FileSizeLimitExceeded);

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return Result<string>.Failure(400, Messages.InvalidFileType);

            string safeName = SlugHelper.GenerateSlug(customName);

            if (string.IsNullOrEmpty(safeName))
                return Result<string>.Failure(400, Messages.InvalidFilename);

            string fileName = $"{safeName}{extension}";

            string folderPath = Path.Combine(_env.WebRootPath, "uploads", "articles");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            string filePath = Path.Combine(folderPath, fileName);

            if (File.Exists(filePath))
            {
                return Result<string>.Failure(409, string.Format(Messages.FileAlreadyExists, safeName));
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            string returnPath = $"/uploads/articles/{fileName}";
            return Result<string>.Success(returnPath, 201, Messages.ImageUploaded);
        }
    }
}