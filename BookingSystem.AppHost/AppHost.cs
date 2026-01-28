var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.BookingSystem_API>("bookingsystem-api", launchProfileName: null)
       .WithEnvironment("ASPNETCORE_ENVIRONMENT", "Development")
       .WithHttpEndpoint(port: 5080, isProxied: false) // http://localhost:5080
       .WithUrlForEndpoint("http", url =>
        {
            url.Url = "/scalar";
            url.DisplayText = "API Docs (Scalar)";
        })
       .WithEnvironment("ConnectionStrings__mongo", "mongodb://localhost:27017");

builder.Build().Run();
