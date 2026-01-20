using AutoMapper;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class MovieService : BaseMediaService<Movie, MovieDto, CreateMovieDto, UpdateMovieDto>, IMovieService
    {
        public MovieService(
            IGenericRepository<Movie> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper) : base(repository, unitOfWork, mapper)
        {
        }

        protected override string GetEntityName() => "Movie";

        protected override string GetDuplicateMessage() =>
            "A movie with this title and director already exists";

        protected override async Task<bool> CheckDuplicateAsync(CreateMovieDto dto)
        {
            return await _repository.AnyAsync(m =>
                m.Title == dto.Title &&
                m.Director == dto.Director &&
                !m.IsDeleted);
        }

        protected override async Task<bool> CheckDuplicateOnUpdateAsync(Movie entity, UpdateMovieDto dto)
        {
            if (entity.Title == dto.Title && entity.Director == dto.Director)
                return false; 

            return await _repository.AnyAsync(m =>
                m.Title == dto.Title &&
                m.Director == dto.Director &&
                m.Id != entity.Id &&
                !m.IsDeleted);
        }
    }
}
