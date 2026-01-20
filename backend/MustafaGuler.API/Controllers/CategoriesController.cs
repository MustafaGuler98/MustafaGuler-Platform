using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : CustomBaseController
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllAsync();
            return CreateActionResultInstance(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _categoryService.GetByIdAsync(id);
            return CreateActionResultInstance(result);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _categoryService.GetBySlugAsync(slug);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CategoryAddDto categoryAddDto)
        {
            var result = await _categoryService.AddAsync(categoryAddDto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CategoryUpdateDto categoryUpdateDto)
        {
            if (id != categoryUpdateDto.Id)
                return CreateActionResultInstance(Result.Failure(400, Messages.IdMismatch));

            var result = await _categoryService.UpdateAsync(categoryUpdateDto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _categoryService.DeleteAsync(id);
            return CreateActionResultInstance(result);
        }
    }
}
