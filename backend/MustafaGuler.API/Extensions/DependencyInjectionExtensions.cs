using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Interfaces.Archives.Providers;
using MustafaGuler.Repository.Repositories;
using MustafaGuler.Service.Services;
using MustafaGuler.Service.Services.Archives;
using MustafaGuler.Service.Services.Archives.Providers;
using MustafaGuler.Service.Services.Archives.Providers.Local;
using MustafaGuler.Service.BackgroundServices;


namespace MustafaGuler.API.Extensions
{
    public static class DependencyInjectionExtensions
    {
        // Encapsulates service registrations to keep Program.cs clean

        public static IServiceCollection AddApplicationServices(this IServiceCollection services, Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddMemoryCache();


            services.AddScoped(typeof(IService<>), typeof(Service<>));
            services.AddScoped<IArticleService, ArticleService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IImageService, ImageService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ISecurityService, SecurityService>();
            services.AddScoped<IAuthCookieService, AuthCookieService>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IMailService, MailManager>();
            services.AddScoped<IContactService, ContactService>();

            // Archives
            services.AddScoped<IMovieService, MovieService>();
            services.AddScoped<IBookService, BookService>();
            services.AddScoped<IQuoteService, QuoteService>();
            services.AddScoped<ITvSeriesService, TvSeriesService>();
            services.AddScoped<IAnimeService, AnimeService>();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IMusicService, MusicService>();
            services.AddScoped<ITTRPGService, TTRPGService>();
            services.AddScoped<IArchivesStatsService, ArchivesStatsService>();
            services.AddScoped<IPublicActivityService, PublicActivityService>();
            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<IMusicStatusService, MusicStatusService>();
            services.AddScoped<ISpotlightService, SpotlightService>();
            services.AddScoped<IMindmapService, MindmapService>();

            // Last Fm
            services.Configure<MustafaGuler.Core.DTOs.Settings.LastFmSettings>(configuration.GetSection("LastFm"));
            services.AddHttpClient<ILastFmService, LastFmService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(10);
            });

            // Cache
            services.AddHttpClient<ICacheInvalidationService, CacheInvalidationService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(5);
            });

            services.AddHttpClient("ImageDownloader", client =>
            {
                client.Timeout = TimeSpan.FromSeconds(10);
                client.DefaultRequestHeaders.UserAgent.ParseAdd("MustafaGuler.Platform/1.0");
            })
            .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
            {
                AllowAutoRedirect = false,
                UseCookies = false
            });

            // Providers
            services.AddScoped<IProviderFactory, ProviderFactory>();

            services.AddScoped<IActivityProvider, LocalMovieProvider>();
            services.AddScoped<IActivityProvider, LocalBookProvider>();
            services.AddScoped<IActivityProvider, LocalTvSeriesProvider>();
            services.AddScoped<IActivityProvider, LocalMusicProvider>();
            services.AddScoped<IActivityProvider, LocalAnimeProvider>();
            services.AddScoped<IActivityProvider, LocalGameProvider>();
            services.AddScoped<IActivityProvider, LocalTTRPGProvider>();
            services.AddScoped<IActivityProvider, LocalQuoteProvider>();

            // Background Services
            services.AddHostedService<MusicSyncBackgroundService>();

            // Kafka Services
            services.AddScoped<IEmailQueueService, EmailQueueService>();
            services.AddSingleton<IKafkaProducerService, KafkaProducerService>();
            services.AddHostedService<EmailWorkerService>();

            return services;
        }
    }
}

