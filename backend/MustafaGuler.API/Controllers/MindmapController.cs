using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Utilities.Results;
using MustafaGuler.Service.Services;
using MustafaGuler.Core.Constants;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MindmapController : CustomBaseController
    {
        private readonly IMindmapService _mindmapService;

        public MindmapController(IMindmapService mindmapService)
        {
            _mindmapService = mindmapService;
        }

        [HttpGet("all-active")]
        public async Task<IActionResult> GetAllActive()
        {
            var versionGuid = await _mindmapService.GetVersionAsync();
            var currentETag = $"\"{versionGuid}\"";

            if (Request.Headers.TryGetValue("If-None-Match", out var clientETag))
            {
                if (clientETag.ToString() == currentETag)
                {
                    return StatusCode(304);
                }
            }

            var result = await _mindmapService.GetAllActiveItemTextsAsync();

            if (!result.IsSuccess)
                return CreateActionResultInstance(result);

            Response.Headers["ETag"] = currentETag;
            Response.Headers["Cache-Control"] = "no-cache";

            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mindmapService.GetAllAsync();
            return CreateActionResultInstance(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mindmapService.GetByIdAsync(id);
            return CreateActionResultInstance(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Add([FromBody] MindmapItemAddDto mindmapItemAddDto)
        {
            var result = await _mindmapService.AddAsync(mindmapItemAddDto);
            return CreateActionResultInstance(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] MindmapItemUpdateDto mindmapItemUpdateDto)
        {
            if (id != mindmapItemUpdateDto.Id)
            {
                return CreateActionResultInstance(Result.Failure(400, Messages.IdMismatch));
            }

            var result = await _mindmapService.UpdateAsync(mindmapItemUpdateDto);
            return CreateActionResultInstance(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _mindmapService.DeleteAsync(id);
            return CreateActionResultInstance(result);
        }
    }
}
