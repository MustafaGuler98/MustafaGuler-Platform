using System;
using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.DTOs.Archives
{
    public class MovieDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Director { get; set; } = null!;
        public int? ReleaseYear { get; set; }
        public int? DurationMinutes { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public WatchStatus Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateMovieDto
    {
        public string Title { get; set; } = null!;
        public string Director { get; set; } = null!;
        public int? ReleaseYear { get; set; }
        public int? DurationMinutes { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public WatchStatus Status { get; set; } = WatchStatus.PlanToWatch;
        public string? ExternalId { get; set; }
    }

    public class UpdateMovieDto : CreateMovieDto { }
}
