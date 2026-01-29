var builder = DistributedApplication.CreateBuilder(args);

var mongoBuilder = builder.AddMongoDB("mongo")
    .WithExternalHttpEndpoints()
    .WithDataVolume("mongo-data")
    .WithImageRegistry("docker-hub.artifactory.srv.westpac.com.au");

var frontEnd = builder.AddNpmApp("frontend", "../bookingsystem.web", "dev")
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithEnvironment("CHOKIDAR_USEPOLLING", "true")
    .WithEnvironment("WATCHPACK_POLLING", "true")
    .WithEnvironment("WATCHPACK_POLLING_INTERVAL", "200");

var api = builder.AddProject<Projects.BookingSystem_API>("bookingsystem-api", launchProfileName: null)
    .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development")
    .WithHttpEndpoint(port: 5080, isProxied: false) // http://localhost:5080
    .WithUrlForEndpoint("http", url =>
    {
        url.Url = "/scalar";
        url.DisplayText = "API Docs (Scalar)";
    })
    .WithReference(mongoBuilder)
    .WithReference(frontEnd); // feed frontend URL to API for CORS

// Update frontend with API reference
frontEnd.WithReference(api);

builder.Build().Run();
