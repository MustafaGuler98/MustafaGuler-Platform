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
    public class LocalMovieProvider : IActivityProvider
    {
        private readonly IGenericRepository<Movie> _repository;

        public LocalMovieProvider(IGenericRepository<Movie> repository)
        {
            _repository = repository;
        }

        public string ProviderType => "Local";
        public string ActivityType => "Movie";

        public async Task<List<ActivityOptionDto>> GetRefreshedOptionsAsync()
        {
            var items = await _repository.GetAllAsync(x => !x.IsDeleted);
            return items.Select(m => new ActivityOptionDto
            {
                Id = m.Id,
                Title = m.Title,
                ImageUrl = m.CoverImageUrl,
                Subtitle = m.Director,
                CreatedDate = m.CreatedDate
            }).ToList();
        }

        public async Task<PublicActivityDto?> GetDetailsAsync(Guid itemId)
        {
            var item = await _repository.GetByIdAsync(itemId);
            if (item == null || item.IsDeleted) return null;

            return new PublicActivityDto
            {
                Type = "Movie",
                Title = item.Title,
                Subtitle = item.Director,
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
