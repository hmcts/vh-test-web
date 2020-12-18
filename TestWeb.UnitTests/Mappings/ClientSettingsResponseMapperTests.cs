using FluentAssertions;
using NUnit.Framework;
using TestWeb.Mappings;
using TestWeb.Tests.Common.Builders;
using TestWeb.Tests.Common.Builders.Models;

namespace TestWeb.UnitTests.Mappings
{
    public class ClientSettingsResponseMapperTests
    {
        [Test]
        public void Should_map_all_properties()
        {
            var azureSettings = new AzureConfigBuilder().Build();
            var servicesSettings = new ServicesConfigBuilder().Build();

            var response = ClientSettingsResponseMapper.MapAppConfigurationToResponseModel(azureSettings, servicesSettings);
            response.Should().BeEquivalentTo(azureSettings, options => options
                .Excluding(x => x.ApplicationInsights)
                .Excluding(x => x.Authority)
                .Excluding(x => x.ClientSecret));
        }
    }
}
