using MustafaGuler.Core.DTOs.LastFm;
using MustafaGuler.Core.Utilities.Results;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface ILastFmService
    {
        Task<Result<LastFmRecentTracksResponse>> GetRecentTracksAsync(int limit = 10, long? from = null);
    }
}
