using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities.Archives;

namespace MustafaGuler.Repository.Configurations.Archives
{
    public class BookConfiguration : IEntityTypeConfiguration<Book>
    {
        public void Configure(EntityTypeBuilder<Book> builder)
        {
            builder.ToTable("Books");

            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Author).IsRequired().HasMaxLength(200);
            builder.Property(x => x.CoverImageUrl).HasMaxLength(500);
            builder.Property(x => x.Description).HasMaxLength(2000);
            builder.Property(x => x.MyReview).HasColumnType("text");
            builder.Property(x => x.ExternalId).HasMaxLength(100);

            builder.Property(x => x.ReadingStatus)
                .HasConversion<int>()
                .IsRequired();

            builder.HasIndex(x => new { x.Title, x.Author })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false")
                .HasDatabaseName("IX_Books_Title_Author");
        }
    }
}
