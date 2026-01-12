using MustafaGuler.Core.DTOs.Contact;
using MustafaGuler.Core.Parameters;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces
{
    public interface IContactService
    {
        Task<Result> SubmitContactFormAsync(CreateContactMessageDto dto, string? clientIp);
        Task<Result<PagedResult<ContactMessageListDto>>> GetPagedListAsync(PaginationParams paginationParams);
        Task<Result<ContactMessageDetailDto>> GetByIdAsync(Guid id);
        Task<Result<IEnumerable<SubscriberDto>>> GetSubscribersAsync();
    }
}
