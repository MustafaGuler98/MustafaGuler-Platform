using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : CustomBaseController
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? languageCode, [FromQuery] Guid? categoryId)
        {
            var result = await _articleService.GetAllAsync(languageCode, categoryId);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("paged")]
        [EnableRateLimiting("SearchPolicy")]
        public async Task<IActionResult> GetPaged([FromQuery] ArticleQueryParams queryParams)
        {
            var result = await _articleService.GetPagedListAsync(queryParams);
            return CreateActionResultInstance(result);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _articleService.GetBySlugAsync(slug);
            return CreateActionResultInstance(result);
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetPopular([FromQuery] int count = 9, [FromQuery] string? languageCode = null)
        {
            var result = await _articleService.GetPopularAsync(count, languageCode);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] ArticleAddDto articleAddDto)
        {
            var result = await _articleService.AddAsync(articleAddDto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _articleService.GetByIdAsync(id);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ArticleUpdateDto articleUpdateDto)
        {
            if (id != articleUpdateDto.Id)
                return BadRequest("Id mismatch");

            var result = await _articleService.UpdateAsync(articleUpdateDto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _articleService.DeleteAsync(id);
            return CreateActionResultInstance(result);
        }

        [HttpGet("test-error")]
        public IActionResult TestError()
        {
            throw new InvalidOperationException("Test log.");
        }
    }
}