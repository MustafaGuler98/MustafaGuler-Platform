using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IBookService : IArchiveMediaService<BookDto, CreateBookDto, UpdateBookDto>
    {
    }
}
