using AutoMapper;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class TTRPGService : BaseMediaService<TTRPG, TTRPGDto, CreateTTRPGDto, UpdateTTRPGDto>, ITTRPGService
    {
        public TTRPGService(
            IGenericRepository<TTRPG> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICacheInvalidationService cacheInvalidation) : base(repository, unitOfWork, mapper, cacheInvalidation)
        {
        }

        protected override string GetEntityName() => "TTRPG";
        protected override string GetDuplicateMessage() => "A TTRPG entry with this title and system already exists";

        protected override async Task<bool> CheckDuplicateAsync(CreateTTRPGDto dto)
        {
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.System == dto.System && !x.IsDeleted);
        }

        protected override async Task<bool> CheckDuplicateOnUpdateAsync(TTRPG entity, UpdateTTRPGDto dto)
        {
            if (entity.Title == dto.Title && entity.System == dto.System) return false;
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.System == dto.System && x.Id != entity.Id && !x.IsDeleted);
        }
    }
}
