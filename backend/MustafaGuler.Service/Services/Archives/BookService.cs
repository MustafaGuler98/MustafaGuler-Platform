using AutoMapper;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class BookService : BaseMediaService<Book, BookDto, CreateBookDto, UpdateBookDto>, IBookService
    {
        public BookService(
            IGenericRepository<Book> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICacheInvalidationService cacheInvalidation) : base(repository, unitOfWork, mapper, cacheInvalidation)
        {
        }

        protected override string GetEntityName() => "Book";

        protected override string GetDuplicateMessage() =>
            "A book with this title and author already exists";

        protected override async Task<bool> CheckDuplicateAsync(CreateBookDto dto)
        {
            return await _repository.AnyAsync(b =>
                b.Title == dto.Title &&
                b.Author == dto.Author &&
                !b.IsDeleted);
        }

        protected override async Task<bool> CheckDuplicateOnUpdateAsync(Book entity, UpdateBookDto dto)
        {
            if (entity.Title == dto.Title && entity.Author == dto.Author)
                return false;

            return await _repository.AnyAsync(b =>
                b.Title == dto.Title &&
                b.Author == dto.Author &&
                b.Id != entity.Id &&
                !b.IsDeleted);
        }
    }
}
