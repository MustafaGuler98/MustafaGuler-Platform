using Microsoft.AspNetCore.Http;
using MustafaGuler.Core.Interfaces;
using System;
using System.Security.Claims;

namespace MustafaGuler.Service.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? UserId
        {
            get
            {
                var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return null;
                }

                if (Guid.TryParse(userId, out var result))
                {
                    return result;
                }

                return null;
            }
        }
    }
}
