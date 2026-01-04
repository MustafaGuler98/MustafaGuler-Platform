using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustafaGuler.API.Extensions;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Interfaces;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IAuthCookieService _authCookieService;

        public AuthController(IAuthService authService, IAuthCookieService authCookieService)
        {
            _authService = authService;
            _authCookieService = authCookieService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);

            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode, new { message = result.Message });
            }

            _authCookieService.SetAuthCookies(result.Data!);
            return Ok(new { message = "Login successful" });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "Refresh token not found." });
            }

            var result = await _authService.RefreshTokenAsync(refreshToken);

            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode, new { message = result.Message });
            }

            _authCookieService.SetAuthCookies(result.Data!);
            return Ok(new { message = "Token refreshed." });
        }

        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            _authCookieService.ClearAuthCookies();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var userId))
            {
                await _authService.LogoutAsync(userId);
            }

            return Ok(new { message = "Logged out successfully." });
        }
    }
}
