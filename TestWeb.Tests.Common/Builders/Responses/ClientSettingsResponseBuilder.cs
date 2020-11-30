using TestWeb.Contracts.Responses;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class ClientSettingsResponseBuilder
    {
        private readonly ClientSettingsResponse _response;

        public ClientSettingsResponseBuilder()
        {
            _response = new ClientSettingsResponse()
            {
                AppInsightsInstrumentationKey = ConfigData.APPLICATION_INSIGHTS,
                ClientId = ConfigData.CLIENT_ID,
                PostLogoutRedirectUri = ConfigData.POST_LOGOUT_URL,
                RedirectUri = ConfigData.REDIRECT_URL,
                TenantId = ConfigData.TENANT_ID,
                TestApiUrl = ConfigData.TEST_API_URL
            };
        }

        public ClientSettingsResponse Build()
        {
            return _response;
        }
    }
}
