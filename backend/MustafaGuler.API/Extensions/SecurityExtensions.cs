using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

namespace MustafaGuler.API.Extensions
{
    public static class SecurityExtensions
    {
        public static IServiceCollection ConfigureRateLimiting(this IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
                options.OnRejected = async (context, token) =>
                {
                    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    context.HttpContext.Response.ContentType = "application/json";
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        message = "You have sent too many requests. Please wait 1 minute.",
                        retryAfterSeconds = 60
                    }, cancellationToken: token);
                };

                // TODO: Make these limits configurable via appsettings

                // Global Policy: 100 requests per minute per IP
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            AutoReplenishment = true,
                            PermitLimit = 100,
                            Window = TimeSpan.FromMinutes(1)
                        }));

                // Login Policy: 5 requests per minute (Brute Force protection)
                options.AddFixedWindowLimiter("LoginPolicy", opt =>
                {
                    opt.PermitLimit = 5;
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.AutoReplenishment = true;
                });

                // Search Policy: 30 requests per minute (Spam protection)
                options.AddFixedWindowLimiter("SearchPolicy", opt =>
                {
                    opt.PermitLimit = 30;
                    opt.Window = TimeSpan.FromMinutes(1);
                    opt.AutoReplenishment = true;
                });
            });

            return services;
        }
    }
}
