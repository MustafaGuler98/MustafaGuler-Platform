using System.Collections.Generic;
using System.Text.Json.Serialization;
using MustafaGuler.Core.Utilities.Converters;

namespace MustafaGuler.Core.DTOs.LastFm
{
    public class LastFmRecentTracksResponse
    {
        [JsonPropertyName("error")]
        public int Error { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyName("recenttracks")]
        public RecentTracksData? RecentTracks { get; set; }
    }

    public class RecentTracksData
    {
        [JsonPropertyName("track")]
        [JsonConverter(typeof(SingleOrArrayJsonConverter<LastFmTrackDto>))]
        public List<LastFmTrackDto> Track { get; set; } = new();

        [JsonPropertyName("@attr")]
        public RecentTracksAttributes? Attributes { get; set; }
    }

    public class RecentTracksAttributes
    {
        [JsonPropertyName("page")]
        public string Page { get; set; } = string.Empty;

        [JsonPropertyName("total")]
        public string Total { get; set; } = string.Empty;

        [JsonPropertyName("user")]
        public string User { get; set; } = string.Empty;

        [JsonPropertyName("perPage")]
        public string PerPage { get; set; } = string.Empty;

        [JsonPropertyName("totalPages")]
        public string TotalPages { get; set; } = string.Empty;
    }
}
