using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities;
using System;

namespace MustafaGuler.Repository.Configurations
{
    public class ArticleConfiguration : IEntityTypeConfiguration<Article>
    {
        public void Configure(EntityTypeBuilder<Article> builder)
        {
            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Content).IsRequired();
            builder.Property(x => x.LanguageCode).HasMaxLength(5);

            // 2. Seed Data. For testing purposes.
            builder.HasData(
                new Article
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), // I use fixed GUIDs for easier testing
                    Title = "Onion Architecture Nedir?",
                    Content = "Onion Architecture, yazılım projelerinde bağımlılıkları yönetmek için...",
                    LanguageCode = "tr",
                    GroupId = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                    ViewCount = 100,
                    CreatedDate = new DateTime(2023, 10, 1, 12, 0, 0, DateTimeKind.Utc),
                    IsDeleted = false
                },
                new Article
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Title = "What is Onion Architecture?",
                    Content = "Onion Architecture is a layered architecture pattern...",
                    LanguageCode = "en",
                    GroupId = Guid.Parse("99999999-9999-9999-9999-999999999999"), // Same GroupId means same article in different language
                    ViewCount = 50,
                    CreatedDate = new DateTime(2023, 10, 1, 12, 0, 0, DateTimeKind.Utc),
                    IsDeleted = false
                }
            );
        }
    }
}