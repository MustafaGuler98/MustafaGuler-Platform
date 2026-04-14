using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.Interfaces;
using NetVips;
using System;
using System.IO;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services
{
    public class ImageOptimizerService : IImageOptimizerService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ImageOptimizerService> _logger;

        public ImageOptimizerService(IWebHostEnvironment env, ILogger<ImageOptimizerService> logger)
        {
            _env = env;
            _logger = logger;
            
            // Note: Preventing memory bloating in long-running services
            Cache.Max = 0;
        }

        public async Task<string> GetOrGenerateOptimizedImageAsync(string sourceUrl, int width, int quality, string format, string outputCacheDir)
        {
            string sourceRelativePath = sourceUrl.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
            string sourcePhysicalPath = Path.GetFullPath(Path.Combine(_env.WebRootPath, sourceRelativePath));
            string rootPhysicalPath = Path.GetFullPath(_env.WebRootPath);

            if (!sourcePhysicalPath.StartsWith(rootPhysicalPath, StringComparison.OrdinalIgnoreCase))
            {
                throw new UnauthorizedAccessException("Image optimization requested outside of application root.");
            }

            if (!File.Exists(sourcePhysicalPath))
            {
                throw new FileNotFoundException($"Source image not found at path: {sourcePhysicalPath}");
            }

            string pathWithoutUploads = sourceUrl.TrimStart('/', '\\')
                                                 .Replace("uploads/", "", StringComparison.OrdinalIgnoreCase)
                                                 .Replace("uploads\\", "", StringComparison.OrdinalIgnoreCase);
            string subFolder = Path.GetDirectoryName(pathWithoutUploads) ?? "";
            
            string finalCacheDir = Path.Combine(outputCacheDir, subFolder);
            if (!Directory.Exists(finalCacheDir))
            {
                Directory.CreateDirectory(finalCacheDir);
            }

            // kedi.jpg -> kedi_jpg (Prevents collision between kedi.jpg and kedi.png)
            string originalFileName = Path.GetFileName(sourcePhysicalPath).Replace(".", "_");
            string cachedFileName = $"{originalFileName}__w{width}_q{quality}.{format}";
            string cachedFilePath = Path.Combine(finalCacheDir, cachedFileName);

            if (File.Exists(cachedFilePath))
            {
                return cachedFilePath;
            }

            try
            {

                await Task.Run(() => 
                {
                    string tempFileName = $"{Guid.NewGuid()}.tmp";
                    string tempFilePath = Path.Combine(finalCacheDir, tempFileName);
                    
                    GenerateImage(sourcePhysicalPath, tempFilePath, width, quality, format);
                    
                    try 
                    {
                        File.Move(tempFilePath, cachedFilePath, overwrite: true);
                    }
                    catch (IOException) 
                    {
                        if (File.Exists(tempFilePath))
                        {
                            File.Delete(tempFilePath);
                        }
                    }
                });
                return cachedFilePath;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate optimized image for {SourcePath}. Format: {Format}, Width: {Width}", sourcePhysicalPath, format, width);
                throw;
            }
        }

        private void GenerateImage(string sourcePhysicalPath, string targetPhysicalPath, int width, int quality, string format)
        {

            using var image = Image.Thumbnail(sourcePhysicalPath, width, height: 10000); 

            if (format.Equals("avif", StringComparison.OrdinalIgnoreCase))
            {
                image.Heifsave(targetPhysicalPath, q: quality, compression: Enums.ForeignHeifCompression.Av1);
            }
            else if (format.Equals("webp", StringComparison.OrdinalIgnoreCase))
            {
                image.Webpsave(targetPhysicalPath, q: quality);
            }
            else
            {
                image.Jpegsave(targetPhysicalPath, q: quality);
            }
        }
    }
}
