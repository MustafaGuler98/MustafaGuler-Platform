using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.DTOs.Archives.Spotlight;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface ISpotlightService
    {
        Task<Result<PublicActivityDto>> GetCurrentSpotlightAsync(string category);
        Task<Result<List<SpotlightHistoryDto>>> GetSpotlightHistoryAsync(string category);
        Task<Result<Guid>> SetManualSpotlightAsync(string category, Guid itemId, DateTime endDate);
    }
}
