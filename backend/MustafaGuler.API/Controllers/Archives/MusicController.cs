using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Parameters;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers.Archives
{
    [Route("api/archives/music")]
    [ApiController]
    public class MusicController : CustomBaseController
    {
        private readonly IMusicService _service;

        public MusicController(IMusicService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] ArchiveQueryParams queryParams)
        {
            var result = await _service.GetPagedListAsync(queryParams);
            return CreateActionResultInstance(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return CreateActionResultInstance(result);
        }

        [HttpGet("random")]
        public async Task<IActionResult> GetRandom()
        {
            var result = await _service.GetRandomAsync();
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateMusicDto dto)
        {
            var result = await _service.AddAsync(dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMusicDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _service.DeleteAsync(id);
            return CreateActionResultInstance(result);
        }
    }
}
