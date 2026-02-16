
using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.DTOs.Events;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Interfaces;
using System.Text.Json;

namespace MustafaGuler.Service.BackgroundServices
{
    public class EmailWorkerService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailWorkerService> _logger;

        public EmailWorkerService(
            IServiceScopeFactory scopeFactory,
            IConfiguration configuration,
            ILogger<EmailWorkerService> logger)
        {
            _scopeFactory = scopeFactory;
            _configuration = configuration;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("EmailWorkerService started");

            var bootstrapServers = _configuration["Kafka:BootstrapServers"];
            if (string.IsNullOrEmpty(bootstrapServers))
            {
                _logger.LogWarning("Kafka:BootstrapServers is missing, using default 'kafka:9092'");
                bootstrapServers = "kafka:9092";
            }

            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = bootstrapServers,
                GroupId = "email-worker-group",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                EnableAutoCommit = false,
                SessionTimeoutMs = 30000
            };

            using var consumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
            consumer.Subscribe("email-outbox");

            _logger.LogInformation("EmailWorkerService subscribed to topic: email-outbox");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var consumeResult = consumer.Consume(stoppingToken);

                    if (consumeResult?.Message?.Value == null)
                        continue;

                    EmailEvent? emailEvent;
                    try
                    {
                        emailEvent = JsonSerializer.Deserialize<EmailEvent>(consumeResult.Message.Value);
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Failed to deserialize EmailEvent. Dropping message.");
                        consumer.Commit(consumeResult);
                        continue;
                    }

                    if (emailEvent == null)
                    {
                        consumer.Commit(consumeResult);
                        continue;
                    }

                    _logger.LogInformation("Processing email for ContactMessageId: {ContactMessageId}", emailEvent.ContactMessageId);

                    using var scope = _scopeFactory.CreateScope();
                    var mailService = scope.ServiceProvider.GetRequiredService<IMailService>();
                    var contactRepository = scope.ServiceProvider.GetRequiredService<IGenericRepository<ContactMessage>>();
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                    var contactMessage = await contactRepository.GetByIdAsync(emailEvent.ContactMessageId);

                    if (contactMessage == null)
                    {
                        _logger.LogWarning("ContactMessage not found: {ContactMessageId}. Dropping message.", emailEvent.ContactMessageId);
                        consumer.Commit(consumeResult);
                        continue;
                    }

                    if (contactMessage.IsMailSent)
                    {
                        _logger.LogInformation("Email already sent for {ContactMessageId}, skipping (Idempotency check passed).", emailEvent.ContactMessageId);
                        consumer.Commit(consumeResult);
                        continue;
                    }

                    // Retry Logic
                    int retryCount = 0;
                    const int maxRetries = 5;
                    bool sent = false;

                    while (retryCount < maxRetries && !sent && !stoppingToken.IsCancellationRequested)
                    {
                        try
                        {
                            sent = await mailService.SendContactEmailAsync(contactMessage);
                            if (!sent)
                            {
                                retryCount++;
                                _logger.LogWarning("Email sending failed (Attempt {RetryCount}/{MaxRetries}). Waiting 30s...", retryCount, maxRetries);
                                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
                            }
                        }
                        catch (Exception ex)
                        {
                            retryCount++;
                            _logger.LogError(ex, "Exception during email sending (Attempt {RetryCount}/{MaxRetries}). Waiting 30s...", retryCount, maxRetries);
                            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
                        }
                    }

                    if (sent)
                    {
                        contactMessage.IsMailSent = true;
                        contactRepository.Update(contactMessage);
                        await unitOfWork.CommitAsync();
                        consumer.Commit(consumeResult);
                        _logger.LogInformation("Email sent successfully for {ContactMessageId}", emailEvent.ContactMessageId);
                    }
                    else
                    {
                        _logger.LogError("Max retries reached for {ContactMessageId}. Dropping message (Log & Drop).", emailEvent.ContactMessageId);
                        consumer.Commit(consumeResult);
                    }
                }
                catch (ConsumeException ex)
                {
                    _logger.LogError(ex, "Kafka consume error");
                    await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unexpected error in EmailWorkerService");
                    await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
                }
            }

            consumer.Close();
            _logger.LogInformation("EmailWorkerService stopped");
        }
    }
}
