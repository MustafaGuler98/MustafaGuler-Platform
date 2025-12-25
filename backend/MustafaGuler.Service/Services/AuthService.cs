using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;

        public AuthService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public async Task<Result<TokenDto>> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return Result<TokenDto>.Failure(401, "Invalid email or password.");
            }

            var isPasswordValid = await _userRepository.CheckPasswordAsync(user, loginDto.Password);

            if (!isPasswordValid)
            {
                return Result<TokenDto>.Failure(401, "Invalid email or password.");
            }

            var roles = await _userRepository.GetRolesAsync(user);
            var tokenDto = _tokenService.GenerateToken(user, roles);

            var refreshTokenExpiry = DateTime.UtcNow.AddDays(30);
            await _userRepository.UpdateRefreshTokenAsync(user, tokenDto.RefreshToken, refreshTokenExpiry);

            return Result<TokenDto>.Success(tokenDto);
        }

        public async Task<Result<TokenDto>> RefreshTokenAsync(string refreshToken)
        {
            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user == null)
            {
                return Result<TokenDto>.Failure(401, "Invalid or expired refresh token.");
            }

            var roles = await _userRepository.GetRolesAsync(user);
            var tokenDto = _tokenService.GenerateToken(user, roles);

            // Keep the same refresh token for now, maybe rotate later for better security
            tokenDto.RefreshToken = refreshToken;

            var refreshTokenExpiry = DateTime.UtcNow.AddDays(30);
            await _userRepository.UpdateRefreshTokenAsync(user, refreshToken, refreshTokenExpiry);

            return Result<TokenDto>.Success(tokenDto);
        }

        public async Task<Result> LogoutAsync(Guid userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                return Result.Failure(404, "User not found.");
            }

            await _userRepository.ClearRefreshTokenAsync(user);

            return Result.Success();
        }
    }
}
