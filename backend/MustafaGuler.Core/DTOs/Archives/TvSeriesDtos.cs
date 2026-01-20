using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.DTOs.Archives
{
    public class TvSeriesDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public int? TotalSeasons { get; set; }
        public int? TotalEpisodes { get; set; }
        public WatchStatus Status { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateTvSeriesDto
    {
        public string Title { get; set; } = null!;
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public int? TotalSeasons { get; set; }
        public int? TotalEpisodes { get; set; }
        public WatchStatus Status { get; set; } = WatchStatus.PlanToWatch;
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
    }

    public class UpdateTvSeriesDto : CreateTvSeriesDto { }
}
