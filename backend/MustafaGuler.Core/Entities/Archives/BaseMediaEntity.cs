using MustafaGuler.Core.Common;

namespace MustafaGuler.Core.Entities.Archives
{
    public abstract class BaseMediaEntity : BaseEntity
    {
        public string Title { get; set; } = null!;
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public string? ExternalId { get; set; }
    }
}
