using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MustafaGuler.Service.BackgroundServices
{
    public class DeletedImagesCleanupService : BackgroundService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<DeletedImagesCleanupService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        // Configurations
        // TO DO: Consider making these configurable via appsettings or environment variables or admin UI
        private static readonly TimeSpan RetentionPeriod = TimeSpan.FromDays(90);
        private static readonly TimeSpan RunInterval = TimeSpan.FromDays(30);
        private const string SentinelFileName = ".last_cleanup";

        public DeletedImagesCleanupService(
            IWebHostEnvironment env,
            ILogger<DeletedImagesCleanupService> logger,
            IServiceScopeFactory scopeFactory)
        {
            _env = env;
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var deletedFolderPath = Path.Combine(_env.WebRootPath, "uploads", "deleted");
            var sentinelPath = Path.Combine(deletedFolderPath, SentinelFileName);

            var initialDelay = ComputeInitialDelay(sentinelPath);

            _logger.LogInformation(
                "DeletedImagesCleanupService started. Retention: {RetentionDays}d, Interval: {IntervalDays}d, FirstRunIn: {Delay}",
                RetentionPeriod.TotalDays, RunInterval.TotalDays, initialDelay);

            if (initialDelay > TimeSpan.Zero)
            {
                try
                {
                    await Task.Delay(initialDelay, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    return;
                }
            }

            await TryRunCleanupAsync(deletedFolderPath, sentinelPath);

            using var timer = new PeriodicTimer(RunInterval);
            while (await WaitForNextTickAsync(timer, stoppingToken))
            {
                await TryRunCleanupAsync(deletedFolderPath, sentinelPath);
            }
        }

        private TimeSpan ComputeInitialDelay(string sentinelPath)
        {
            if (!File.Exists(sentinelPath))
            {
                // First run ever
                return TimeSpan.Zero;
            }

            var lastRun = File.GetLastWriteTimeUtc(sentinelPath);
            var elapsed = DateTime.UtcNow - lastRun;

            if (elapsed >= RunInterval)
                return TimeSpan.Zero;

            return RunInterval - elapsed;
        }

        private static async Task<bool> WaitForNextTickAsync(PeriodicTimer timer, CancellationToken ct)
        {
            try
            {
                return await timer.WaitForNextTickAsync(ct);
            }
            catch (OperationCanceledException)
            {
                return false;
            }
        }

        private async Task TryRunCleanupAsync(string deletedFolderPath, string sentinelPath)
        {
            try
            {
                await RunCleanupAsync(deletedFolderPath, sentinelPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeletedImagesCleanupService cycle failed");
            }
        }

        private async Task RunCleanupAsync(string deletedFolderPath, string sentinelPath)
        {
            var cutoff = DateTime.UtcNow - RetentionPeriod;
            int physicalDeletedCount = 0;
            int dbDeletedCount = 0;
            long freedBytes = 0;

            using var scope = _scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<IGenericRepository<Image>>();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

            // NOTE: Batch Processing is not implemented right now as it is out of the current scope.
            var expiredImages = await repository.GetAllAsync(x => x.IsDeleted && x.UpdatedDate < cutoff);

            if (!expiredImages.Any())
            {
                _logger.LogInformation("Cleanup check complete: No expired images found.");
                TouchSentinel(sentinelPath, deletedFolderPath);
                return;
            }

            foreach (var image in expiredImages)
            {
                try
                {
                    string relativePath = image.Url.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
                    string physicalPath = Path.Combine(_env.WebRootPath, relativePath);

                    if (File.Exists(physicalPath))
                    {
                        var info = new FileInfo(physicalPath);
                        long size = info.Length;
                        File.Delete(physicalPath);
                        freedBytes += size;
                        physicalDeletedCount++;
                    }
                    else
                    {
                        // DB Hard-delete even if physical file is missing to keep DB clean.
                        _logger.LogWarning("Physical file not found for deleted image record {Id} at path {Path}. Proceeding with DB cleanup.", image.Id, physicalPath);
                    }

                    repository.Remove(image);
                    dbDeletedCount++;
                }
                catch (Exception ex)
                {
                    // Single file failure should not abort the whole cycle
                    _logger.LogWarning(ex, "Failed to clean up image {Id}: {FileName}", image.Id, image.FileName);
                }
            }

            // NOTE: Orphan Sweep (cleaning up files in '/uploads/deleted/' that do not exist in DB) is out of scope.
            if (dbDeletedCount > 0)
            {
                await unitOfWork.CommitAsync();
            }

            _logger.LogInformation(
                "Cleanup complete: physically deleted {Count} file(s), freed {KB} KB, and hard-deleted {DbCount} record(s).",
                physicalDeletedCount, freedBytes / 1024, dbDeletedCount);

            TouchSentinel(sentinelPath, deletedFolderPath);
        }

        private void TouchSentinel(string sentinelPath, string deletedFolderPath)
        {
            try
            {
                if (!Directory.Exists(deletedFolderPath))
                    Directory.CreateDirectory(deletedFolderPath);

                // Create or update mtime atomically
                if (File.Exists(sentinelPath))
                    File.SetLastWriteTimeUtc(sentinelPath, DateTime.UtcNow);
                else
                    File.WriteAllText(sentinelPath, string.Empty);
            }
            catch (Exception ex)
            {
                // Failing to touch the sentinel is not fatal — worst case, next run happens sooner than ideal
                _logger.LogWarning(ex, "Failed to touch sentinel file {Sentinel}", sentinelPath);
            }
        }
    }
}
