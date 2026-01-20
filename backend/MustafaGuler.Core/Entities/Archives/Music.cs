namespace MustafaGuler.Core.Entities.Archives
{
    public class Music : BaseMediaEntity
    {
        public string Artist { get; set; } = null!;
        public string? Album { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Genre { get; set; }
        public string? SpotifyId { get; set; }
    }
}
