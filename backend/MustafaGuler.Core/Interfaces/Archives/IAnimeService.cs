using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IAnimeService : IArchiveMediaService<AnimeDto, CreateAnimeDto, UpdateAnimeDto>
    {
    }
}
