using MustafaGuler.Core.Enums;

namespace MustafaGuler.Core.DTOs.Archives
{
    public class GameDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Platform { get; set; }
        public string? Developer { get; set; }
        public int? ReleaseYear { get; set; }
        public int? PlaytimeHours { get; set; }
        public GameStatus Status { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateGameDto
    {
        public string Title { get; set; } = null!;
        public string? Platform { get; set; }
        public string? Developer { get; set; }
        public int? ReleaseYear { get; set; }
        public int? PlaytimeHours { get; set; }
        public GameStatus Status { get; set; } = GameStatus.Backlog;
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
    }

    public class UpdateGameDto : CreateGameDto { }
}
