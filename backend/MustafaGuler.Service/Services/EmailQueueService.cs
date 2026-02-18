
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.DTOs.Events;
using MustafaGuler.Core.Interfaces;

namespace MustafaGuler.Service.Services
{
    public class EmailQueueService : IEmailQueueService
    {
        private readonly IKafkaProducerService _kafkaProducerService;
        private readonly ILogger<EmailQueueService> _logger;
        private const string TopicName = "email-outbox";

        public EmailQueueService(IKafkaProducerService kafkaProducerService, ILogger<EmailQueueService> logger)
        {
            _kafkaProducerService = kafkaProducerService;
            _logger = logger;
        }

        public async Task QueueEmailAsync(EmailEvent emailEvent)
        {
            try
            {
                await _kafkaProducerService.PublishAsync(TopicName, emailEvent);
                _logger.LogInformation("Email queued successfully for ContactMessageId: {Id}", emailEvent.ContactMessageId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to queue email for ContactMessageId: {Id}", emailEvent.ContactMessageId);
                throw;
            }
        }
    }
}
