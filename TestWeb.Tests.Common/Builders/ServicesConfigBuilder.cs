using TestWeb.Common.Configuration;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders
{
    public class ServicesConfigBuilder
    {
        private readonly HearingServicesConfiguration _config;

        public ServicesConfigBuilder()
        {
            _config = new HearingServicesConfiguration()
            {
                TestApiUrl = ConfigData.TEST_API_URL,
                TestApiResourceUrl = ConfigData.TEST_API_RESOURCE_URL
            };
        }

        public HearingServicesConfiguration Build()
        {
            return _config;
        }
    }
}
