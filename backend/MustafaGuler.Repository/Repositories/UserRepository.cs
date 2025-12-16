using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.Repository.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<AppUser> _userManager;

        public UserRepository(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<AppUser?> GetUserByEmailAsync(string email)
        {
            return await _userManager.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> CheckPasswordAsync(AppUser user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        public async Task UpdateRefreshTokenAsync(AppUser user, string refreshToken, DateTime refreshTokenEndDate)
        {
            user.RefreshToken = refreshToken;
            user.RefreshTokenEndDate = refreshTokenEndDate;

            await _userManager.UpdateAsync(user);
        }
    }
}
