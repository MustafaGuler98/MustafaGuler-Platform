using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Utilities.Results;
using System.Linq;
using System.Threading.Tasks;

namespace MustafaGuler.Service.Services.Archives
{
    public class ArchivesStatsService : IArchivesStatsService
    {
        private readonly IGenericRepository<Movie> _movieRepository;
        private readonly IGenericRepository<Book> _bookRepository;
        private readonly IGenericRepository<Quote> _quoteRepository;
        private readonly IGenericRepository<TvSeries> _tvSeriesRepository;
        private readonly IGenericRepository<Anime> _animeRepository;
        private readonly IGenericRepository<Game> _gameRepository;
        private readonly IGenericRepository<Music> _musicRepository;
        private readonly IGenericRepository<TTRPG> _ttrpgRepository;

        public ArchivesStatsService(
            IGenericRepository<Movie> movieRepository,
            IGenericRepository<Book> bookRepository,
            IGenericRepository<Quote> quoteRepository,
            IGenericRepository<TvSeries> tvSeriesRepository,
            IGenericRepository<Anime> animeRepository,
            IGenericRepository<Game> gameRepository,
            IGenericRepository<Music> musicRepository,
            IGenericRepository<TTRPG> ttrpgRepository)
        {
            _movieRepository = movieRepository;
            _bookRepository = bookRepository;
            _quoteRepository = quoteRepository;
            _tvSeriesRepository = tvSeriesRepository;
            _animeRepository = animeRepository;
            _gameRepository = gameRepository;
            _musicRepository = musicRepository;
            _ttrpgRepository = ttrpgRepository;
        }

        public async Task<Result<ArchivesStatsDto>> GetStatsAsync()
        {
            var movieCount = await _movieRepository.CountAsync(m => !m.IsDeleted);
            var bookCount = await _bookRepository.CountAsync(b => !b.IsDeleted);
            var quoteCount = await _quoteRepository.CountAsync(q => !q.IsDeleted);
            var tvSeriesCount = await _tvSeriesRepository.CountAsync(t => !t.IsDeleted);
            var animeCount = await _animeRepository.CountAsync(a => !a.IsDeleted);
            var gameCount = await _gameRepository.CountAsync(g => !g.IsDeleted);
            var musicCount = await _musicRepository.CountAsync(m => !m.IsDeleted);
            var ttrpgCount = await _ttrpgRepository.CountAsync(t => !t.IsDeleted);

            var stats = new ArchivesStatsDto
            {
                MovieCount = movieCount,
                BookCount = bookCount,
                QuoteCount = quoteCount,
                TvSeriesCount = tvSeriesCount,
                AnimeCount = animeCount,
                GameCount = gameCount,
                MusicCount = musicCount,
                TTRPGCount = ttrpgCount
            };

            return Result<ArchivesStatsDto>.Success(stats);
        }
    }
}
