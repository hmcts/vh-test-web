using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using TestWeb.Common.Configuration;

namespace TestWeb.Common.Security
{
    public class TestApiTokenHandler : BaseServiceTokenHandler
    {
        public TestApiTokenHandler(IOptions<AzureAdConfiguration> azureAdConfiguration,
            IOptions<HearingServicesConfiguration> hearingServicesConfiguration, IMemoryCache memoryCache,
            ITokenProvider tokenProvider) : base(azureAdConfiguration, hearingServicesConfiguration, memoryCache,
            tokenProvider)
        {
        }
        
        protected override string TokenCacheKey => "TestApiServiceToken";
        protected override string ClientResource => HearingServicesConfiguration.TestApiResourceId;
    }
}