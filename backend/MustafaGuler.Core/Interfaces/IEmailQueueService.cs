
using System.Threading.Tasks;
using MustafaGuler.Core.DTOs.Events;

namespace MustafaGuler.Core.Interfaces
{
    public interface IEmailQueueService
    {
        Task QueueEmailAsync(EmailEvent emailEvent);
    }
}
