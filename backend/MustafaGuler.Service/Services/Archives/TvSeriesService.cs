using AutoMapper;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class TvSeriesService : BaseMediaService<TvSeries, TvSeriesDto, CreateTvSeriesDto, UpdateTvSeriesDto>, ITvSeriesService
    {
        public TvSeriesService(
            IGenericRepository<TvSeries> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICacheInvalidationService cacheInvalidation) : base(repository, unitOfWork, mapper, cacheInvalidation)
        {
        }

        protected override string GetEntityName() => "TV Series";
        protected override string GetDuplicateMessage() => "A TV series with this title already exists";

        protected override async Task<bool> CheckDuplicateAsync(CreateTvSeriesDto dto)
        {
            return await _repository.AnyAsync(x => x.Title == dto.Title && !x.IsDeleted);
        }

        protected override async Task<bool> CheckDuplicateOnUpdateAsync(TvSeries entity, UpdateTvSeriesDto dto)
        {
            if (entity.Title == dto.Title) return false;
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.Id != entity.Id && !x.IsDeleted);
        }
    }
}
