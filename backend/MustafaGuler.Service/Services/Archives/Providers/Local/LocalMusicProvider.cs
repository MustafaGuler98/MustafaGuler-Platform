using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives.Providers;

namespace MustafaGuler.Service.Services.Archives.Providers.Local
{
    public class LocalMusicProvider : IActivityProvider
    {
        private readonly IGenericRepository<Music> _repository;

        public LocalMusicProvider(IGenericRepository<Music> repository)
        {
            _repository = repository;
        }

        public string ProviderType => "Local";
        public string ActivityType => "Music";



        public async Task<Guid?> GetRandomItemIdAsync(IEnumerable<Guid> excludedIds)
        {
            var item = await _repository.GetRandomAsync(x => !x.IsDeleted && !excludedIds.Contains(x.Id));
            return item?.Id;
        }

        public async Task<PublicActivityDto?> GetDetailsAsync(Guid itemId)
        {
            var item = await _repository.GetByIdAsync(itemId);
            if (item == null || item.IsDeleted) return null;

            return new PublicActivityDto
            {
                Type = "Music",
                Title = item.Title,
                Subtitle = item.Artist,
                Description = item.MyReview ?? item.Description,
                ImageUrl = item.CoverImageUrl
            };
        }

        public async Task<(string? title, string? imageUrl)> GetItemTitleAndImageAsync(Guid itemId)
        {
            var item = await _repository.GetByIdAsync(itemId);
            return (item?.Title, item?.CoverImageUrl);
        }

        public async Task<Dictionary<Guid, (string? title, string? imageUrl)>> GetItemsTitlesAndImagesAsync(IEnumerable<Guid> itemIds)
        {
            var items = await _repository.GetAllAsync(x => itemIds.Contains(x.Id));
            return items.ToDictionary(k => k.Id, v => ((string?)v.Title, (string?)v.CoverImageUrl));
        }
    }
}
