using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace MustafaGuler.Core.Entities
{
    public class AppUser : IdentityUser<Guid>
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenEndDate { get; set; }

        public ICollection<Article> Articles { get; set; } = new List<Article>();
    }
}