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
    public class LocalGameProvider : IActivityProvider
    {
        private readonly IGenericRepository<Game> _repository;

        public LocalGameProvider(IGenericRepository<Game> repository)
        {
            _repository = repository;
        }

        public string ProviderType => "Local";
        public string ActivityType => "Game";



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
                Type = "Game",
                Title = item.Title,
                Subtitle = item.Platform,
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
