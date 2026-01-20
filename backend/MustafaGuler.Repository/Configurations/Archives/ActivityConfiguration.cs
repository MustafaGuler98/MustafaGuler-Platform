using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities.Archives;

namespace MustafaGuler.Repository.Configurations.Archives
{
    public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
    {
        public void Configure(EntityTypeBuilder<Activity> builder)
        {
            builder.ToTable("Activities");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.ActivityType)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(x => x.ActivityType).IsUnique().HasFilter("\"IsDeleted\" = false");

            builder.Property(x => x.DisplayOrder)
                .HasDefaultValue(0);
        }
    }
}
