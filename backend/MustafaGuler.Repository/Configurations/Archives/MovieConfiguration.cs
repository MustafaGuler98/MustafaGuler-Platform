using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities.Archives;

namespace MustafaGuler.Repository.Configurations.Archives
{
    public class MovieConfiguration : IEntityTypeConfiguration<Movie>
    {
        public void Configure(EntityTypeBuilder<Movie> builder)
        {
            builder.ToTable("Movies");

            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Director).IsRequired().HasMaxLength(200);
            builder.Property(x => x.CoverImageUrl).HasMaxLength(500);
            builder.Property(x => x.Description).HasMaxLength(2000);
            builder.Property(x => x.MyReview).HasColumnType("text");
            builder.Property(x => x.ExternalId).HasMaxLength(100);

            builder.Property(x => x.MyRating)
                .HasAnnotation("Range", new[] { 1, 100 });

            builder.HasIndex(x => new { x.Title, x.Director })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false")
                .HasDatabaseName("IX_Movies_Title_Director");
        }
    }
}
