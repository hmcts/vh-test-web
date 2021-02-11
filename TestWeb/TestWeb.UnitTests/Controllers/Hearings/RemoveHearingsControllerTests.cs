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
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Controllers.Hearings
{
    public class RemoveHearingsControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<HearingsController>> _loggerMock;
        private readonly DeleteTestHearingDataRequest _request;

        public RemoveHearingsControllerTests()
        {
            _loggerMock = new Mock<ILogger<HearingsController>>();
            _request = new DeleteHearingBuilder().Build();
        }

        [Test]
        public async Task Should_remove_hearing()
        {
            var client = new Mock<ITestApiClient>();
            const int COUNT = 1;

            var deletedResponse = new DeletedResponse()
            {
                Number_of_deleted_hearings = COUNT
            };

            client.Setup(x => x.RemoveTestDataAsync(It.IsAny<DeleteTestHearingDataRequest>()))
                .ReturnsAsync(deletedResponse);

            var controller = new HearingsController(client.Object, _loggerMock.Object);

            var result = await controller.DeleteTestDataByPartialCaseTextAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var response = (DeletedResponse)typedResult.Value;
            response.Should().NotBeNull();
            response.Number_of_deleted_hearings.Should().Be(COUNT);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var client = new Mock<ITestApiClient>();
            client.Setup(x => x.RemoveTestDataAsync(It.IsAny<DeleteTestHearingDataRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new HearingsController(client.Object, _loggerMock.Object);
            var result = await controller.DeleteTestDataByPartialCaseTextAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
