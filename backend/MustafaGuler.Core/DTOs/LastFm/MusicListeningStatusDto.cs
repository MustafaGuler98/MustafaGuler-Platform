namespace MustafaGuler.Core.DTOs.LastFm;

public class MusicListeningStatusDto
{
    public bool IsPlaying { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Artist { get; set; } = string.Empty;
    public DateTime LastPlayedAt { get; set; }
}
