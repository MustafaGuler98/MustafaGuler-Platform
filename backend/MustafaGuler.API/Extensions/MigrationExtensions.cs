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

            var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

            const int maxRetries = 30;
            const int delayMs = 2000;

            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    logger.LogInformation("Attempting database migration (attempt {Attempt}/{MaxRetries})...", i + 1, maxRetries);
                    dbContext.Database.Migrate();
                    logger.LogInformation("Database migration completed successfully.");
                    return;
                }
                catch (Exception ex)
                {
                    logger.LogWarning("Migration attempt {Attempt} failed: {Message}", i + 1, ex.Message);

                    if (i == maxRetries - 1)
                    {
                        logger.LogError(ex, "Database migration failed after {MaxRetries} attempts.", maxRetries);
                        throw;
                    }

                    Thread.Sleep(delayMs);
                }
            }
        }
    }
}
