using Moq;
using TestApi.Client;

namespace TestWeb.UnitTests.Controllers
{
    public class ControllersTestBase
    {
        protected Mock<ITestApiClient> _testApiClientMock;

        public ControllersTestBase()
        {
            _testApiClientMock = new Mock<ITestApiClient>();
        }
    }
}
