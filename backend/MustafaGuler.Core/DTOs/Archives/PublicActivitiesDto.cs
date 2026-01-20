namespace MustafaGuler.Core.DTOs.Archives
{

    public class PublicActivityDto
    {
        public string Type { get; set; } = string.Empty; // "Movie", "Book", "TvSeries", etc.
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; } // Author, Director, Artist, etc.
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class PublicActivitiesDto
    {
        public PublicActivityDto? Book { get; set; }
        public PublicActivityDto? Movie { get; set; }
        public PublicActivityDto? TvSeries { get; set; }
        public PublicActivityDto? Music { get; set; }
        public PublicActivityDto? Anime { get; set; }
        public PublicActivityDto? Game { get; set; }
        public PublicActivityDto? TTRPG { get; set; }
    }
}
