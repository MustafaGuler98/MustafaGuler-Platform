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
    public class LocalQuoteProvider : IActivityProvider
    {
        private readonly IGenericRepository<Quote> _repository;

        public LocalQuoteProvider(IGenericRepository<Quote> repository)
        {
            _repository = repository;
        }

        public string ProviderType => "Local";
        public string ActivityType => "Quote";



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
                Type = "Quote",
                Title = item.Content,
                Subtitle = item.Author,
                Description = item.Source,
                ImageUrl = null
            };
        }

        public async Task<(string? title, string? imageUrl)> GetItemTitleAndImageAsync(Guid itemId)
        {
            var item = await _repository.GetByIdAsync(itemId);
            return (item?.Content, null);
        }

        public async Task<Dictionary<Guid, (string? title, string? imageUrl)>> GetItemsTitlesAndImagesAsync(IEnumerable<Guid> itemIds)
        {
            var items = await _repository.GetAllAsync(x => itemIds.Contains(x.Id));
            return items.ToDictionary(k => k.Id, v => ((string?)v.Content, (string?)null));
        }
    }
}
