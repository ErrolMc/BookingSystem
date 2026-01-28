using Scalar.AspNetCore;
using MongoDB.Driver;
using BookingSystem.API.Services;

namespace BookingSystem.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            
            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var mongoConnectionString = builder.Configuration.GetConnectionString("mongo");

            builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoConnectionString));

            builder.Services.AddSingleton(sp =>
            {
                var client = sp.GetRequiredService<IMongoClient>();
                return client.GetDatabase("BookingSystem");
            });

            builder.Services.AddSingleton<BookService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
