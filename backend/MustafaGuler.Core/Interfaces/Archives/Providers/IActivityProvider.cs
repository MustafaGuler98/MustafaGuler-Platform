using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces.Archives.Providers
{
    public interface IActivityProvider
    {
        string ProviderType { get; } // "Local", "Spotify"
        string ActivityType { get; }

        Task<List<ActivityOptionDto>> GetRefreshedOptionsAsync();
        Task<PublicActivityDto?> GetDetailsAsync(Guid itemId);
        Task<(string? title, string? imageUrl)> GetItemTitleAndImageAsync(Guid itemId);

        // Batch Fetching
        Task<Dictionary<Guid, (string? title, string? imageUrl)>> GetItemsTitlesAndImagesAsync(IEnumerable<Guid> itemIds);
    }
}
