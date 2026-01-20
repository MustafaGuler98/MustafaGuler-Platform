using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Parameters;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers.Archives
{
    [Route("api/archives/quotes")]
    [ApiController]
    public class QuotesController : CustomBaseController
    {
        private readonly IQuoteService _quoteService;

        public QuotesController(IQuoteService quoteService)
        {
            _quoteService = quoteService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] ArchiveQueryParams queryParams)
        {
            var result = await _quoteService.GetPagedListAsync(queryParams);
            return CreateActionResultInstance(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _quoteService.GetByIdAsync(id);
            return CreateActionResultInstance(result);
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandom()
        {
            var result = await _quoteService.GetRandomAsync();
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateQuoteDto dto)
        {
            var result = await _quoteService.AddAsync(dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateQuoteDto dto)
        {
            var result = await _quoteService.UpdateAsync(id, dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _quoteService.DeleteAsync(id);
            return CreateActionResultInstance(result);
        }
    }
}
