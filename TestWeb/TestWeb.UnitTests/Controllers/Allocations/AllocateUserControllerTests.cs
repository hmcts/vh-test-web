using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestApi.Client;
using TestApi.Contract.Requests;
using TestApi.Contract.Responses;
using TestWeb.Controllers;
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Controllers.Allocations
{
    public class AllocateUserControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<AllocationController>> _loggerMock;
        private readonly AllocateUserRequest _request;

        public AllocateUserControllerTests()
        {
            _loggerMock = new Mock<ILogger<AllocationController>>();
            _request = new AllocateUserBuilder().Judge().Build();
        }

        [Test]
        public async Task Should_allocate_single_user()
        {
            var response = new UserDetailsResponseBuilder().Judge().Build();

            var client = new Mock<ITestApiClient>();
            client
                .Setup(x => x.AllocateSingleUserAsync(It.IsAny<AllocateUserRequest>()))
                .ReturnsAsync(response);

            var controller = new AllocationController(client.Object, _loggerMock.Object);

            var result = await controller.AllocateSingleUserAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var userDetails = (UserDetailsResponse)typedResult.Value;
            userDetails.Should().NotBeNull();
            userDetails.Should().BeEquivalentTo(response);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var client = new Mock<ITestApiClient>();
            client
                .Setup(x => x.AllocateSingleUserAsync(It.IsAny<AllocateUserRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new AllocationController(client.Object, _loggerMock.Object);
            var result = await controller.AllocateSingleUserAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
