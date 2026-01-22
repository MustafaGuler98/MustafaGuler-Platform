using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MustafaGuler.Core.Entities;
using MustafaGuler.Core.Entities.Archives;
using System;
using System.Reflection;

namespace MustafaGuler.Repository.Contexts
{
    public class AppDbContext : IdentityDbContext<AppUser, AppRole, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Subscriber> Subscribers { get; set; }

        // Archives Module
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<TvSeries> TvSeries { get; set; }
        public DbSet<Anime> Animes { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<TTRPG> TTRPGs { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<SpotlightItem> SpotlightItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}