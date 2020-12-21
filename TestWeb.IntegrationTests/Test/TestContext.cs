using TestWeb.Tests.Common.Configuration;
using Microsoft.AspNetCore.TestHost;

namespace TestWeb.IntegrationTests.Test
{
    public class TestContext
    {
        public Config Config { get; set; }
        public TestServer Server { get; set; }
        public string Token { get; set; }
    }
}
