var builder = DistributedApplication.CreateBuilder(args);

var mongoBuilder = builder.AddMongoDB("mongo");

// Only use custom registry if configured in user secrets (e.g. on corporate network)
var imageRegistry = builder.Configuration["DockerImageRegistry"];
if (!string.IsNullOrEmpty(imageRegistry))
{
    mongoBuilder = mongoBuilder.WithImageRegistry(imageRegistry);
}

builder.AddProject<Projects.BookingSystem_API>("bookingsystem-api", launchProfileName: null)
       .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development")
       .WithHttpEndpoint(port: 5080, isProxied: false) // http://localhost:5080
       .WithUrlForEndpoint("http", url =>
        {
            url.Url = "/scalar";
            url.DisplayText = "API Docs (Scalar)";
        })
       .WithReference(mongoBuilder);

builder.Build().Run();
