using System.Collections.Generic;
using System.Threading.Tasks;
using AcceptanceTests.Common.Configuration;
using AcceptanceTests.Common.Exceptions;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Data;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.Common.Configuration;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Configuration;

namespace TestWeb.AcceptanceTests.Hooks
{
    [Binding]
    public class ConfigHooks
    {
        private readonly IConfigurationRoot _configRoot;

        public ConfigHooks(TestContext context)
        {
            _configRoot = ConfigurationManager.BuildConfig("a7b48686-45a2-45b2-81e6-f1f9aac606fa", "88A6778C-7724-4470-AA7F-F603F963F670");
            context.Config = new Config();
        }

        private static bool RunOnSauceLabsFromLocal()
        {
            return NUnit.Framework.TestContext.Parameters["RunOnSauceLabs"] != null &&
                   NUnit.Framework.TestContext.Parameters["RunOnSauceLabs"].Equals("true");
        }

        [BeforeScenario(Order = (int)HooksSequence.ConfigHooks)]
        public async Task RegisterSecrets(TestContext context)
        {
            RegisterAzureSecrets(context);
            RegisterTestUserSecrets(context);
            RegisterHearingServices(context);
            RegisterSauceLabsSettings(context);
            RunningAppsLocally(context);
            await GenerateBearerTokens(context);
        }

        private void RegisterAzureSecrets(TestContext context)
        {
            context.Config.AzureAdConfiguration = Options.Create(_configRoot.GetSection("AzureAd").Get<AzureAdConfiguration>()).Value;
            context.Config.AzureAdConfiguration.Authority += context.Config.AzureAdConfiguration.TenantId;
            context.Config.AzureAdConfiguration.Authority.Should().NotBeNullOrEmpty();
            context.Config.AzureAdConfiguration.ClientId.Should().NotBeNullOrEmpty();
            context.Config.AzureAdConfiguration.ClientSecret.Should().NotBeNullOrEmpty();
            context.Config.AzureAdConfiguration.TenantId.Should().NotBeNullOrEmpty();
        }

        private void RegisterTestUserSecrets(TestContext context)
        {
            context.Config.TestSettings = Options.Create(_configRoot.GetSection("Testing").Get<TestSettings>()).Value;
            context.Config.TestSettings.TargetBrowser.Should().NotBeNull();
            context.Config.TestSettings.TargetDevice.Should().NotBeNull();
            context.Config.TestSettings.TargetOS.Should().NotBeNull();
            context.Config.TestSettings.TestUsernameStem.Should().NotBeNull();
            context.Config.TestSettings.TestUserPassword.Should().NotBeNull();
            context.Test = new Test
            {
                CaseNames = new List<string>(),
                Users = new List<User>()
            };
        }

        private void RegisterHearingServices(TestContext context)
        {
            context.Config.Services = GetTargetTestEnvironment() == string.Empty ? Options.Create(_configRoot.GetSection("Services").Get<HearingServicesConfiguration>()).Value 
                : Options.Create(_configRoot.GetSection($"Testing.{GetTargetTestEnvironment()}.Services").Get<HearingServicesConfiguration>()).Value;
            if (context.Config.Services == null && GetTargetTestEnvironment() != string.Empty) throw new TestSecretsFileMissingException(GetTargetTestEnvironment());
            ConfigurationManager.VerifyConfigValuesSet(context.Config.Services);
        }

        private static string GetTargetTestEnvironment()
        {
            return NUnit.Framework.TestContext.Parameters["TargetTestEnvironment"] ?? string.Empty;
        }

        private void RegisterSauceLabsSettings(TestContext context)
        {
            context.Config.SauceLabsConfiguration = RunOnSauceLabsFromLocal() ?  Options.Create(_configRoot.GetSection("LocalSaucelabs").Get<SauceLabsSettingsConfig>()).Value
                : Options.Create(_configRoot.GetSection("Saucelabs").Get<SauceLabsSettingsConfig>()).Value;
            if (!context.Config.SauceLabsConfiguration.RunningOnSauceLabs()) return;
            context.Config.SauceLabsConfiguration.SetRemoteServerUrlForDesktop(ConfigData.SauceLabsServerUrl);
            context.Config.SauceLabsConfiguration.AccessKey.Should().NotBeNullOrWhiteSpace();
            context.Config.SauceLabsConfiguration.Username.Should().NotBeNullOrWhiteSpace();
            context.Config.SauceLabsConfiguration.RealDeviceApiKey.Should().NotBeNullOrWhiteSpace();
        }

        private static void RunningAppsLocally(TestContext context)
        {
            context.Config.Services.RunningTestApiLocally = context.Config.Services.TestApiUrl.Contains("localhost");
            context.Config.Services.RunningTestWebLocally = context.Config.Services.TestWebUrl.Contains("localhost");
        }

        private static async Task GenerateBearerTokens(TestContext context)
        {
            context.TestApiToken = await ConfigurationManager.GetBearerToken(
                new TestAdConfig(context.Config.AzureAdConfiguration), context.Config.Services.TestApiResourceId);
            context.TestApiToken.Should().NotBeNullOrEmpty();
        }
    }
}
