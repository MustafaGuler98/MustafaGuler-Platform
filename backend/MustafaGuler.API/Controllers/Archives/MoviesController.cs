using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Parameters;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers.Archives
{
    [Route("api/archives/movies")]
    [ApiController]
    public class MoviesController : CustomBaseController
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] ArchiveQueryParams queryParams)
        {
            var result = await _movieService.GetPagedListAsync(queryParams);
            return CreateActionResultInstance(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _movieService.GetByIdAsync(id);
            return CreateActionResultInstance(result);
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandom()
        {
            var result = await _movieService.GetRandomAsync();
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateMovieDto dto)
        {
            var result = await _movieService.AddAsync(dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMovieDto dto)
        {
            var result = await _movieService.UpdateAsync(id, dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _movieService.DeleteAsync(id);
            return CreateActionResultInstance(result);
        }
    }
}
