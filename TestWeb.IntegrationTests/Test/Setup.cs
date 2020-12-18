using System.Threading.Tasks;
using AcceptanceTests.Common.Configuration;
using FluentAssertions;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using TestWeb.Common.Configuration;
using TestWeb.Tests.Common.Configuration;

namespace TestWeb.IntegrationTests.Test
{
    public class Setup
    {
        private readonly TestContext _context;
        private readonly IConfigurationRoot _configRoot;

        public Setup()
        {
            _context = new TestContext();
            _configRoot = ConfigurationManager.BuildConfig("a7b48686-45a2-45b2-81e6-f1f9aac606fa");
            _context.Config = new Config();
        }

        public async Task<TestContext> RegisterSecrets()
        {
            RegisterAzureSecrets();
            RegisterServer();
            RegisterServices();
            RegisterTestSettings();
            await GenerateBearerTokens();
            return _context;
        }

        private void RegisterServices()
        {
            _context.Config.Services = Options.Create(_configRoot.GetSection("VhServices").Get<HearingServicesConfiguration>()).Value;
            _context.Config.Services.TestApiUrl.Should().NotBeNullOrEmpty();
        }

        private void RegisterAzureSecrets()
        {
            var azureOptions = Options.Create(_configRoot.GetSection("AzureAd").Get<AzureAdConfiguration>());
            _context.Config.AzureAdConfiguration = azureOptions.Value;
            _context.Config.AzureAdConfiguration.Authority =
                _context.Config.AzureAdConfiguration.Authority + _context.Config.AzureAdConfiguration.TenantId;
            ConfigurationManager.VerifyConfigValuesSet(_context.Config.AzureAdConfiguration);
        }

        private void RegisterServer()
        {
            var webHostBuilder = WebHost.CreateDefaultBuilder()
                .UseKestrel(c => c.AddServerHeader = false)
                .UseEnvironment("Development")
                .UseStartup<Startup>();
            _context.Server = new TestServer(webHostBuilder);
        }

        private void RegisterTestSettings()
        {
            _context.Config.TestSettings = Options.Create(_configRoot.GetSection("Testing").Get<TestSettings>()).Value;
            _context.Config.TestSettings.TestUserPassword.Should().NotBeNullOrEmpty();
            _context.Config.TestSettings.TestUsernameStem.Should().NotBeNullOrEmpty();
        }

        private async Task GenerateBearerTokens()
        {
            _context.Token = await ConfigurationManager.GetBearerToken(
                new TestAdConfig(_context.Config.AzureAdConfiguration), _context.Config.Services.TestApiResourceId);
            _context.Token.Should().NotBeNullOrEmpty();
        }
    }
}
