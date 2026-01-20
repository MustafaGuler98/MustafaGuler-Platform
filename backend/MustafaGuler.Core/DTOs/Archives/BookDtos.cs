using System;
using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.DTOs.Archives
{
    public class BookDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public int? PageCount { get; set; }
        public int? PublishYear { get; set; }
        public ReadingStatus ReadingStatus { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateBookDto
    {
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public int? PageCount { get; set; }
        public int? PublishYear { get; set; }
        public ReadingStatus ReadingStatus { get; set; } = ReadingStatus.PlanToRead;
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public string? ExternalId { get; set; }
    }

    public class UpdateBookDto : CreateBookDto { }
}
