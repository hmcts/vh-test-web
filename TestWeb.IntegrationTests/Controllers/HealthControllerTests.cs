using System.Net;
using System.Threading.Tasks;
using AcceptanceTests.Common.Api.Helpers;
using FluentAssertions;
using NUnit.Framework;
using TestWeb.Models;
using TestWeb.Tests.Common.Configuration;

namespace TestWeb.IntegrationTests.Controllers
{
    public class HealthControllerTests : ControllerTestsBase
    {
        [Test]
        [Category("Health")]
        public async Task Should_return_health_OK()
        {
            var uri = ApiUriFactory.HealthCheckEndpoints.CheckServiceHealth;
            await SendGetRequest(uri);
            VerifyResponse(HttpStatusCode.OK, true);
            var response = RequestHelper.Deserialise<HealthCheckResponse>(Json);

            response.TestApiHealth.Successful.Should().BeTrue();
            response.TestApiHealth.Data.Should().BeNull();
            response.TestApiHealth.ErrorMessage.Should().BeNullOrWhiteSpace();

            response.AppVersion.Should().NotBeNull();
            response.AppVersion.FileVersion.Should().NotBeNull();
            response.AppVersion.InformationVersion.Should().NotBeNull();
        }
    }
}
