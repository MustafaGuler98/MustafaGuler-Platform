using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IGameService : IArchiveMediaService<GameDto, CreateGameDto, UpdateGameDto>
    {
    }
}
