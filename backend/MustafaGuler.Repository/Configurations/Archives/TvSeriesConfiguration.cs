using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Enums;

namespace MustafaGuler.Repository.Configurations.Archives
{
    public class TvSeriesConfiguration : IEntityTypeConfiguration<TvSeries>
    {
        public void Configure(EntityTypeBuilder<TvSeries> builder)
        {
            builder.ToTable("TvSeries");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.CoverImageUrl).HasMaxLength(500);
            builder.Property(x => x.Description).HasMaxLength(2000);
            builder.Property(x => x.MyReview).HasMaxLength(5000);
            builder.Property(x => x.ExternalId).HasMaxLength(100);

            builder.Property(x => x.Status)
                .HasConversion<string>()
                .HasMaxLength(50);

            builder.HasIndex(x => x.Title)
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false")
                .HasDatabaseName("IX_TvSeries_Title");
        }
    }
}
