using TestWeb.Common.Configuration;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Models
{
    public class AzureConfigBuilder
    {
        private readonly AzureAdConfiguration _config;

        public AzureConfigBuilder()
        {
            _config = new AzureAdConfiguration()
            {
                ApplicationInsights = new ApplicationInsightsConfiguration()
                    { InstrumentationKey = ConfigData.APPLICATION_INSIGHTS },
                Authority = ConfigData.AUTHORITY,
                ClientId = ConfigData.CLIENT_ID,
                ClientSecret = ConfigData.CLIENT_SECRET,
                PostLogoutRedirectUri = ConfigData.POST_LOGOUT_URL,
                RedirectUri = ConfigData.REDIRECT_URL,
                TenantId = ConfigData.TENANT_ID
            };
        }

        public AzureAdConfiguration Build()
        {
            return _config;
        }
    }
}
