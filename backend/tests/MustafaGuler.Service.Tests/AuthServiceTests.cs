using Moq;
using MustafaGuler.Core.DTOs;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Service.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace MustafaGuler.Service.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly Mock<Microsoft.Extensions.Logging.ILogger<AuthService>> _mockLogger;
        private readonly AuthService _authService;

        private readonly Guid _testUserId = Guid.NewGuid();
        private readonly AppUser _testUser;
        private readonly TokenDto _testTokenDto;

        public AuthServiceTests()
        {
            _mockUserRepo = new Mock<IUserRepository>();
            _mockTokenService = new Mock<ITokenService>();
            _mockLogger = new Mock<Microsoft.Extensions.Logging.ILogger<AuthService>>();

            _testUser = new AppUser
            {
                Id = _testUserId,
                Email = TestConstants.Auth.ValidEmail,
                FirstName = TestConstants.User.FirstName,
                LastName = TestConstants.User.LastName,
                RefreshToken = TestConstants.Auth.ValidRefreshToken,
                RefreshTokenEndDate = DateTime.UtcNow.AddDays(30)
            };

            _testTokenDto = new TokenDto
            {
                AccessToken = TestConstants.Token.FakeJwtToken,
                RefreshToken = TestConstants.Auth.ValidRefreshToken,
                Expiration = DateTime.UtcNow.AddDays(1)
            };

            _authService = new AuthService(_mockUserRepo.Object, _mockTokenService.Object, _mockLogger.Object);
        }

        #region LoginAsync Tests

        private void ConfigureLoginMocks(string email, string password, AppUser? user, bool isPasswordValid, TokenDto? token = null)
        {
            _mockUserRepo.Setup(x => x.GetUserByEmailAsync(email)).ReturnsAsync(user);

            if (user != null)
            {
                _mockUserRepo.Setup(x => x.CheckPasswordAsync(user, password)).ReturnsAsync(isPasswordValid);

                if (isPasswordValid)
                {
                    _mockUserRepo.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(new List<string> { "Admin" });

                    if (token != null)
                    {
                        _mockTokenService.Setup(x => x.GenerateToken(user, It.IsAny<IList<string>>()))
                                         .Returns(token);
                    }
                }
            }
        }



        [Fact]
        public async Task LoginAsync_WhenCredentialsValid_ReturnsTokenDto()
        {
            // Arrange
            var loginDto = new LoginDto { Email = TestConstants.Auth.ValidEmail, Password = TestConstants.Auth.ValidPassword };
            ConfigureLoginMocks(loginDto.Email, loginDto.Password, _testUser, true, _testTokenDto);

            // Act
            var result = await _authService.LoginAsync(loginDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.Equal(_testTokenDto.AccessToken, result.Data.AccessToken);

            _mockUserRepo.Verify(x => x.UpdateRefreshTokenAsync(
                _testUser,
                It.IsAny<string>(),
                It.IsAny<DateTime>()), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_WhenUserNotFound_Returns401()
        {
            // Arrange
            var loginDto = new LoginDto { Email = TestConstants.Auth.InvalidEmail, Password = TestConstants.Auth.ValidPassword };
            ConfigureLoginMocks(loginDto.Email, loginDto.Password, null, false);

            // Act
            var result = await _authService.LoginAsync(loginDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(401, result.StatusCode);
            Assert.Contains("Invalid email or password", result.Message);

            _mockUserRepo.Verify(x => x.CheckPasswordAsync(It.IsAny<AppUser>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task LoginAsync_WhenPasswordInvalid_Returns401()
        {
            // Arrange
            var loginDto = new LoginDto { Email = TestConstants.Auth.ValidEmail, Password = TestConstants.Auth.InvalidPassword };
            ConfigureLoginMocks(loginDto.Email, loginDto.Password, _testUser, false);

            // Act
            var result = await _authService.LoginAsync(loginDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(401, result.StatusCode);

            _mockTokenService.Verify(x => x.GenerateToken(It.IsAny<AppUser>(), It.IsAny<IList<string>>()), Times.Never);
        }

        [Fact]
        public async Task LoginAsync_WhenSuccessful_UpdatesRefreshTokenInDb()
        {
            // Arrange
            var loginDto = new LoginDto { Email = TestConstants.Auth.ValidEmail, Password = TestConstants.Auth.ValidPassword };
            ConfigureLoginMocks(loginDto.Email, loginDto.Password, _testUser, true, _testTokenDto);

            // Act
            await _authService.LoginAsync(loginDto);

            // Assert - Verify refresh token is saved with future expiry date
            _mockUserRepo.Verify(x => x.UpdateRefreshTokenAsync(
                _testUser,
                _testTokenDto.RefreshToken,
                It.Is<DateTime>(d => d > DateTime.UtcNow)), Times.Once);
        }

        #endregion

        #region RefreshTokenAsync Tests

        [Fact]
        public async Task RefreshTokenAsync_WhenTokenValid_ReturnsNewAccessToken()
        {
            // Arrange
            _mockUserRepo.Setup(x => x.GetUserByRefreshTokenAsync(TestConstants.Auth.ValidRefreshToken))
                         .ReturnsAsync(_testUser);
            _mockUserRepo.Setup(x => x.GetRolesAsync(_testUser))
                         .ReturnsAsync(new List<string> { "Admin" });
            _mockTokenService.Setup(x => x.GenerateToken(_testUser, It.IsAny<IList<string>>()))
                             .Returns(_testTokenDto);

            // Act
            var result = await _authService.RefreshTokenAsync(TestConstants.Auth.ValidRefreshToken);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Data);
            Assert.NotNull(result.Data.AccessToken);
        }

        [Fact]
        public async Task RefreshTokenAsync_WhenTokenInvalid_Returns401()
        {
            // Arrange
            _mockUserRepo.Setup(x => x.GetUserByRefreshTokenAsync(TestConstants.Auth.InvalidRefreshToken))
                         .ReturnsAsync((AppUser?)null);

            // Act
            var result = await _authService.RefreshTokenAsync(TestConstants.Auth.InvalidRefreshToken);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(401, result.StatusCode);
            Assert.Contains("Invalid or expired refresh token", result.Message);
        }

        [Fact]
        public async Task RefreshTokenAsync_WhenValid_ExtendRefreshTokenExpiry()
        {
            // Arrange
            _mockUserRepo.Setup(x => x.GetUserByRefreshTokenAsync(TestConstants.Auth.ValidRefreshToken))
                         .ReturnsAsync(_testUser);
            _mockUserRepo.Setup(x => x.GetRolesAsync(_testUser))
                         .ReturnsAsync(new List<string> { "Admin" });
            _mockTokenService.Setup(x => x.GenerateToken(_testUser, It.IsAny<IList<string>>()))
                             .Returns(_testTokenDto);

            // Act
            await _authService.RefreshTokenAsync(TestConstants.Auth.ValidRefreshToken);

            // Assert - Verify token expiry is extended
            _mockUserRepo.Verify(x => x.UpdateRefreshTokenAsync(
                _testUser,
                TestConstants.Auth.ValidRefreshToken,
                It.Is<DateTime>(d => d > DateTime.UtcNow.AddDays(29))), Times.Once);
        }

        #endregion

        #region LogoutAsync Tests

        [Fact]
        public async Task LogoutAsync_WhenUserExists_ClearsRefreshToken()
        {
            // Arrange
            _mockUserRepo.Setup(x => x.GetUserByIdAsync(_testUserId))
                         .ReturnsAsync(_testUser);

            // Act
            var result = await _authService.LogoutAsync(_testUserId);

            // Assert
            Assert.True(result.IsSuccess);
            _mockUserRepo.Verify(x => x.ClearRefreshTokenAsync(_testUser), Times.Once);
        }

        [Fact]
        public async Task LogoutAsync_WhenUserNotFound_Returns404()
        {
            // Arrange
            var nonExistentUserId = Guid.NewGuid();
            _mockUserRepo.Setup(x => x.GetUserByIdAsync(nonExistentUserId))
                         .ReturnsAsync((AppUser?)null);

            // Act
            var result = await _authService.LogoutAsync(nonExistentUserId);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);

            _mockUserRepo.Verify(x => x.ClearRefreshTokenAsync(It.IsAny<AppUser>()), Times.Never);
        }

        #endregion
    }
}
