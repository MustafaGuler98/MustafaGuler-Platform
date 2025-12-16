using MustafaGuler.Core.Entities;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<AppUser?> GetUserByEmailAsync(string email);
        Task<bool> CheckPasswordAsync(AppUser user, string password);
        Task UpdateRefreshTokenAsync(AppUser user, string refreshToken, DateTime refreshTokenEndDate);
    }
}
