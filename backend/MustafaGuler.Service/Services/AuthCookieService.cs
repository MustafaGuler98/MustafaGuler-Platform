using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Interfaces;
using System;

namespace MustafaGuler.Service.Services
{
    public class AuthCookieService : IAuthCookieService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHostEnvironment _env;

        private const string AccessTokenCookie = "accessToken";
        private const string RefreshTokenCookie = "refreshToken";
        private const string TokenExpiresAtCookie = "tokenExpiresAt";

        public AuthCookieService(IHttpContextAccessor httpContextAccessor, IHostEnvironment env)
        {
            _httpContextAccessor = httpContextAccessor;
            _env = env;
        }

        public void SetAuthCookies(TokenDto tokenDto)
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return;

            var secureCookie = !_env.IsDevelopment();

            // Refresh Token (30 days)
            context.Response.Cookies.Append(RefreshTokenCookie, tokenDto.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = secureCookie,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(30),
                Path = "/"
            });

            // Access Token
            context.Response.Cookies.Append(AccessTokenCookie, tokenDto.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = secureCookie,
                SameSite = SameSiteMode.Lax,
                Expires = tokenDto.Expiration,
                Path = "/"
            });

            // Token Expiration (readable by JS for proactive refresh)
            context.Response.Cookies.Append(TokenExpiresAtCookie, new DateTimeOffset(tokenDto.Expiration).ToUnixTimeMilliseconds().ToString(), new CookieOptions
            {
                HttpOnly = false,
                Secure = secureCookie,
                SameSite = SameSiteMode.Lax,
                Expires = tokenDto.Expiration,
                Path = "/"
            });
        }

        public void ClearAuthCookies()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return;

            var secureCookie = !_env.IsDevelopment();

            context.Response.Cookies.Delete(RefreshTokenCookie, new CookieOptions
            {
                HttpOnly = true,
                Secure = secureCookie,
                SameSite = SameSiteMode.Lax,
                Path = "/"
            });

            context.Response.Cookies.Delete(AccessTokenCookie, new CookieOptions
            {
                HttpOnly = true,
                Secure = secureCookie,
                SameSite = SameSiteMode.Lax,
                Path = "/"
            });

            context.Response.Cookies.Delete(TokenExpiresAtCookie, new CookieOptions
            {
                HttpOnly = false,
                Secure = secureCookie,
                SameSite = SameSiteMode.Lax,
                Path = "/"
            });
        }
    }
}
