using MustafaGuler.Core.DTOs.Contact;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces
{
    public interface IContactService
    {
        Task<Result> SubmitContactFormAsync(CreateContactMessageDto dto, string? clientIp);
    }
}
