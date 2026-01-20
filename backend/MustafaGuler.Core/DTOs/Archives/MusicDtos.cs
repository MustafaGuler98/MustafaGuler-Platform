namespace MustafaGuler.Core.DTOs.Archives
{
    public class MusicDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Artist { get; set; } = null!;
        public string? Album { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Genre { get; set; }
        public string? SpotifyId { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateMusicDto
    {
        public string Title { get; set; } = null!;
        public string Artist { get; set; } = null!;
        public string? Album { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Genre { get; set; }
        public string? SpotifyId { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? MyReview { get; set; }
        public int? MyRating { get; set; }
        public int? ConsumedYear { get; set; }
    }

    public class UpdateMusicDto : CreateMusicDto { }
}
