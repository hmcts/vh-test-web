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
    public class GetAllocatedUsersControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<AllocationController>> _loggerMock;
        private readonly AllocateUserRequest _request;

        public GetAllocatedUsersControllerTests()
        {
            _loggerMock = new Mock<ILogger<AllocationController>>();
            _request = new AllocateUserBuilder().Judge().AllocatedBy(AllocationData.ALLOCATED_BY).Build();
        }

        [Test]
        public async Task Should_retrieve_all_allocated_users_by_allocated_by()
        {
            var response = new List<AllocationDetailsResponse>()
            {
                new AllocationDetailsResponseBuilder().AllocatedBy(AllocationData.ALLOCATED_BY).Build()
            };

            var client = new Mock<ITestApiClient>();
            client
                .Setup(x => x.GetAllocateUsersByAllocatedByAsync(It.IsAny<string>()))
                .ReturnsAsync(response);

            var controller = new AllocationController(client.Object, _loggerMock.Object);

            var result = await controller.GetAllocatedUsersAsync(AllocationData.ALLOCATED_BY);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var allocationDetails = (List<AllocationDetailsResponse>)typedResult.Value;
            allocationDetails.Should().NotBeNull();
            allocationDetails.Should().BeEquivalentTo(response);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var client = new Mock<ITestApiClient>();
            client
                .Setup(x => x.GetAllocateUsersByAllocatedByAsync(It.IsAny<string>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new AllocationController(client.Object, _loggerMock.Object);
            var result = await controller.GetAllocatedUsersAsync(string.Empty);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
