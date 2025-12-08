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

            builder.Property(x => x.Slug).IsRequired().HasMaxLength(250);
            builder.HasIndex(x => x.Slug).IsUnique();

            builder.HasOne(x => x.Category)
                   .WithMany(x => x.Articles)
                   .HasForeignKey(x => x.CategoryId)
                   .OnDelete(DeleteBehavior.SetNull); // For safe delete

            var adminId = Guid.Parse("CB94223B-CCB8-4F2F-93D7-0DF96A7F3839"); // Example Admin in AppUser seed data

            // Seed Data for testing purposes.
            builder.HasData(
                 new Article
                 {
                     Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                     Title = "Onion Architecture Nedir?",
                     Slug = "onion-architecture-nedir",
                     Content = "Türkçe içerik...",
                     LanguageCode = "tr",
                     GroupId = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                     ViewCount = 100,
                     CreatedDate = new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc),
                     IsDeleted = false,
                     CategoryId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                     MainImage = null,
                     UserId = adminId
                 },
                new Article
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Title = "What is Onion Architecture?",
                    Slug = "what-is-onion-architecture",
                    Content = "English content...",
                    LanguageCode = "en",
                    GroupId = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                    ViewCount = 50,
                    CreatedDate = new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc),
                    IsDeleted = false,
                    CategoryId = Guid.Parse("44444444-4444-4444-4444-444444444445"),
                    MainImage = "/uploads/articles/backend-setup.jpg",
                    UserId = adminId
                }
            );
        }
    }
}