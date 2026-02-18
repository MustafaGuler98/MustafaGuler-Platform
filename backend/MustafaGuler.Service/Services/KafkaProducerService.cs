
using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MustafaGuler.Core.Interfaces;
using System.Text.Json;

namespace MustafaGuler.Service.Services
{
    public class KafkaProducerService : IKafkaProducerService, IDisposable
    {
        private readonly IProducer<string, string> _producer;
        private readonly ILogger<KafkaProducerService> _logger;

        public KafkaProducerService(IConfiguration configuration, ILogger<KafkaProducerService> logger)
        {
            _logger = logger;

            try
            {
                var bootstrapServers = configuration["Kafka:BootstrapServers"];
                if (string.IsNullOrEmpty(bootstrapServers))
                {
                    _logger.LogWarning("Kafka:BootstrapServers configuration is missing. Using default 'kafka:9092'");
                    bootstrapServers = "kafka:9092";
                }

                var producerConfig = new ProducerConfig
                {
                    BootstrapServers = bootstrapServers,
                    Acks = Acks.All,
                    EnableIdempotence = true,
                    MessageSendMaxRetries = 3
                };

                _producer = new ProducerBuilder<string, string>(producerConfig).Build();
                _logger.LogInformation("Kafka Producer initialized successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize Kafka Producer. Kafka features will be disabled.");
                _producer = null!;
            }
        }

        public async Task PublishAsync<T>(string topic, T message) where T : class
        {
            if (_producer == null)
            {
                _logger.LogError("Kafka Producer is not initialized. Message to topic {Topic} cannot be sent.", topic);
                throw new InvalidOperationException("Kafka Producer is not initialized. Service is unavailable.");
            }

            try
            {
                var json = JsonSerializer.Serialize(message);
                var kafkaMessage = new Message<string, string>
                {
                    Key = Guid.NewGuid().ToString(),
                    Value = json
                };

                var deliveryResult = await _producer.ProduceAsync(topic, kafkaMessage);

                _logger.LogInformation(
                    "Message published to Kafka topic {Topic}, Partition {Partition}, Offset {Offset}",
                    topic, deliveryResult.Partition.Value, deliveryResult.Offset.Value
                );
            }
            catch (ProduceException<string, string> ex)
            {
                _logger.LogError(ex, "Failed to publish message to Kafka topic {Topic}", topic);
                throw;
            }
        }

        public void Dispose()
        {
            _producer?.Flush(TimeSpan.FromSeconds(10));
            _producer?.Dispose();
        }
    }
}
