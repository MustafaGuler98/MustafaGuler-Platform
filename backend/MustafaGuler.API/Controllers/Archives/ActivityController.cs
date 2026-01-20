using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.API.Controllers.Archives
{
    [Route("api/archives/activity")]
    [ApiController]
    public class ActivityController : CustomBaseController
    {
        private readonly IActivityService _activityService;
        private readonly IPublicActivityService _publicActivityService;

        public ActivityController(IActivityService activityService, IPublicActivityService publicActivityService)
        {
            _activityService = activityService;
            _publicActivityService = publicActivityService;
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllActivities()
        {
            var result = await _activityService.GetAllActivitiesAsync();
            return CreateActionResultInstance(result);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicActivities()
        {
            var result = await _publicActivityService.GetPublicActivitiesAsync();
            return CreateActionResultInstance(result);
        }

        [HttpGet("options/{type}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetOptions(string type)
        {
            var result = await _activityService.GetOptionsForTypeAsync(type);
            return CreateActionResultInstance(result);
        }

        [HttpPut("{type}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateActivity(string type, [FromBody] UpdateActivityDto dto)
        {
            var result = await _activityService.UpdateActivityAsync(type, dto.SelectedItemId);
            return CreateActionResultInstance(result);
        }

        [HttpPut("batch")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBatch([FromBody] List<UpdateActivityDto> dtos)
        {
            var result = await _activityService.UpdateActivitiesAsync(dtos);
            return CreateActionResultInstance(result);
        }


    }
}
