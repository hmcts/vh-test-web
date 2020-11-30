using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestWeb.Controllers;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Controllers.Allocations
{
    public class AllocateUsersControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<AllocationController>> _loggerMock;
        private readonly AllocateUsersRequest _request;

        public AllocateUsersControllerTests()
        {
            _loggerMock = new Mock<ILogger<AllocationController>>();
            _request = new AllocateUsersBuilder().Judge().Individual().Representative().Build();
        }

        [Test]
        public async Task Should_allocate_multiple_users()
        {
            var response = new List<UserDetailsResponse>
            {
                new UserDetailsResponseBuilder().Judge().Build(),
                new UserDetailsResponseBuilder().Individual().Build(),
                new UserDetailsResponseBuilder().Representative().Build()
            };

            var client = new Mock<ITestApiClient>();
            client
                .Setup(x => x.AllocateUsersAsync(It.IsAny<AllocateUsersRequest>()))
                .ReturnsAsync(response);

            var controller = new AllocationController(client.Object, _loggerMock.Object);

            var result = await controller.AllocateUsersAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var userDetails = (List<UserDetailsResponse>)typedResult.Value;
            userDetails.Should().NotBeNull();
            userDetails.Should().BeEquivalentTo(response);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var client = new Mock<ITestApiClient>();
            client
                .Setup(x => x.AllocateUsersAsync(It.IsAny<AllocateUsersRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new AllocationController(client.Object, _loggerMock.Object);
            var result = await controller.AllocateUsersAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
