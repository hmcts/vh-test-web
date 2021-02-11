using TestWeb.Common.Configuration;
using TestWeb.Contracts.Responses;

namespace TestWeb.Mappings
{
    public static class ClientSettingsResponseMapper
    {
        public static ClientSettingsResponse MapAppConfigurationToResponseModel(AzureAdConfiguration azureAdConfiguration, HearingServicesConfiguration servicesConfiguration)
        {
            return new ClientSettingsResponse
            {
                ClientId = azureAdConfiguration.ClientId,
                TenantId = azureAdConfiguration.TenantId,
                RedirectUri = azureAdConfiguration.RedirectUri,
                PostLogoutRedirectUri = azureAdConfiguration.PostLogoutRedirectUri,
                TestApiUrl = servicesConfiguration.TestApiUrl,
                AppInsightsInstrumentationKey = azureAdConfiguration.ApplicationInsights.InstrumentationKey,
                Authority = azureAdConfiguration.Authority
            };
        }

    }
}
