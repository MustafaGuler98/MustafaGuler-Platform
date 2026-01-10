using Microsoft.AspNetCore.HttpOverrides;
using System.Net;

namespace MustafaGuler.API.Extensions
{
    public static class InfrastructureExtensions
    {
        public static IServiceCollection ConfigureForwardedHeaders(this IServiceCollection services)
        {
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                options.KnownIPNetworks.Clear();
                options.KnownProxies.Clear();

                // Private IP range used by Docker (172.16.x.x - 172.31.x.x)
                // TODO: Make this configurable via appsettings
                options.KnownIPNetworks.Add(new System.Net.IPNetwork(IPAddress.Parse("172.16.0.0"), 12));

                // Only trust nginx proxy
                options.ForwardLimit = 1;
            });

            return services;
        }
    }
}
