using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MustafaGuler.Core.DTOs.Contact;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Parameters;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : CustomBaseController
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost]
        [EnableRateLimiting("ContactPolicy")]
        public async Task<IActionResult> Submit([FromBody] CreateContactMessageDto dto)
        {
            var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
            var result = await _contactService.SubmitContactFormAsync(dto, clientIp);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] PaginationParams paginationParams)
        {
            var result = await _contactService.GetPagedListAsync(paginationParams);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _contactService.GetByIdAsync(id);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("subscribers")]
        public async Task<IActionResult> GetSubscribers()
        {
            var result = await _contactService.GetSubscribersAsync();
            return CreateActionResultInstance(result);
        }
    }
}
