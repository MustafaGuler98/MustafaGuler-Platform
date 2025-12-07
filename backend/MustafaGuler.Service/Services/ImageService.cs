using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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

        public async Task<IDataResult<string>> UploadAsync(IFormFile file, string customName)
        {
            if (file == null || file.Length == 0)
                return new ErrorDataResult<string>("No file uploaded.");

            long fileSizeLimit = 5 * 1024 * 1024;
            if (file.Length > fileSizeLimit)
                return new ErrorDataResult<string>("File size exceeds the 5MB limit.");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return new ErrorDataResult<string>("Invalid file type. Only JPG, JPEG, and PNG are allowed.");

            string safeName = SlugHelper.GenerateSlug(customName);

            if (string.IsNullOrEmpty(safeName))
                return new ErrorDataResult<string>("Invalid filename provided.");

            string fileName = $"{safeName}{extension}";

            string folderPath = Path.Combine(_env.WebRootPath, "uploads", "articles");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            string filePath = Path.Combine(folderPath, fileName);

            if (File.Exists(filePath))
            {
                return new ErrorDataResult<string>($"A file with the name '{safeName}' already exists. Please choose a different name.");
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            string returnPath = $"/uploads/articles/{fileName}";
            return new SuccessDataResult<string>(returnPath, "Image uploaded successfully.");
        }
    }
}