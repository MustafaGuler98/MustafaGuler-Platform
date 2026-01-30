using MustafaGuler.Core.DTOs.LastFm;
using MustafaGuler.Core.Utilities.Results;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces
{
    public interface IMusicStatusService
    {
        Task<Result> UpdateLiveStatusAsync(LastFmTrackDto? track);
    }
}
