using AcceptanceTests.Common.Configuration;
using TestWeb.Common.Configuration;

namespace TestWeb.Tests.Common.Configuration
{
    public class Config
    {
        public AzureAdConfiguration AzureAdConfiguration { get; set; }
        public HearingServicesConfiguration Services { get; set; }
        public SauceLabsSettingsConfig SauceLabsConfiguration { get; set; }
        public TestSettings TestSettings { get; set; }
    }
}
