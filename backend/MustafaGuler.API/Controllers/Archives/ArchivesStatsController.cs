using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.Interfaces.Archives;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers.Archives
{
    [Route("api/archives/stats")]
    [ApiController]
    public class ArchivesStatsController : CustomBaseController
    {
        private readonly IArchivesStatsService _statsService;

        public ArchivesStatsController(IArchivesStatsService statsService)
        {
            _statsService = statsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStats()
        {
            var result = await _statsService.GetStatsAsync();
            return CreateActionResultInstance(result);
        }


    }
}

