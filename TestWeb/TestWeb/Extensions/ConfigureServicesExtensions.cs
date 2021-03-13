using System.Linq;
using System.Net.Http;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using NSwag;
using NSwag.Generation.Processors.Security;
using TestApi.Client;
using TestWeb.Common;
using TestWeb.Common.Configuration;
using TestWeb.Common.Security;
using TestWeb.Swagger;

namespace TestWeb.Extensions
{
    public static class ConfigureServicesExtensions
    {
        public static IServiceCollection AddSwagger(this IServiceCollection services)
        {
            services.AddOpenApiDocument((document, serviceProvider) =>
            {
                document.AddSecurity("JWT", Enumerable.Empty<string>(),
                    new OpenApiSecurityScheme
                    {
                        Type = OpenApiSecuritySchemeType.ApiKey,
                        Name = "Authorization",
                        In = OpenApiSecurityApiKeyLocation.Header,
                        Description = "Type into the textfield: Bearer {your JWT token}.",
                        Scheme = "bearer"
                    });
                document.Title = "Test Api";
                document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
                document.OperationProcessors.Add(new AuthResponseOperationProcessor());
            });
            return services;
        }

        public static IServiceCollection AddCustomTypes(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddMemoryCache();
            services.AddSingleton<ITelemetryInitializer, RequestVhTelemetry>();
            services.AddTransient<TestApiTokenHandler>();
            services.AddScoped<ITokenProvider, TokenProvider>();
            services.AddScoped<AzureAdConfiguration>();
            services.AddScoped<HearingServicesConfiguration>();

            var container = services.BuildServiceProvider();
            var servicesConfiguration = container.GetService<IOptions<HearingServicesConfiguration>>().Value;

            services.AddHttpClient<ITestApiClient, TestApiClient>()
                .AddHttpMessageHandler<TestApiTokenHandler>()
                .AddTypedClient(httpClient => BuildBookingsApiClient(httpClient, servicesConfiguration));

            return services;
        }

        public static IServiceCollection AddJsonOptions(this IServiceCollection serviceCollection)
        {
            var contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new SnakeCaseNamingStrategy()
            };

            serviceCollection.AddMvc()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ContractResolver = contractResolver;
                    options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                });

            return serviceCollection;
        }

        private static ITestApiClient BuildBookingsApiClient(HttpClient httpClient,
            HearingServicesConfiguration serviceSettings)
        {
            return TestApiClient.GetClient(serviceSettings.TestApiUrl, httpClient);
        }
    }
}
