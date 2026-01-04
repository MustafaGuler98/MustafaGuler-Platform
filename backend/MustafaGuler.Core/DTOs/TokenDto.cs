using System;

namespace MustafaGuler.Core.DTOs
{
    public class TokenDto
    {
        public string AccessToken { get; set; } = null!;
        public DateTime Expiration { get; set; }
        public string RefreshToken { get; set; } = null!;
    }
}
