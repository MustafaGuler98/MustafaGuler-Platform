using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace MustafaGuler.Service.BackgroundServices
{
    public class DeletedImagesCleanupService : BackgroundService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<DeletedImagesCleanupService> _logger;

        // Configurations
        // TO DO: Consider making these configurable via appsettings or environment variables or admin UI
        private static readonly TimeSpan RetentionPeriod = TimeSpan.FromDays(90);
        private static readonly TimeSpan RunInterval = TimeSpan.FromDays(30);
        private const string SentinelFileName = ".last_cleanup";

        public DeletedImagesCleanupService(
            IWebHostEnvironment env,
            ILogger<DeletedImagesCleanupService> logger)
        {
            _env = env;
            _logger = logger;
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

            TryRunCleanup(deletedFolderPath, sentinelPath);

            using var timer = new PeriodicTimer(RunInterval);
            while (await WaitForNextTickAsync(timer, stoppingToken))
            {
                TryRunCleanup(deletedFolderPath, sentinelPath);
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

        private void TryRunCleanup(string deletedFolderPath, string sentinelPath)
        {
            try
            {
                RunCleanup(deletedFolderPath, sentinelPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeletedImagesCleanupService cycle failed");
            }
        }

        private void RunCleanup(string deletedFolderPath, string sentinelPath)
        {
            if (!Directory.Exists(deletedFolderPath))
            {
                _logger.LogInformation("Cleanup skipped: {Path} does not exist", deletedFolderPath);
                TouchSentinel(sentinelPath, deletedFolderPath);
                return;
            }

            var cutoff = DateTime.UtcNow - RetentionPeriod;
            int deletedCount = 0;
            long freedBytes = 0;

            foreach (var file in Directory.EnumerateFiles(deletedFolderPath))
            {
                if (Path.GetFileName(file) == SentinelFileName)
                    continue;

                try
                {
                    var info = new FileInfo(file);
                    if (info.LastWriteTimeUtc < cutoff)
                    {
                        long size = info.Length;
                        File.Delete(file);
                        deletedCount++;
                        freedBytes += size;
                    }
                }
                catch (Exception ex)
                {
                    // Single file failure should not abort the whole cycle
                    _logger.LogWarning(ex, "Failed to delete {File}", file);
                }
            }

            _logger.LogInformation(
                "Cleanup complete: deleted {Count} file(s), freed {KB} KB from {Path}",
                deletedCount, freedBytes / 1024, deletedFolderPath);

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
