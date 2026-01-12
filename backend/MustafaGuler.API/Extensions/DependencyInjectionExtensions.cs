using MustafaGuler.Core.Interfaces;
using MustafaGuler.Repository.Repositories;
using MustafaGuler.Service.Services;

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

            return services;
        }
    }
}
