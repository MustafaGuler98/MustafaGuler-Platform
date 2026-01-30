using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.DTOs.LastFm;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MustafaGuler.Service.BackgroundServices
{
    public class MusicSyncBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<MusicSyncBackgroundService> _logger;
        private readonly PeriodicTimer _timer;

        public MusicSyncBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<MusicSyncBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _timer = new PeriodicTimer(TimeSpan.FromMinutes(1));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MusicSyncBackgroundService started.");

            await DoWorkAsync(stoppingToken);

            while (await _timer.WaitForNextTickAsync(stoppingToken) && !stoppingToken.IsCancellationRequested)
            {
                await DoWorkAsync(stoppingToken);
            }
        }

        private async Task DoWorkAsync(CancellationToken stoppingToken)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var musicService = scope.ServiceProvider.GetRequiredService<IMusicService>();
                var activityService = scope.ServiceProvider.GetRequiredService<IActivityService>();
                var lastFmService = scope.ServiceProvider.GetRequiredService<ILastFmService>();
                var musicStatusService = scope.ServiceProvider.GetRequiredService<IMusicStatusService>();
                var musicRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<Music>>();

                if (stoppingToken.IsCancellationRequested) return;

                // Determine Sync Range
                var latestMusic = await musicRepository.GetAsync(
                                      m => !m.IsDeleted,
                                      orderBy: q => q.OrderByDescending(m => m.UpdatedDate ?? m.CreatedDate));

                long? fromTimestamp = null;
                if (latestMusic != null)
                {
                    var lastSyncDate = latestMusic.UpdatedDate ?? latestMusic.CreatedDate;
                    fromTimestamp = ((DateTimeOffset)lastSyncDate).ToUnixTimeSeconds();
                }

                // Fetch Data
                int limit = 20;
                var lastFmResult = await lastFmService.GetRecentTracksAsync(limit, fromTimestamp);

                if (!lastFmResult.IsSuccess || lastFmResult.Data?.RecentTracks?.Track == null)
                {
                    _logger.LogWarning($"Last.fm Sync Failed: {lastFmResult.Message}");
                    return;
                }

                var tracks = lastFmResult.Data.RecentTracks.Track;
                if (!tracks.Any()) return;

                // Update Live Status
                var currentTrack = tracks.FirstOrDefault();
                await musicStatusService.UpdateLiveStatusAsync(currentTrack);

                if (stoppingToken.IsCancellationRequested) return;

                // Archive History
                var syncResult = await musicService.SyncBatchAsync(tracks);

                if (stoppingToken.IsCancellationRequested) return;

                // Update Activity Widget
                if (syncResult.IsSuccess && syncResult.Data.HasValue)
                {
                    await activityService.UpdateActivityAsync("Music", syncResult.Data.Value);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in MusicSyncBackgroundService");
            }
        }

        public override void Dispose()
        {
            _timer?.Dispose();
            base.Dispose();
        }
    }
}
