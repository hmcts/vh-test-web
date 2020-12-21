using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using TestWeb.Common.Configuration;
using TestWeb.Common.Security;

namespace TestWeb.IntegrationTests.Controllers
{
    public class ControllerTestsBase
    {
        private TestServer _server;
        private string _bearerToken;
        protected HttpResponseMessage Response;
        protected string Json;

        [OneTimeSetUp]
        public void OneTimeSetup()
        {
            var webHostBuilder = WebHost.CreateDefaultBuilder()
                .UseKestrel(c => c.AddServerHeader = false)
                .UseEnvironment("Development")
                .UseStartup<Startup>();
            _server = new TestServer(webHostBuilder);
            GetClientAccessTokenForApi();
        }

        private void GetClientAccessTokenForApi()
        {
            var configRootBuilder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile("appsettings.Production.json", true)
                .AddJsonFile("appsettings.Development.json", true)
                .AddEnvironmentVariables()
                .AddUserSecrets<Startup>();

            var configRoot = configRootBuilder.Build();
            var azureAdConfigurationOptions = Options.Create(configRoot.GetSection("AzureAd").Get<AzureAdConfiguration>());
            var azureAdConfiguration = azureAdConfigurationOptions.Value;
            VerifyConfigValuesSet(azureAdConfiguration);
            _bearerToken = new TokenProvider(azureAdConfigurationOptions).GetClientAccessToken(
                azureAdConfiguration.ClientId, azureAdConfiguration.ClientSecret, azureAdConfiguration.ClientId);
        }

        private static void VerifyConfigValuesSet(AzureAdConfiguration azureAdConfiguration)
        {
            azureAdConfiguration.Authority.Should().NotBeNullOrEmpty();
            azureAdConfiguration.ClientId.Should().NotBeNullOrEmpty();
            azureAdConfiguration.ClientSecret.Should().NotBeNullOrEmpty();
            azureAdConfiguration.TenantId.Should().NotBeNullOrEmpty();
        }

        protected async Task SendGetRequestAsync(string uri)
        {
            using var client = _server.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_bearerToken}");
            Response = await client.GetAsync(uri);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected async Task SendPostRequestAsync(string uri, HttpContent httpContent)
        {
            using var client = _server.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_bearerToken}");
            Response = await client.PostAsync(uri, httpContent);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected async Task SendPatchRequestAsync(string uri, StringContent httpContent)
        {
            using var client = _server.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_bearerToken}");
            Response = await client.PatchAsync(uri, httpContent);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected async Task SendPutRequestAsync(string uri, StringContent httpContent)
        {
            using var client = _server.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_bearerToken}");
            Response = await client.PutAsync(uri, httpContent);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected async Task SendDeleteRequestAsync(string uri)
        {
            using var client = _server.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_bearerToken}");
            Response = await client.DeleteAsync(uri);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected void VerifyResponse(HttpStatusCode statusCode, bool isSuccess)
        {
            Response.StatusCode.Should().Be(statusCode);
            Response.IsSuccessStatusCode.Should().Be(isSuccess);
        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            _server.Dispose();
        }
    }
}
