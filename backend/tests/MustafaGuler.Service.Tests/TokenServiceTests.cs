using Microsoft.Extensions.Configuration;
using Moq;
using MustafaGuler.Core.Entities;
using MustafaGuler.Service.Services;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Xunit;

namespace MustafaGuler.Service.Tests
{
    public class TokenServiceTests
    {
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly TokenService _tokenService;
        private readonly AppUser _testUser;

        public TokenServiceTests()
        {
            _mockConfiguration = new Mock<IConfiguration>();
            
            // Setup configuration values for JWT
            _mockConfiguration.Setup(x => x["Token:SecurityKey"]).Returns(TestConstants.Token.SecurityKey);
            _mockConfiguration.Setup(x => x["Token:Issuer"]).Returns(TestConstants.Token.Issuer);
            _mockConfiguration.Setup(x => x["Token:Audience"]).Returns(TestConstants.Token.Audience);

            _testUser = new AppUser
            {
                Id = Guid.NewGuid(),
                Email = TestConstants.Auth.ValidEmail,
                FirstName = TestConstants.User.FirstName,
                LastName = TestConstants.User.LastName
            };

            _tokenService = new TokenService(_mockConfiguration.Object);
        }

        [Fact]
        public void GenerateToken_WhenCalled_ReturnsNonNullTokenDto()
        {
            // Arrange
            var roles = new List<string> { "Admin" };

            // Act
            var result = _tokenService.GenerateToken(_testUser, roles);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.AccessToken);
            Assert.NotNull(result.RefreshToken);
            Assert.False(string.IsNullOrEmpty(result.AccessToken));
            Assert.False(string.IsNullOrEmpty(result.RefreshToken));
        }

        [Fact]
        public void GenerateToken_WhenCalled_ExpirationIsInFuture()
        {
            // Arrange
            var roles = new List<string> { "Admin" };

            // Act
            var result = _tokenService.GenerateToken(_testUser, roles);

            // Assert
            Assert.True(result.Expiration > DateTime.UtcNow);
        }

        [Fact]
        public void GenerateToken_WhenCalled_TokenContainsUserIdClaim()
        {
            // Arrange
            var roles = new List<string> { "Admin" };

            // Act
            var result = _tokenService.GenerateToken(_testUser, roles);
            var claims = DecodeToken(result.AccessToken);

            // Assert
            var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            Assert.NotNull(userIdClaim);
            Assert.Equal(_testUser.Id.ToString(), userIdClaim.Value);
        }

        [Fact]
        public void GenerateToken_WhenCalled_TokenContainsEmailClaim()
        {
            // Arrange
            var roles = new List<string> { "Admin" };

            // Act
            var result = _tokenService.GenerateToken(_testUser, roles);
            var claims = DecodeToken(result.AccessToken);

            // Assert
            var emailClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            Assert.NotNull(emailClaim);
            Assert.Equal(_testUser.Email, emailClaim.Value);
        }

        [Fact]
        public void GenerateToken_WhenUserHasRoles_TokenContainsRoleClaims()
        {
            // Arrange
            var roles = new List<string> { "Admin", "Editor" };

            // Act
            var result = _tokenService.GenerateToken(_testUser, roles);
            var claims = DecodeToken(result.AccessToken);

            // Assert
            var roleClaims = claims.Where(c => c.Type == ClaimTypes.Role).ToList();
            Assert.Equal(2, roleClaims.Count);
            Assert.Contains(roleClaims, c => c.Value == "Admin");
            Assert.Contains(roleClaims, c => c.Value == "Editor");
        }

        [Fact]
        public void GenerateToken_CalledMultipleTimes_RefreshTokensAreUnique()
        {
            // Arrange
            var roles = new List<string> { "Admin" };

            // Act
            var result1 = _tokenService.GenerateToken(_testUser, roles);
            var result2 = _tokenService.GenerateToken(_testUser, roles);

            // Assert
            Assert.NotEqual(result1.RefreshToken, result2.RefreshToken);
        }

        private IEnumerable<Claim> DecodeToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            return jwtToken.Claims;
        }
    }
}
