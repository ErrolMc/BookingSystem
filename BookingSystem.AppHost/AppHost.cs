var builder = DistributedApplication.CreateBuilder(args);

var mongoBuilder = builder.AddMongoDB("mongo");

// Only use custom registry if configured in user secrets (e.g. on corporate network)
var imageRegistry = builder.Configuration["DockerImageRegistry"];
if (!string.IsNullOrEmpty(imageRegistry))
{
    mongoBuilder = mongoBuilder.WithImageRegistry(imageRegistry);
}

var api = builder.AddProject<Projects.BookingSystem_API>("bookingsystem-api", launchProfileName: null)
    .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development")
    .WithHttpEndpoint(port: 5080, isProxied: false) // http://localhost:5080
    .WithUrlForEndpoint("http", url =>
    {
        url.Url = "/scalar";
        url.DisplayText = "API Docs (Scalar)";
    })
    .WithReference(mongoBuilder);

var frontEnd = builder.AddNpmApp("frontend", "../bookingsystem.web", "dev")
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithReference(api)
    .WithEnvironment("CHOKIDAR_USEPOLLING", "true")
    .WithEnvironment("WATCHPACK_POLLING", "true")
    .WithEnvironment("WATCHPACK_POLLING_INTERVAL", "200");

builder.Build().Run();
