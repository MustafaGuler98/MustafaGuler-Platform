using AutoMapper;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class GameService : BaseMediaService<Game, GameDto, CreateGameDto, UpdateGameDto>, IGameService
    {
        public GameService(
            IGenericRepository<Game> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICacheInvalidationService cacheInvalidation) : base(repository, unitOfWork, mapper, cacheInvalidation)
        {
        }

        protected override string GetEntityName() => "Game";
        protected override string GetDuplicateMessage() => "A game with this title and platform already exists";

        protected override async Task<bool> CheckDuplicateAsync(CreateGameDto dto)
        {
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.Platform == dto.Platform && !x.IsDeleted);
        }

        protected override async Task<bool> CheckDuplicateOnUpdateAsync(Game entity, UpdateGameDto dto)
        {
            if (entity.Title == dto.Title && entity.Platform == dto.Platform) return false;
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.Platform == dto.Platform && x.Id != entity.Id && !x.IsDeleted);
        }
    }
}
