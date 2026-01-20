using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Enums;

namespace MustafaGuler.Repository.Configurations.Archives
{
    public class TTRPGConfiguration : IEntityTypeConfiguration<TTRPG>
    {
        public void Configure(EntityTypeBuilder<TTRPG> builder)
        {
            builder.ToTable("TTRPGs");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.System).HasMaxLength(100);
            builder.Property(x => x.CampaignName).HasMaxLength(200);
            builder.Property(x => x.CoverImageUrl).HasMaxLength(500);
            builder.Property(x => x.Description).HasMaxLength(2000);
            builder.Property(x => x.MyReview).HasMaxLength(5000);
            builder.Property(x => x.ExternalId).HasMaxLength(100);

            builder.Property(x => x.Role)
                .HasConversion<string>()
                .HasMaxLength(50);

            builder.Property(x => x.CampaignStatus)
                .HasConversion<string>()
                .HasMaxLength(50);

            builder.HasIndex(x => new { x.Title, x.System })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false")
                .HasDatabaseName("IX_TTRPGs_Title_System");
        }
    }
}
