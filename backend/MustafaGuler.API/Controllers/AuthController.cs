using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MustafaGuler.API.Extensions;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace MustafaGuler.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : CustomBaseController
    {
        private readonly IAuthService _authService;
        private readonly IAuthCookieService _authCookieService;

        public AuthController(IAuthService authService, IAuthCookieService authCookieService)
        {
            _authService = authService;
            _authCookieService = authCookieService;
        }

        [HttpPost("login")]
        [EnableRateLimiting("LoginPolicy")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);

            if (result.IsSuccess)
            {
                _authCookieService.SetAuthCookies(result.Data!);
                return CreateActionResultInstance(Result.Success(200, Messages.LoginSuccessful));
            }

            return CreateActionResultInstance(result);
        }

        [HttpPost("refresh")]
        [EnableRateLimiting("SearchPolicy")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return CreateActionResultInstance(Result<TokenDto>.Failure(401, Messages.Unauthorized));
            }

            var result = await _authService.RefreshTokenAsync(refreshToken);

            if (result.IsSuccess)
            {
                _authCookieService.SetAuthCookies(result.Data!);
                return CreateActionResultInstance(Result.Success(200, Messages.TokenRefreshed));
            }

            return CreateActionResultInstance(result);
        }

        [HttpGet("me")]
        public IActionResult Me()
        {
            if (User?.Identity?.IsAuthenticated != true)
            {
                return CreateActionResultInstance(Result<object>.Failure(401, Messages.Unauthorized));
            }

            var email = User.FindFirst(ClaimTypes.Email)?.Value ?? User.FindFirst("email")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;

            return CreateActionResultInstance(Result<object>.Success(new
            {
                email,
                role
            }));
        }

        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            _authCookieService.ClearAuthCookies();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var userId))
            {
                var result = await _authService.LogoutAsync(userId);
                return CreateActionResultInstance(result);
            }

            return CreateActionResultInstance(Result.Success(200, Messages.LogoutSuccessful));
        }
    }
}
