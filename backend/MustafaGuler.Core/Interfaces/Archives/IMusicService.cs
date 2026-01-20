using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IMusicService : IArchiveMediaService<MusicDto, CreateMusicDto, UpdateMusicDto>
    {
    }
}
