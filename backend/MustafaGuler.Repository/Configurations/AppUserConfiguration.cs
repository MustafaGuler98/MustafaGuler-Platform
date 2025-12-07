using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities;
using System;

namespace MustafaGuler.Repository.Configurations
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            var adminId = Guid.Parse("CB94223B-CCB8-4F2F-93D7-0DF96A7F3839");

            var adminUser = new AppUser
            {
                Id = adminId,
                UserName = "mustafaguler",
                NormalizedUserName = "MUSTAFAGULER",
                Email = "contact@mustafaguler.me",
                NormalizedEmail = "CONTACT@MUSTAFAGULER.ME",
                EmailConfirmed = true,
                FirstName = "Mustafa",
                LastName = "Güler",
                SecurityStamp = "11111111-1111-1111-1111-111111111111",
                ConcurrencyStamp = "22222222-2222-2222-2222-222222222222",
                PasswordHash = "AQAAAAIAAYagAAAAEEk3nJ/T1Enj4Fz9/q2KjX9/q2KjX9/q2KjX9/q2KjX9/q2K=="
            };

            builder.HasData(adminUser);
        }
    }
}