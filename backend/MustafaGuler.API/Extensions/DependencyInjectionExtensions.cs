using MustafaGuler.Core.Interfaces;
using MustafaGuler.Core.Interfaces.Archives;
using MustafaGuler.Core.Interfaces.Archives.Providers;
using MustafaGuler.Repository.Repositories;
using MustafaGuler.Service.Services;
using MustafaGuler.Service.Services.Archives;
using MustafaGuler.Service.Services.Archives.Providers;
using MustafaGuler.Service.Services.Archives.Providers.Local;


namespace MustafaGuler.API.Extensions
{
    public static class DependencyInjectionExtensions
    {
        // Encapsulates service registrations to keep Program.cs clean

        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped(typeof(IService<>), typeof(Service<>));
            services.AddScoped<IArticleService, ArticleService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IImageService, ImageService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, AuthService>();
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

            return services;
        }
    }
}

