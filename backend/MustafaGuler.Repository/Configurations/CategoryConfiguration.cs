using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities;
using System;

namespace MustafaGuler.Repository.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Slug).IsRequired().HasMaxLength(150);
            builder.Property(x => x.Description).HasMaxLength(500);

            builder.HasOne(x => x.Parent)
                   .WithMany(x => x.SubCategories)
                   .HasForeignKey(x => x.ParentId)
                   .OnDelete(DeleteBehavior.Restrict);

            var softwareGroupId = Guid.Parse("10000000-0000-0000-0000-000000000001");
            var backendGroupId = Guid.Parse("10000000-0000-0000-0000-000000000002");

            var catSoftwareTr = Guid.Parse("33333333-3333-3333-3333-333333333333");
            var catSoftwareEn = Guid.Parse("33333333-3333-3333-3333-333333333334");

            var catBackendTr = Guid.Parse("44444444-4444-4444-4444-444444444444");
            var catBackendEn = Guid.Parse("44444444-4444-4444-4444-444444444445");

            builder.HasData(
                new Category
                {
                    Id = catSoftwareTr,
                    Name = "Yazılım Dünyası",
                    Slug = "yazilim-dunyasi",
                    Description = "Teknik makaleler.",
                    ParentId = null,
                    CreatedDate = new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc),
                    IsDeleted = false,

                },
                new Category
                {
                    Id = catSoftwareEn,
                    Name = "Software World",
                    Slug = "software-world",
                    Description = "Technical articles.",
                    ParentId = null,
                    CreatedDate = new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc),
                    IsDeleted = false
                },
                new Category
                {
                    Id = catBackendTr,
                    Name = "Backend Geliştirme",
                    Slug = "backend-gelistirme",
                    Description = ".NET ve Mimari.",
                    ParentId = catSoftwareTr,
                    CreatedDate = new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc),
                    IsDeleted = false
                },
                new Category
                {
                    Id = catBackendEn,
                    Name = "Backend Development",
                    Slug = "backend-development",
                    Description = ".NET and Architecture.",
                    ParentId = catSoftwareEn,
                    CreatedDate = new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc),
                    IsDeleted = false
                }
            );
        }
    }
}