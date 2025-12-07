using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs;
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

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _articleService.GetBySlugAsync(slug);
            return CreateActionResultInstance(result);
        }

        [HttpPost]
        public async Task<IActionResult> Save(ArticleAddDto articleAddDto)
        {
            var result = await _articleService.AddAsync(articleAddDto);
            return CreateActionResultInstance(result);
        }
        [HttpGet("test-error")]
        public IActionResult TestError()
        {
            throw new InvalidOperationException("Test log.");
        }
    }
}