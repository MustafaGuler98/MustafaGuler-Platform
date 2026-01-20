using AutoMapper;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class MusicService : BaseMediaService<Music, MusicDto, CreateMusicDto, UpdateMusicDto>, IMusicService
    {
        public MusicService(
            IGenericRepository<Music> repository,
            IUnitOfWork unitOfWork,
            IMapper mapper) : base(repository, unitOfWork, mapper)
        {
        }

        protected override string GetEntityName() => "Music";
        protected override string GetDuplicateMessage() => "A song with this title and artist already exists";

        protected override async Task<bool> CheckDuplicateAsync(CreateMusicDto dto)
        {
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.Artist == dto.Artist && !x.IsDeleted);
        }

        protected override async Task<bool> CheckDuplicateOnUpdateAsync(Music entity, UpdateMusicDto dto)
        {
            if (entity.Title == dto.Title && entity.Artist == dto.Artist) return false;
            return await _repository.AnyAsync(x => x.Title == dto.Title && x.Artist == dto.Artist && x.Id != entity.Id && !x.IsDeleted);
        }
    }
}
