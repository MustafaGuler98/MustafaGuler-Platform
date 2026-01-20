using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MustafaGuler.Core.Utilities.Results;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Interfaces.Archives.Providers;

namespace MustafaGuler.Service.Services.Archives
{
    public class ActivityService : IActivityService
    {
        private readonly IGenericRepository<Activity> _activityRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProviderFactory _providerFactory;

        private static readonly string[] ActivityTypes = { "Book", "Movie", "TvSeries", "Music", "Anime", "Game", "TTRPG" };

        public ActivityService(
            IGenericRepository<Activity> activityRepository,
            IUnitOfWork unitOfWork,
            IProviderFactory providerFactory)
        {
            _activityRepository = activityRepository;
            _unitOfWork = unitOfWork;
            _providerFactory = providerFactory;
        }

        // There was a bug here where default activities were not created if none selected.
        public async Task EnsureDefaultActivitiesExistAsync()
        {
            var existingActivities = await _activityRepository.GetAllAsync(r => !r.IsDeleted);
            var existingTypes = existingActivities.Select(r => r.ActivityType).ToHashSet();

            var order = 0;
            foreach (var type in ActivityTypes)
            {
                if (!existingTypes.Contains(type))
                {
                    await _activityRepository.AddAsync(new Activity
                    {
                        ActivityType = type,
                        SelectedItemId = null,
                        DisplayOrder = order
                    });
                }
                order++;
            }
            await _unitOfWork.CommitAsync();
        }

        public async Task<Result<List<ActivityDto>>> GetAllActivitiesAsync()
        {
            await EnsureDefaultActivitiesExistAsync();

            var activities = await _activityRepository.GetAllAsync(r => !r.IsDeleted);
            var result = new List<ActivityDto>();

            var idsByType = activities
                .Where(a => a.SelectedItemId.HasValue)
                .GroupBy(a => a.ActivityType)
                .ToDictionary(g => g.Key, g => g.Select(x => x.SelectedItemId!.Value).ToList());

            // Batch Fetching: Fetch bulk data for each type and cache in memory
            var detailsCache = new Dictionary<(string Type, Guid Id), (string Title, string ImageUrl)>();

            foreach (var typeGroup in idsByType)
            {
                var providerResult = _providerFactory.GetProvider(typeGroup.Key);
                if (!providerResult.IsSuccess)
                {
                    // I may log this issue later.
                    continue;
                }

                var provider = providerResult.Data!;
                var batchResults = await provider.GetItemsTitlesAndImagesAsync(typeGroup.Value);

                foreach (var kvp in batchResults)
                {
                    detailsCache[(typeGroup.Key, kvp.Key)] = (kvp.Value.title ?? "Unknown Title", kvp.Value.imageUrl ?? "");
                }
            }

            foreach (var activity in activities.OrderBy(r => r.DisplayOrder))
            {
                var dto = new ActivityDto
                {
                    ActivityType = activity.ActivityType,
                    SelectedItemId = activity.SelectedItemId,
                    DisplayOrder = activity.DisplayOrder
                };

                if (activity.SelectedItemId.HasValue)
                {
                    if (detailsCache.TryGetValue((activity.ActivityType, activity.SelectedItemId.Value), out var detail))
                    {
                        dto.SelectedItemTitle = detail.Title;
                        dto.SelectedItemImageUrl = detail.ImageUrl;
                    }
                    else
                    {
                        dto.SelectedItemTitle = "Item Not Found";
                    }
                }

                result.Add(dto);
            }

            return Result<List<ActivityDto>>.Success(result);
        }

        public async Task<Result<List<ActivityOptionDto>>> GetOptionsForTypeAsync(string activityType)
        {
            var providerResult = _providerFactory.GetProvider(activityType);
            if (!providerResult.IsSuccess)
            {
                return Result<List<ActivityOptionDto>>.Failure(providerResult.StatusCode, providerResult.Message);
            }

            var provider = providerResult.Data!;
            var options = await provider.GetRefreshedOptionsAsync();
            return Result<List<ActivityOptionDto>>.Success(options.OrderBy(o => o.Title).ToList());
        }

        public async Task<Result<bool>> UpdateActivityAsync(string activityType, Guid? selectedItemId)
        {
            var providerResult = _providerFactory.GetProvider(activityType);
            if (!providerResult.IsSuccess)
            {
                return Result<bool>.Failure(providerResult.StatusCode, providerResult.Message);
            }

            var activities = await _activityRepository.GetAllAsync(r => r.ActivityType == activityType && !r.IsDeleted);
            var activity = activities.FirstOrDefault();

            if (activity == null)
            {
                await _activityRepository.AddAsync(new Activity
                {
                    ActivityType = activityType,
                    SelectedItemId = selectedItemId,
                    DisplayOrder = Array.IndexOf(ActivityTypes, activityType)
                });
            }
            else
            {
                activity.SelectedItemId = selectedItemId;
                _activityRepository.Update(activity);
            }

            await _unitOfWork.CommitAsync();
            return Result<bool>.Success(true);
        }

        public async Task<Result> UpdateActivitiesAsync(List<UpdateActivityDto> items)
        {
            var existingActivities = await _activityRepository.GetAllAsync(r => !r.IsDeleted);
            var activityMap = existingActivities.ToDictionary(k => k.ActivityType, v => v);

            foreach (var item in items)
            {
                var providerResult = _providerFactory.GetProvider(item.ActivityType);
                if (!providerResult.IsSuccess)
                {
                    return Result.Failure(providerResult.StatusCode, providerResult.Message);
                }

                if (activityMap.TryGetValue(item.ActivityType, out var activity))
                {
                    if (activity.SelectedItemId != item.SelectedItemId)
                    {
                        activity.SelectedItemId = item.SelectedItemId;
                        _activityRepository.Update(activity);
                    }
                }
                else
                {
                    // If the activity doesn't exist (somehow), create it
                    await _activityRepository.AddAsync(new Activity
                    {
                        ActivityType = item.ActivityType,
                        SelectedItemId = item.SelectedItemId,
                        DisplayOrder = Array.IndexOf(ActivityTypes, item.ActivityType)
                    });
                }
            }

            await _unitOfWork.CommitAsync();
            return Result.Success(200, "Batch update successful.");
        }
    }
}
