using System.Collections.Generic;
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
    public class UnallocateUsersControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<AllocationController>> _loggerMock;
        private readonly UnallocateUsersRequest _request;

        public UnallocateUsersControllerTests()
        {
            _loggerMock = new Mock<ILogger<AllocationController>>();
            _request = new UnallocateUsersBuilder().Build();
        }

        [Test]
        public async Task Should_allocate_multiple_users()
        {
            var response = new List<AllocationDetailsResponse>()
            {
                new AllocationDetailsResponseBuilder().Build()
            };

            var client = new Mock<ITestApiClient>();
            client
                .Setup(x => x.UnallocateUsersAsync(It.IsAny<UnallocateUsersRequest>()))
                .ReturnsAsync(response);

            var controller = new AllocationController(client.Object, _loggerMock.Object);

            var result = await controller.UnallocateUsersByUsernameAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var userDetails = (List<AllocationDetailsResponse>)typedResult.Value;
            userDetails.Should().NotBeNull();
            userDetails.Should().BeEquivalentTo(response);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var client = new Mock<ITestApiClient>();
            client
                .Setup(x => x.UnallocateUsersAsync(It.IsAny<UnallocateUsersRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new AllocationController(client.Object, _loggerMock.Object);
            var result = await controller.UnallocateUsersByUsernameAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
