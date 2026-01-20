using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Parameters;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers.Archives
{
    [Route("api/archives/books")]
    [ApiController]
    public class BooksController : CustomBaseController
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] ArchiveQueryParams queryParams)
        {
            var result = await _bookService.GetPagedListAsync(queryParams);
            return CreateActionResultInstance(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _bookService.GetByIdAsync(id);
            return CreateActionResultInstance(result);
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandom()
        {
            var result = await _bookService.GetRandomAsync();
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateBookDto dto)
        {
            var result = await _bookService.AddAsync(dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBookDto dto)
        {
            var result = await _bookService.UpdateAsync(id, dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _bookService.DeleteAsync(id);
            return CreateActionResultInstance(result);
        }
    }
}
