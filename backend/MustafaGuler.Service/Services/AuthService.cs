using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace MustafaGuler.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository, ITokenService tokenService, ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _logger = logger;
        }

        public async Task<Result<TokenDto>> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
            {
                _logger.LogWarning("Failed login attempt for email: {Email} (User not found)", loginDto.Email);
                return Result<TokenDto>.Failure(401, "Invalid email or password.");
            }

            var isPasswordValid = await _userRepository.CheckPasswordAsync(user, loginDto.Password);

            if (!isPasswordValid)
            {
                _logger.LogWarning("Failed login attempt for email: {Email} (Invalid password)", loginDto.Email);
                return Result<TokenDto>.Failure(401, "Invalid email or password.");
            }

            var roles = await _userRepository.GetRolesAsync(user);
            var tokenDto = _tokenService.GenerateToken(user, roles);

            var refreshTokenExpiry = DateTime.UtcNow.AddDays(30);
            await _userRepository.UpdateRefreshTokenAsync(user, tokenDto.RefreshToken, refreshTokenExpiry);

            _logger.LogInformation("User logged in successfully: {UserId}", user.Id);
            return Result<TokenDto>.Success(tokenDto);
        }

        public async Task<Result<TokenDto>> RefreshTokenAsync(string refreshToken)
        {
            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user == null)
            {
                _logger.LogWarning("Failed token refresh attempt (Invalid or expired token)");
                return Result<TokenDto>.Failure(401, "Invalid or expired refresh token.");
            }

            var roles = await _userRepository.GetRolesAsync(user);
            var tokenDto = _tokenService.GenerateToken(user, roles);

            // Keep the same refresh token for now, maybe rotate later for better security
            tokenDto.RefreshToken = refreshToken;

            var refreshTokenExpiry = DateTime.UtcNow.AddDays(30);
            await _userRepository.UpdateRefreshTokenAsync(user, refreshToken, refreshTokenExpiry);

            _logger.LogInformation("Token refreshed successfully for user: {UserId}", user.Id);
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
