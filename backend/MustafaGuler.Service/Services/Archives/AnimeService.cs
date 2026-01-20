using AutoMapper;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class AnimeService : BaseMediaService<Anime, AnimeDto, CreateAnimeDto, UpdateAnimeDto>, IAnimeService
    {
        public AnimeService(
            IGenericRepository<Anime> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper) : base(repository, unitOfWork, mapper)
        {
        }

        protected override string GetEntityName() => "Anime";
        protected override string GetDuplicateMessage() => "An anime with this title already exists";

        protected override async Task<bool> CheckDuplicateAsync(CreateAnimeDto dto)
        {
            return await _repository.AnyAsync(x => x.Title == dto.Title && !x.IsDeleted);
        }

        protected override async Task<bool> CheckDuplicateOnUpdateAsync(Anime entity, UpdateAnimeDto dto)
        {
            if (entity.Title == dto.Title) return false;
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.Id != entity.Id && !x.IsDeleted);
        }
    }
}
