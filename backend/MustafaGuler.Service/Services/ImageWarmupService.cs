using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.Interfaces;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services
{
    public class ImageWarmupService : IImageWarmupService, IHostedService
    {
        private readonly Channel<string> _channel;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ImageWarmupService> _logger;
        private Task? _processingTask;
        private CancellationTokenSource? _cts;

        // Warmup configurations (these are mostly for article covers for now)
        private static readonly int[] WarmupSizes = [384, 640, 828, 1200, 1920];
        private static readonly string[] WarmupFormats = ["image/webp", "image/avif"];

        public ImageWarmupService(
            IHttpClientFactory httpClientFactory,
            ILogger<ImageWarmupService> logger)
        {
            _channel = Channel.CreateBounded<string>(new BoundedChannelOptions(100)
            {
                FullMode = BoundedChannelFullMode.DropOldest
            });
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public void EnqueueWarmup(string imageUrl)
        {
            if (!_channel.Writer.TryWrite(imageUrl))
                _logger.LogWarning("Warmup queue full, dropped request for {ImageUrl}", imageUrl);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            _processingTask = ProcessQueueAsync(_cts.Token);
            return Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            _channel.Writer.Complete();
            _cts?.Cancel();

            if (_processingTask != null)
                await Task.WhenAny(_processingTask, Task.Delay(TimeSpan.FromSeconds(5), cancellationToken));
        }

        private async Task ProcessQueueAsync(CancellationToken ct)
        {
            await foreach (var imageUrl in _channel.Reader.ReadAllAsync(ct))
            {
                try
                {
                    await ExecuteWarmupAsync(imageUrl, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError(ex, "Failed to warm up {ImageUrl}", imageUrl);
                }
            }
        }

        private async Task ExecuteWarmupAsync(string imageUrl, CancellationToken ct)
        {
            var client = _httpClientFactory.CreateClient("ImageWarmup");
            var encodedUrl = Uri.EscapeDataString(imageUrl);

            foreach (var size in WarmupSizes)
            {
                foreach (var format in WarmupFormats)
                {
                    var url = $"http://nginx:80/api/images/resize?url={encodedUrl}&w={size}&q=75";

                    using var request = new HttpRequestMessage(HttpMethod.Get, url);
                    request.Headers.TryAddWithoutValidation("Accept", format);

                    using var response = await client.SendAsync(request, ct);

                    _logger.LogInformation(
                        "Warmup {Status}: {ImageUrl} w={Size} fmt={Format}",
                        response.StatusCode, imageUrl, size, format);
                }
            }
        }
    }
}
