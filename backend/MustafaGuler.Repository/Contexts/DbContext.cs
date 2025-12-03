using Microsoft.EntityFrameworkCore;
using MustafaGuler.Core.Entities;

namespace MustafaGuler.Repository.Contexts
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Article> Articles { get; set; }
    }
}