using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using TestWeb.Contracts.Responses;
using TestWeb.Controllers;
using TestWeb.Tests.Common.Builders;

namespace TestWeb.UnitTests.Controllers.Config
{
    public class ConfigControllerTests
    {
        [Test]
        public void Should_retrieve_settings()
        {
            var azureSettings = new AzureConfigBuilder().Build();
            var servicesSettings = new ServicesConfigBuilder().Build();

            var configSettingsController = new ConfigSettingsController(Options.Create(azureSettings),
                Options.Create(servicesSettings));

            var actionResult = (OkObjectResult)configSettingsController.GetClientConfigurationSettings().Result;
            var clientSettings = (ClientSettingsResponse)actionResult.Value;

            clientSettings.AppInsightsInstrumentationKey.Should().Be(azureSettings.ApplicationInsights.InstrumentationKey);
            clientSettings.ClientId.Should().Be(azureSettings.ClientId);
            clientSettings.TenantId.Should().Be(azureSettings.TenantId);
            clientSettings.PostLogoutRedirectUri.Should().Be(azureSettings.PostLogoutRedirectUri);
            clientSettings.RedirectUri.Should().Be(azureSettings.RedirectUri);
            clientSettings.TestApiUrl.Should().Be(servicesSettings.TestApiUrl);
        }
    }
}
