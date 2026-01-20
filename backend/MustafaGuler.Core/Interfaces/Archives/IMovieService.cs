using MustafaGuler.Core.DTOs.Archives;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IMovieService : IArchiveMediaService<MovieDto, CreateMovieDto, UpdateMovieDto>
    {
    }
}
