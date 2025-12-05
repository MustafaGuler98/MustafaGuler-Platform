using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
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

            if (result.Success) return Ok(result);
            return BadRequest(result);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _articleService.GetBySlugAsync(slug);

            if (result.Success)
            {
                return Ok(result);
            }

            return NotFound(result);
        }

        [HttpPost]
        public async Task<IActionResult> Save(ArticleAddDto articleAddDto)
        {
            var result = await _articleService.AddAsync(articleAddDto);

            if (result.Success) return Ok(result);
            return BadRequest(result);
        }
        [HttpGet("test-error")]
        public IActionResult TestError()
        {
            throw new InvalidOperationException("Test log.");
        }
    }
}