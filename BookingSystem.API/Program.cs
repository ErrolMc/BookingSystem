using Scalar.AspNetCore;
using MongoDB.Driver;
using BookingSystem.API.Repositories;

namespace BookingSystem.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            
            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowNextJs", policy =>
                {
                    policy.WithOrigins(GetAllowedOrigins(builder))
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var mongoConnectionString = builder.Configuration.GetConnectionString("mongo");

            builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoConnectionString));

            builder.Services.AddSingleton(sp =>
            {
                var client = sp.GetRequiredService<IMongoClient>();
                return client.GetDatabase("BookingSystem");
            });

            // Register repositories
            builder.Services.AddSingleton<PatientRepository>();
            builder.Services.AddSingleton<PractitionerRepository>();
            builder.Services.AddSingleton<AdministratorRepository>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowNextJs");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }

        static string[] GetAllowedOrigins(WebApplicationBuilder builder)
        {
            // Add CORS support for Next.js frontend
            // Get frontend URLs from Aspire service reference
            var allowedOrigins = new List<string>();

            string? frontendHttpUrl = builder.Configuration["services:frontend:http:0"];
            string? frontendHttpsUrl = builder.Configuration["services:frontend:https:0"];

            if (!string.IsNullOrEmpty(frontendHttpUrl))
                allowedOrigins.Add(frontendHttpUrl);

            if (!string.IsNullOrEmpty(frontendHttpsUrl))
                allowedOrigins.Add(frontendHttpsUrl);

            // Fallback for standalone development
            if (allowedOrigins.Count == 0)
            {
                allowedOrigins.Add("http://localhost:3000");
                allowedOrigins.Add("https://localhost:3000");
            }

            return allowedOrigins.ToArray();
        }
    }
}
