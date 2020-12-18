using AcceptanceTests.Common.Api.Hearings;
using AcceptanceTests.Common.Data.Time;
using AcceptanceTests.Common.Driver.Drivers;
using TestWeb.AcceptanceTests.Data;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Configuration;

namespace TestWeb.AcceptanceTests.Helpers
{
    public class TestContext
    {
        public Config Config { get; set; }
        public DriverSetup Driver { get; set; }
        public string TestApiToken { get; set; }
        public TimeZone TimeZone { get; set; }
        public UserDetailsResponse CurrentUser { get; set; }
        public Test Test { get; set; }
        public TestApiManager TestApi { get; set; }
    }
}
