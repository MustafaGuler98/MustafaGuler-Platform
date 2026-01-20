using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.DTOs.Archives.Spotlight;
using MustafaGuler.Core.Interfaces.Archives;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MustafaGuler.API.Controllers.Archives
{
    [Route("api/archives/spotlight")]
    [ApiController]
    public class SpotlightController : CustomBaseController
    {
        private readonly ISpotlightService _spotlightService;

        public SpotlightController(ISpotlightService spotlightService)
        {
            _spotlightService = spotlightService;
        }

        [HttpGet("public/{category}")]
        public async Task<IActionResult> GetCurrentSpotlight(string category)
        {
            var result = await _spotlightService.GetCurrentSpotlightAsync(category);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/history/{category}")]
        public async Task<IActionResult> GetSpotlightHistory(string category)
        {
            var result = await _spotlightService.GetSpotlightHistoryAsync(category);
            return CreateActionResultInstance(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("admin/manual")]
        public async Task<IActionResult> SetManualSpotlight([FromBody] ManualSpotlightRequestDto request)
        {
            var result = await _spotlightService.SetManualSpotlightAsync(request.Category, request.ItemId, request.EndDate);
            return CreateActionResultInstance(result);
        }
    }


}
