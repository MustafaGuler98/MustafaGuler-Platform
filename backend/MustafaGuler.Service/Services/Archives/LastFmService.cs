using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MustafaGuler.Core.DTOs.LastFm;
using MustafaGuler.Core.DTOs.Settings;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Service.Services.Archives
{
    public class LastFmService : ILastFmService
    {
        private readonly HttpClient _httpClient;
        private readonly LastFmSettings _settings;
        private readonly ILogger<LastFmService> _logger;

        public LastFmService(HttpClient httpClient, IOptions<LastFmSettings> settings, ILogger<LastFmService> logger)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<Result<LastFmRecentTracksResponse>> GetRecentTracksAsync(int limit = 10, long? from = null)
        {
            if (string.IsNullOrEmpty(_settings.ApiKey) || string.IsNullOrEmpty(_settings.Username))
            {
                _logger.LogError("Last.fm configuration is missing (ApiKey or Username is null/empty).");
                return Result<LastFmRecentTracksResponse>.Failure(500, "Service configuration error.");
            }

            try
            {
                var url = $"https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={Uri.EscapeDataString(_settings.Username!)}&api_key={Uri.EscapeDataString(_settings.ApiKey!)}&format=json&limit={limit}";

                if (from.HasValue)
                {
                    url += $"&from={from.Value}";
                }

                var response = await _httpClient.GetFromJsonAsync<LastFmRecentTracksResponse>(url);

                if (response == null)
                {
                    _logger.LogWarning("Last.fm API returned null response.");
                    return Result<LastFmRecentTracksResponse>.Failure(502, "External service returned empty response.");
                }

                if (response.Error != 0)
                {
                    _logger.LogWarning("Last.fm API Error: Code {ErrorCode}, Message: {ErrorMessage}", response.Error, response.Message);
                    return Result<LastFmRecentTracksResponse>.Failure(502, "External service error.");
                }

                if (response.RecentTracks == null)
                {
                    _logger.LogWarning("Last.fm response missing 'recenttracks' object.");
                    return Result<LastFmRecentTracksResponse>.Failure(502, "Invalid data received from external service.");
                }

                return Result<LastFmRecentTracksResponse>.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while fetching recent tracks from Last.fm.");
                return Result<LastFmRecentTracksResponse>.Failure(500, "An error occurred while communicating with the music service.");
            }
        }
    }
}
