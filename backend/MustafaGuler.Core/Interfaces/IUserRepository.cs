using MustafaGuler.Core.Entities;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<AppUser?> GetUserByEmailAsync(string email);
        Task<AppUser?> GetUserByIdAsync(Guid userId);
        Task<AppUser?> GetUserByRefreshTokenAsync(string refreshToken);
        Task<bool> CheckPasswordAsync(AppUser user, string password);
        Task UpdateRefreshTokenAsync(AppUser user, string refreshToken, DateTime refreshTokenEndDate);
        Task ClearRefreshTokenAsync(AppUser user);
        Task<IList<string>> GetRolesAsync(AppUser user);
    }
}
