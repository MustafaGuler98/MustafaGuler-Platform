using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.DTOs.LastFm;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Utilities.Results;
using System.Text.Json;

namespace MustafaGuler.Service.Services
{
    public class MusicStatusService : IMusicStatusService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<MusicStatusService> _logger;

        public MusicStatusService(IMemoryCache memoryCache, IWebHostEnvironment env, ILogger<MusicStatusService> logger)
        {
            _memoryCache = memoryCache;
            _env = env;
            _logger = logger;
        }

        public async Task<Result> UpdateLiveStatusAsync(LastFmTrackDto? track)
        {
            try
            {
                if (track == null)
                {
                    return Result.Success(); // Nothing to update
                }

                bool isNowPlaying = track.Attributes?.NowPlaying == "true";

                var status = new MusicListeningStatusDto
                {
                    IsPlaying = isNowPlaying,
                    Title = track.Name,
                    Artist = track.Artist.Text,
                    LastPlayedAt = !isNowPlaying && track.Date != null && long.TryParse(track.Date.Uts, out var uts)
                        ? DateTimeOffset.FromUnixTimeSeconds(uts).UtcDateTime
                        : DateTime.UtcNow
                };

                _memoryCache.Set("CurrentMusicStatus", status, TimeSpan.FromMinutes(2));

                // Write to file for Nginx to serve
                var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var jsonString = JsonSerializer.Serialize(status, jsonOptions);
                var liveStatusPath = Path.Combine(_env.WebRootPath, "live-status");
                var filePath = Path.Combine(liveStatusPath, "music-status.json");
                var tempPath = Path.Combine(liveStatusPath, "music-status.json.tmp");

                // Ensure directory exists
                if (!Directory.Exists(liveStatusPath))
                {
                    Directory.CreateDirectory(liveStatusPath);
                }

                // Write to temporary file first
                await File.WriteAllTextAsync(tempPath, jsonString);

                // Atomically move/rename
                File.Move(tempPath, filePath, overwrite: true);

                return Result.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update music status");
                return Result.Failure(500, $"Failed to update music status: {ex.Message}");
            }
        }
    }
}
