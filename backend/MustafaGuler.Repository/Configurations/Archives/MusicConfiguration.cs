using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities.Archives;

namespace MustafaGuler.Repository.Configurations.Archives
{
    public class MusicConfiguration : IEntityTypeConfiguration<Music>
    {
        public void Configure(EntityTypeBuilder<Music> builder)
        {
            builder.ToTable("Musics");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Artist).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Album).HasMaxLength(200);
            builder.Property(x => x.Genre).HasMaxLength(100);
            builder.Property(x => x.SpotifyId).HasMaxLength(100);
            builder.Property(x => x.CoverImageUrl).HasMaxLength(500);
            builder.Property(x => x.Description).HasMaxLength(2000);
            builder.Property(x => x.MyReview).HasMaxLength(5000);
            builder.Property(x => x.ExternalId).HasMaxLength(100);

            builder.HasIndex(x => new { x.Title, x.Artist })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false")
                .HasDatabaseName("IX_Musics_Title_Artist");
        }
    }
}
