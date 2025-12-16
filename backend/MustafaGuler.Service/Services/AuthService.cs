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

        // We inject interfaces, not concrete implementations - this is the core of Onion Architecture
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
                // Generic message prevents email enumeration attacks
                return Result<TokenDto>.Failure(401, "Invalid email or password.");
            }

            var isPasswordValid = await _userRepository.CheckPasswordAsync(user, loginDto.Password);

            if (!isPasswordValid)
            {
                return Result<TokenDto>.Failure(401, "Invalid email or password.");
            }

            var tokenDto = await _tokenService.GenerateTokenAsync(user);

            // Refresh token expires in 30 days - stored in DB for validation on refresh requests
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(30);
            await _userRepository.UpdateRefreshTokenAsync(user, tokenDto.RefreshToken, refreshTokenExpiry);

            return Result<TokenDto>.Success(tokenDto);
        }
    }
}
