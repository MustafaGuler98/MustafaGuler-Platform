
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IKafkaProducerService
    {
        Task PublishAsync<T>(string topic, T message) where T : class;
    }
}
