using MustafaGuler.Core.Entities;

namespace MustafaGuler.Core.Interfaces
{
    public interface IMailService
    {
        Task<bool> SendContactEmailAsync(ContactMessage message);
    }
}
