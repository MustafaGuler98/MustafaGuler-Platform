using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities;

namespace MustafaGuler.Repository.Configurations
{
    public class ImageConfiguration : IEntityTypeConfiguration<Image>
    {
        public void Configure(EntityTypeBuilder<Image> builder)
        {
            builder.Property(x => x.FileName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(x => x.Url)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.ContentType)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Alt)
                .HasMaxLength(500);

            builder.Property(x => x.Title)
                .HasMaxLength(200);

            // Prevent duplicate filenames
            builder.HasIndex(x => x.FileName).IsUnique().HasFilter("\"IsDeleted\" = false");

            // Relationship with uploader
            builder.HasOne(x => x.UploadedBy)
                .WithMany()
                .HasForeignKey(x => x.UploadedById)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
