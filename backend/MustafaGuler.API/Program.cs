using Microsoft.EntityFrameworkCore;
using MustafaGuler.API.Extensions;
using MustafaGuler.Core.Interfaces;
using MustafaGuler.Repository.Contexts;
using MustafaGuler.Repository.Repositories;
using MustafaGuler.Service.Mapping;
using Serilog;
using Microsoft.AspNetCore.Identity;
using MustafaGuler.Core.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Add services to the container.
// Configure PostgreSQL database connection
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<AppUser, AppRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    //customize other options as needed
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IService<>), typeof(MustafaGuler.Service.Services.Service<>));
builder.Services.AddScoped<IArticleService, MustafaGuler.Service.Services.ArticleService>();
builder.Services.AddScoped<IImageService, MustafaGuler.Service.Services.ImageService>();

builder.Services.AddAutoMapper(typeof(MapProfile));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://mustafaguler.me", "http://159.69.196.46:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();
app.ApplyMigrations();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<MustafaGuler.API.Middlewares.GlobalExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
