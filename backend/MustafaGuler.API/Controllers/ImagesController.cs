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

        public ImagesController(IImageService imageService)
        {
            _imageService = imageService;
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
    }
}
