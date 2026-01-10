using Microsoft.EntityFrameworkCore;
using MustafaGuler.API.Extensions;
using MustafaGuler.Repository.Contexts;
using MustafaGuler.Service.Mapping;
using FluentValidation;
using FluentValidation.AspNetCore;
using MustafaGuler.Service.Validators;
using Serilog;

// TODO: Move complex setups to extension methods (in Extensions folder) to keep this file readable.

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentityConfiguration();
builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddApplicationServices(); // Register application dependencies. /Extensions/DependencyInjectionExtensions.cs

builder.Services.AddAutoMapper(typeof(MapProfile));

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<ArticleAddDtoValidator>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for cookies
    });
});

builder.Services.ConfigureForwardedHeaders();
builder.Services.ConfigureRateLimiting();

var app = builder.Build();

await app.SeedAdminUserAsync();

app.ApplyMigrations();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<MustafaGuler.API.Middlewares.GlobalExceptionMiddleware>();

// Only redirect to HTTPS in Production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseForwardedHeaders();
app.UseCors("AllowFrontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
