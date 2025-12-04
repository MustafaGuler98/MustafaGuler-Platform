using Microsoft.EntityFrameworkCore;
using MustafaGuler.Repository.Contexts;

namespace MustafaGuler.API.Extensions
{
    public static class MigrationExtensions
    {
        public static void ApplyMigrations(this IApplicationBuilder app)
        {
            using IServiceScope scope = app.ApplicationServices.CreateScope();

            using AppDbContext dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            try
            {
                dbContext.Database.Migrate();
            }
            catch (Exception ex)
            {
                // To do: Log the exception
                Console.WriteLine($"Migration Hatası: {ex.Message}");
                throw; 
            }
        }
    }
}