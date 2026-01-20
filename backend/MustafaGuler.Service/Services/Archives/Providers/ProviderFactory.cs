using System;
using System.Collections.Generic;
using System.Linq;
using MustafaGuler.Core.Constants;
using MustafaGuler.Core.Interfaces.Archives.Providers;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Service.Services.Archives.Providers
{
    public class ProviderFactory : IProviderFactory
    {
        private readonly IEnumerable<IActivityProvider> _providers;

        public ProviderFactory(IEnumerable<IActivityProvider> providers)
        {
            _providers = providers;
        }

        public Result<IActivityProvider> GetProvider(string activityType)
        {
            // Eventually, we may have multiple providers for the same activity type like Spotify, YouTube, etc.
            var provider = _providers.FirstOrDefault(p => p.ActivityType == activityType && p.ProviderType == "Local");

            if (provider == null)
            {
                return Result<IActivityProvider>.Failure(400, Messages.ProviderNotFound);
            }

            return Result<IActivityProvider>.Success(provider);
        }
    }
}
