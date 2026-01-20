using System;
using System.Threading.Tasks;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IArchivesStatsService
    {
        Task<Result<ArchivesStatsDto>> GetStatsAsync();
    }
}
