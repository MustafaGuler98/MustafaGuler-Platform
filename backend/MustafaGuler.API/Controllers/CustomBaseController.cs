using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomBaseController : ControllerBase
    {
        [NonAction]
        public IActionResult CreateActionResultInstance<T>(Result<T> result)
        {
            return new ObjectResult(result)
            {
                StatusCode = result.StatusCode
            };
        }
        [NonAction]
        public IActionResult CreateActionResultInstance(Result result)
        {
            return new ObjectResult(result)
            {
                StatusCode = result.StatusCode
            };
        }
    }
}