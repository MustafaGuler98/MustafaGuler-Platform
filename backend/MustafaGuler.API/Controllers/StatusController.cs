using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Repository.Contexts;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatusController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Check()
        {
            try
            {
                bool canConnect = _context.Database.CanConnect();
                return canConnect
                    ? Ok(new { status = "Online", database = "Connected", time = DateTime.UtcNow })
                    : StatusCode(503, new { status = "Offline", database = "Disconnected" });
            }
            catch (Exception ex)
            {
                return StatusCode(503, new { status = "Error", error = ex.Message });
            }
        }
    }
}