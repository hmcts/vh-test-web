using AcceptanceTests.Common.Configuration;
using TestWeb.Common.Configuration;

namespace TestWeb.Tests.Common.Configuration
{
    public class TestAdConfig : IAzureAdConfig
    {
        public TestAdConfig(AzureAdConfiguration adConfig)
        {
            Authority = adConfig.Authority;
            ClientId = adConfig.ClientId;
            ClientSecret = adConfig.ClientSecret;
            TenantId = adConfig.TenantId;
        }

        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string Authority { get; set; }
        public string TenantId { get; set; }
    }
}
