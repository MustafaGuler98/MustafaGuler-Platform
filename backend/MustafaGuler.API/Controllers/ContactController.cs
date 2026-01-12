using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MustafaGuler.Core.DTOs.Contact;
using MustafaGuler.Core.Interfaces;

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
    }
}
