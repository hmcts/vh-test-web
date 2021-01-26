using System;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using TestWeb.Common.Configuration;

namespace TestWeb.Common.Security
{
    public interface ITokenProvider
    {
        AuthenticationResult GetAuthorisationResult(string clientId, string clientSecret, string clientResource);
    }

    public class TokenProvider : ITokenProvider
    {
        private readonly AzureAdConfiguration _azureAdConfiguration;

        public TokenProvider(IOptions<AzureAdConfiguration> azureAdConfiguration)
        {
            _azureAdConfiguration = azureAdConfiguration.Value;
        }

        public string GetClientAccessToken(string clientId, string clientSecret, string clientResource)
        {
            var result = GetAuthorisationResult(clientId, clientSecret, clientResource);
            return result.AccessToken;
        }

        public AuthenticationResult GetAuthorisationResult(string clientId, string clientSecret, string clientResource)
        {
            AuthenticationResult result;
            var credential = new ClientCredential(clientId, clientSecret);
            var authContext =
                new AuthenticationContext($"{_azureAdConfiguration.Authority}{_azureAdConfiguration.TenantId}");

            try
            {
                result = authContext.AcquireTokenAsync(clientResource, credential).Result;
            }
            catch (AdalException)
            {
                throw new UnauthorizedAccessException();
            }

            return result;
        }
    }
}