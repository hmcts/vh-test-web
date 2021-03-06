using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using TestApi.Client;
using TestWeb.Controllers;
using TestWeb.Models;
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Controllers.Health
{
    public class HealthControllerTests : ControllersTestBase
    {
        private readonly HealthController _controller;

        public HealthControllerTests()
        {
            _controller = new HealthController(_testApiClientMock.Object);
        }

        [Test]
        public async Task Should_return_ok_when_all_services_are_running()
        {
            var result = await _controller.HealthAsync();
            var typedResult = (ObjectResult) result;
            typedResult.StatusCode.Should().Be((int) HttpStatusCode.OK);

            var response = (HealthCheckResponse) typedResult.Value;
            response.TestApiHealth.Successful.Should().BeTrue();
            response.AppVersion.Should().NotBeNull();
            response.AppVersion.FileVersion.Should().NotBeNullOrWhiteSpace();
            response.AppVersion.InformationVersion.Should().NotBeNullOrWhiteSpace();
        }

        [Test]
        public async Task Should_return_the_application_version_from_assembly()
        {
            var result = await _controller.HealthAsync();
            var typedResult = (ObjectResult) result;
            var response = (HealthCheckResponse) typedResult.Value;
            response.AppVersion.FileVersion.Should().NotBeNullOrEmpty();
            response.AppVersion.InformationVersion.Should().NotBeNullOrEmpty();
        }

        [Test]
        public async Task Should_return_the_bookings_api_health()
        {
            var result = await _controller.HealthAsync();
            var typedResult = (ObjectResult) result;
            var response = (HealthCheckResponse) typedResult.Value;
            response.TestApiHealth.Successful.Should().BeTrue();
            response.TestApiHealth.ErrorMessage.Should().BeNullOrWhiteSpace();
        }

        [Test]
        public async Task Should_return_internal_server_error_result_when_bookings_api_not_reachable()
        {
            var testApiClientMock = new Mock<ITestApiClient>();

            testApiClientMock
                .Setup(x => x.CheckServiceHealthAsync())
                .ThrowsAsync(ExceptionsData.EXCEPTION);

            var controller = new HealthController(testApiClientMock.Object);

            var result = await controller.HealthAsync();
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
            var response = (HealthCheckResponse)typedResult.Value;
            response.TestApiHealth.Successful.Should().BeFalse();
            response.TestApiHealth.ErrorMessage.Should().NotBeNullOrWhiteSpace();
        }
    }
}
