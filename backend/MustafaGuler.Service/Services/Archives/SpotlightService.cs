using Microsoft.Extensions.Caching.Memory;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.DTOs.Archives.Spotlight;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Interfaces.Archives.Providers;
using MustafaGuler.Core.Utilities.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;

namespace MustafaGuler.Service.Services.Archives
{
    public class SpotlightService : ISpotlightService
    {
        private readonly IGenericRepository<SpotlightItem> _repository;
        private readonly IProviderFactory _providerFactory;
        private readonly IMemoryCache _cache;
        private readonly IUnitOfWork _unitOfWork;

        // Lock to prevent race conditions when multiple users trigger a new selection simultaneously
        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        public SpotlightService(
            IGenericRepository<SpotlightItem> repository,
            IProviderFactory providerFactory,
            IMemoryCache cache,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _providerFactory = providerFactory;
            _cache = cache;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<PublicActivityDto>> GetCurrentSpotlightAsync(string category)
        {
            var cacheKey = CacheKeys.GetSpotlightKey(category);

            if (_cache.TryGetValue(cacheKey, out PublicActivityDto? cachedDto) && cachedDto != null)
            {
                return Result<PublicActivityDto>.Success(cachedDto);
            }

            var currentItem = await _repository.GetAsync(
                x => x.Category == category && x.EndDate > DateTime.UtcNow,
                orderBy: q => q.OrderByDescending(x => x.CreatedDate)
            );

            if (currentItem != null)
            {
                return await CacheAndReturnDetailsAsync(currentItem, cacheKey);
            }

            await _semaphore.WaitAsync();
            try
            {
                currentItem = await _repository.GetAsync(
                    x => x.Category == category && x.EndDate > DateTime.UtcNow,
                    orderBy: q => q.OrderByDescending(x => x.CreatedDate)
                );

                if (currentItem != null)
                {
                    return await CacheAndReturnDetailsAsync(currentItem, cacheKey);
                }

                var newItem = await SelectNewSpotlightItemAsync(category);

                if (newItem == null)
                {
                    return Result<PublicActivityDto>.Failure(404, $"No content available for category: {category}");
                }

                await _repository.AddAsync(newItem);
                await _unitOfWork.CommitAsync();

                return await CacheAndReturnDetailsAsync(newItem, cacheKey);
            }
            finally
            {
                _semaphore.Release();
            }
        }

        public async Task<Result<List<SpotlightHistoryDto>>> GetSpotlightHistoryAsync(string category)
        {
            var itemsEnumerable = await _repository.GetAllAsync(x => x.Category == category);
            var items = itemsEnumerable.OrderByDescending(x => x.CreatedDate).ToList();

            var providerResult = _providerFactory.GetProvider(category);
            if (!providerResult.IsSuccess) return Result<List<SpotlightHistoryDto>>.Failure(500, "Provider not found");
            var provider = providerResult.Data!;

            var historyList = new List<SpotlightHistoryDto>();

            var distinctIds = items.Select(x => x.ItemId).Distinct();
            var detailsMap = await provider.GetItemsTitlesAndImagesAsync(distinctIds);

            foreach (var item in items)
            {
                detailsMap.TryGetValue(item.ItemId, out var detail);

                historyList.Add(new SpotlightHistoryDto
                {
                    Id = item.Id,
                    ItemId = item.ItemId,
                    ItemTitle = detail.title ?? "Unknown Title",
                    ItemImageUrl = detail.imageUrl,
                    StartDate = item.StartDate,
                    EndDate = item.EndDate,
                    IsManualSelection = item.IsManualSelection,
                    IsActive = item.EndDate > DateTime.UtcNow
                });
            }

            return Result<List<SpotlightHistoryDto>>.Success(historyList);
        }

        public async Task<Result<Guid>> SetManualSpotlightAsync(string category, Guid itemId, DateTime endDate)
        {

            var newItem = new SpotlightItem
            {
                Category = category,
                ItemId = itemId,
                StartDate = DateTime.UtcNow,
                EndDate = endDate,
                IsManualSelection = true
            };

            await _repository.AddAsync(newItem);
            await _unitOfWork.CommitAsync();

            _cache.Remove(CacheKeys.GetSpotlightKey(category));

            return Result<Guid>.Success(newItem.Id);
        }

        private async Task<Result<PublicActivityDto>> CacheAndReturnDetailsAsync(SpotlightItem item, string cacheKey)
        {
            var providerResult = _providerFactory.GetProvider(item.Category);
            if (!providerResult.IsSuccess) return Result<PublicActivityDto>.Failure(500, "Provider not found");

            var dto = await providerResult.Data!.GetDetailsAsync(item.ItemId);

            if (dto == null) return Result<PublicActivityDto>.Failure(404, "Item details not found in archive");

            var timeUntilExpiration = item.EndDate - DateTime.UtcNow;

            if (timeUntilExpiration.TotalMinutes <= 0) timeUntilExpiration = TimeSpan.FromSeconds(30);

            _cache.Set(cacheKey, dto, timeUntilExpiration);

            return Result<PublicActivityDto>.Success(dto);
        }

        private async Task<SpotlightItem?> SelectNewSpotlightItemAsync(string category)
        {
            var providerResult = _providerFactory.GetProvider(category);
            if (!providerResult.IsSuccess) return null;
            var provider = providerResult.Data!;

            // 1. Get recently shown items to avoid repetition
            var historyCountToExclude = 10;
            var recentItems = await _repository.GetAllAsync(x => x.Category == category);
            var excludedIds = recentItems
                .OrderByDescending(x => x.CreatedDate)
                .Take(historyCountToExclude)
                .Select(x => x.ItemId)
                .ToHashSet();

            // 2. Try to get a random item that is NOT in the excluded list
            var selectedId = await provider.GetRandomItemIdAsync(excludedIds);

            // 3. Fallback: If all items have been shown recently, pick ANY random item
            if (selectedId == null)
            {
                selectedId = await provider.GetRandomItemIdAsync(new List<Guid>());
            }

            if (selectedId == null) return null; // No content exists at all

            var duration = category switch
            {
                "Book" => TimeSpan.FromDays(30),
                "Movie" => TimeSpan.FromDays(7),
                "TvSeries" => TimeSpan.FromDays(7),
                "Music" => TimeSpan.FromDays(1),
                "Anime" => TimeSpan.FromDays(7),
                _ => TimeSpan.FromDays(7)
            };

            return new SpotlightItem
            {
                Category = category,
                ItemId = selectedId.Value,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.Add(duration),
                IsManualSelection = false
            };
        }
    }
}
