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
                var cacheInvalidationService = scope.ServiceProvider.GetRequiredService<ICacheInvalidationService>();

                if (stoppingToken.IsCancellationRequested) return;

                // Prevent the widget from reverting to an old track when the current song is paused.
                var liveResult = await lastFmService.GetRecentTracksAsync(limit: 1, from: null);

                if (liveResult.IsSuccess && liveResult.Data?.RecentTracks?.Track != null)
                {
                    var currentTrack = liveResult.Data.RecentTracks.Track.FirstOrDefault();
                    await musicStatusService.UpdateLiveStatusAsync(currentTrack);
                }

                if (stoppingToken.IsCancellationRequested) return;

                // We pick up from where we left off in the database.
                var latestMusic = await musicRepository.GetAsync(
                                      m => !m.IsDeleted,
                                      orderBy: q => q.OrderByDescending(m => m.UpdatedDate ?? m.CreatedDate));

                long? fromTimestamp = null;
                if (latestMusic != null)
                {
                    var lastSyncDate = latestMusic.UpdatedDate ?? latestMusic.CreatedDate;
                    fromTimestamp = ((DateTimeOffset)lastSyncDate).ToUnixTimeSeconds();
                }

                int limit = 20;
                var archiveResult = await lastFmService.GetRecentTracksAsync(limit, fromTimestamp);

                if (!archiveResult.IsSuccess || archiveResult.Data?.RecentTracks?.Track == null)
                {
                    _logger.LogWarning($"Last.fm Archive Sync Failed: {archiveResult.Message}");
                    return;
                }

                var detailedTracks = archiveResult.Data.RecentTracks.Track;
                if (!detailedTracks.Any()) return;

                var syncResult = await musicService.SyncBatchAsync(detailedTracks);

                if (stoppingToken.IsCancellationRequested) return;

                // Update Activity Widget
                if (syncResult.IsSuccess && syncResult.Data.HasValue)
                {
                    var newMusicId = syncResult.Data.Value;
                    var activities = await activityService.GetAllActivitiesAsync();
                    var musicActivity = activities.IsSuccess ? activities.Data?.FirstOrDefault(a => a.ActivityType == "Music") : null;

                    if (musicActivity == null || musicActivity.SelectedItemId != newMusicId)
                    {
                        var updateResult = await activityService.UpdateActivityAsync("Music", newMusicId);
                        if (updateResult.IsSuccess)
                        {
                            await cacheInvalidationService.InvalidateTagsAsync("activities");
                        }
                    }
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
