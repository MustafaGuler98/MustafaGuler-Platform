using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MustafaGuler.Core.DTOs.LastFm
{
    public class LastFmTrackDto
    {
        [JsonPropertyName("artist")]
        public LastFmItemProperty Artist { get; set; } = new();

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("mbid")]
        public string Mbid { get; set; } = string.Empty;

        [JsonPropertyName("album")]
        public LastFmItemProperty Album { get; set; } = new();

        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;

        [JsonPropertyName("image")]
        public List<LastFmImage> Images { get; set; } = new();

        [JsonPropertyName("date")]
        public LastFmDate? Date { get; set; }

        [JsonPropertyName("@attr")]
        public TrackAttributes? Attributes { get; set; }
    }

    public class LastFmItemProperty
    {
        [JsonPropertyName("#text")]
        public string Text { get; set; } = string.Empty;

        [JsonPropertyName("mbid")]
        public string Mbid { get; set; } = string.Empty;
    }

    public class LastFmImage
    {
        [JsonPropertyName("#text")]
        public string Url { get; set; } = string.Empty;

        [JsonPropertyName("size")]
        public string Size { get; set; } = string.Empty;
    }

    public class LastFmDate
    {
        [JsonPropertyName("uts")]
        public string Uts { get; set; } = string.Empty;

        [JsonPropertyName("#text")]
        public string Text { get; set; } = string.Empty;
    }

    public class TrackAttributes
    {
        [JsonPropertyName("nowplaying")]
        public string NowPlaying { get; set; } = "false";
    }
}
