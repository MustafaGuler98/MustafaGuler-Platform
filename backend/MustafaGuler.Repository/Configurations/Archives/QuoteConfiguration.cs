using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MustafaGuler.Core.Entities.Archives;

namespace MustafaGuler.Repository.Configurations.Archives
{
    public class QuoteConfiguration : IEntityTypeConfiguration<Quote>
    {
        public void Configure(EntityTypeBuilder<Quote> builder)
        {
            builder.ToTable("Quotes");

            builder.Property(x => x.Content).IsRequired().HasColumnType("text");
            builder.Property(x => x.Author).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Source).HasMaxLength(300);

            builder.HasIndex(x => x.Author)
                .HasDatabaseName("IX_Quotes_Author");
        }
    }
}
