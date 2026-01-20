using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.DTOs.Archives
{
    public class AnimeDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public int? Episodes { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Studio { get; set; }
        public WatchStatus Status { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateAnimeDto
    {
        public string Title { get; set; } = null!;
        public int? Episodes { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Studio { get; set; }
        public WatchStatus Status { get; set; } = WatchStatus.PlanToWatch;
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
    }

    public class UpdateAnimeDto : CreateAnimeDto { }
}
