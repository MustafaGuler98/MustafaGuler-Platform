using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;

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
        public async Task<IActionResult> GetAll()
        {
            var articles = await _articleService.GetAllAsync();
            return Ok(articles);
        }

        [HttpPost]
        public async Task<IActionResult> Save(Article article)
        {
            // For testing purposes only.
            // We will use DTOs here, not the Entity directly.
            var newArticle = await _articleService.AddAsync(article);
            return Ok(newArticle);
        }
    }
}