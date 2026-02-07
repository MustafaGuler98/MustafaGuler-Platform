using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.Interfaces;

namespace MustafaGuler.Service.Services;

public class CacheInvalidationService : ICacheInvalidationService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<CacheInvalidationService> _logger;

    public CacheInvalidationService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<CacheInvalidationService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public Task InvalidateTagsAsync(params string[] tags)
    {
        if (tags.Length == 0) return Task.CompletedTask;

        var frontendBaseUrl = _configuration["Frontend:BaseUrl"];
        var revalidateSecret = _configuration["Frontend:RevalidateSecret"];

        if (string.IsNullOrEmpty(frontendBaseUrl) || string.IsNullOrEmpty(revalidateSecret))
        {
            _logger.LogWarning("Frontend:BaseUrl or Frontend:RevalidateSecret not configured. Skipping cache invalidation.");
            return Task.CompletedTask;
        }


        _ = Task.Run(async () =>
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post, $"{frontendBaseUrl}/api/revalidate");
                request.Headers.Add("x-revalidate-secret", revalidateSecret);
                request.Content = JsonContent.Create(new { tags });

                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Cache invalidated for tags: {Tags}", string.Join(", ", tags));
                }
                else
                {
                    _logger.LogWarning("Cache invalidation failed with status {StatusCode}", response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to invalidate cache for tags: {Tags}. Frontend may be unreachable.", string.Join(", ", tags));
            }
        });

        return Task.CompletedTask;
    }
}
