using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace MustafaGuler.Core.Entities
{
    public class AppUser : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public ICollection<Article> Articles { get; set; }
    }
}