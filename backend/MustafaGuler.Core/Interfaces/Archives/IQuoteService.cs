using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IQuoteService : IArchiveMediaService<QuoteDto, CreateQuoteDto, UpdateQuoteDto>
    {
    }
}
