using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.API.Models;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : CustomBaseController
    {
        private readonly IImageService _imageService;
        private readonly IImageOptimizerService _imageOptimizer;

        private static readonly int[] AllowedWidths = new[] { 48, 96, 128, 256, 384, 640, 828, 1080, 1200, 1920 };
        private static readonly int[] AllowedQualities = new[] { 50, 75, 100 };

        public ImagesController(IImageService imageService, IImageOptimizerService imageOptimizer)
        {
            _imageService = imageService;
            _imageOptimizer = imageOptimizer;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] ImageUploadRequest request)
        {
            if (request.File == null || request.File.Length == 0)
            {
                return CreateActionResultInstance(Result<ImageInfoDto>.Failure(400, Messages.NoFileUploaded));
            }

            var fileData = new FileUploadData
            {
                Content = request.File.OpenReadStream(),
                FileName = request.File.FileName,
                ContentType = request.File.ContentType,
                Length = request.File.Length
            };

            var result = await _imageService.UploadAsync(fileData, request.CustomName, request.Folder ?? "articles");
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetPaged([FromQuery] ImageQueryParams queryParams)
        {
            var result = await _imageService.GetPagedAsync(queryParams);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ImageUpdateDto dto)
        {
            var result = await _imageService.UpdateAsync(id, dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _imageService.DeleteAsync(id);
            return CreateActionResultInstance(result);
        }

        [AllowAnonymous]
        [HttpGet("resize")]
        public async Task<IActionResult> Resize([FromQuery] string url, [FromQuery] int w, [FromQuery] int q = 75)
        {
            if (string.IsNullOrEmpty(url) || url.Contains("..") || url.Contains("%2e"))
            {
                return BadRequest("Invalid image source.");
            }

            var normalizedUrl = url.Replace('\\', '/');
            if (!normalizedUrl.StartsWith("/uploads/articles/") && !normalizedUrl.StartsWith("/uploads/avatars/"))
            {
                return BadRequest("Image source not allowed for optimization.");
            }

            if (Array.IndexOf(AllowedWidths, w) < 0)
            {
                return BadRequest("Requested width is not allowed.");
            }

            if (Array.IndexOf(AllowedQualities, q) < 0)
            {
                return BadRequest("Requested quality is not allowed.");
            }

            var acceptHeader = Request.Headers["Accept"].ToString();
            string format = acceptHeader.Contains("image/avif") ? "avif" : "webp";

            string cacheDir = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "cache");
            
            try
            {
                string phyPath = await _imageOptimizer.GetOrGenerateOptimizedImageAsync(url, w, q, format, cacheDir);
                var mimeType = format == "avif" ? "image/avif" : "image/webp";
                
                Response.Headers.Append("Cache-Control", "public,max-age=31536000,immutable");
                
                return PhysicalFile(phyPath, mimeType);
            }
            catch (System.IO.FileNotFoundException)
            {
                return NotFound(new { message = "Image not found." });
            }
            catch (System.Exception)
            {
                // We should NOT expose the internal exception details to the Anonymous client.
                return StatusCode(500, new { message = "Internal server error while processing image." });
            }
        }
    }
}
