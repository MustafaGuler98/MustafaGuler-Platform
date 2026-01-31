using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Entities.Archives;
using MustafaGuler.Core.Interfaces;
using System.Threading.Tasks;
using System.Linq;
using MustafaGuler.Core.Utilities.Results;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Interfaces.Archives.Providers;
using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace MustafaGuler.Service.Services.Archives
{
    public class PublicActivityService : IPublicActivityService
    {
        private readonly IGenericRepository<Activity> _activityRepository;
        private readonly IProviderFactory _providerFactory;
        private readonly ILogger<PublicActivityService> _logger;

        public PublicActivityService(
            IGenericRepository<Activity> activityRepository,
            IProviderFactory providerFactory,
            ILogger<PublicActivityService> logger)
        {
            _activityRepository = activityRepository;
            _providerFactory = providerFactory;
            _logger = logger;
        }


        public async Task<Result<PublicActivitiesDto>> GetPublicActivitiesAsync()
        {
            var result = new PublicActivitiesDto();
            var activities = await _activityRepository.GetAllAsync(r => !r.IsDeleted);

            foreach (var activity in activities)
            {
                if (!activity.SelectedItemId.HasValue) continue;

                var providerResult = _providerFactory.GetProvider(activity.ActivityType);

                if (!providerResult.IsSuccess)
                {
                    continue;
                }

                var provider = providerResult.Data!;
                var item = await provider.GetDetailsAsync(activity.SelectedItemId.Value);

                if (item == null) continue;

                switch (activity.ActivityType)
                {
                    case "Book": result.Book = item; break;
                    case "Movie": result.Movie = item; break;
                    case "TvSeries": result.TvSeries = item; break;
                    case "Music": result.Music = item; break;
                    case "Anime": result.Anime = item; break;
                    case "Game": result.Game = item; break;
                    case "TTRPG": result.TTRPG = item; break;
                }
            }

            return Result<PublicActivitiesDto>.Success(result);
        }
    }
}
