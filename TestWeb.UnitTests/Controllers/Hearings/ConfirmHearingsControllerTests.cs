using System;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestWeb.Controllers;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Builders;
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Controllers.Hearings
{
    public class ConfirmHearingsControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<HearingsController>> _loggerMock;

        public ConfirmHearingsControllerTests()
        {
            _loggerMock = new Mock<ILogger<HearingsController>>();
        }

        [Test]
        public async Task Should_confirm_hearing()
        {
            var hearingId = Guid.NewGuid();
            var hearing = new CreateHearingBuilder().Build();
            var hearingResponse = new HearingsResponseBuilder(hearing).Build();
            var request = new ConfirmHearingBuilder().Build();
            var conferenceResponse = new ConferenceResponseBuilder(hearingResponse).Build();

            var client = new Mock<ITestApiClient>();
            client.Setup(x => x.ConfirmHearingByIdAsync(It.IsAny<Guid>(), It.IsAny<UpdateBookingStatusRequest>()))
                .ReturnsAsync(conferenceResponse);

            var controller = new HearingsController(client.Object, _loggerMock.Object);

            var result = await controller.ConfirmHearingByIdAsync(hearingId, request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.Created);

            var hearingDetails = (ConferenceDetailsResponse)typedResult.Value;
            hearingDetails.Should().NotBeNull();
            hearingDetails.Should().BeEquivalentTo(conferenceResponse);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var hearingId = Guid.NewGuid();
            var request = new ConfirmHearingBuilder().Build();

            var client = new Mock<ITestApiClient>();
            client.Setup(x => x.ConfirmHearingByIdAsync(It.IsAny<Guid>(), It.IsAny<UpdateBookingStatusRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new HearingsController(client.Object, _loggerMock.Object);
            var result = await controller.ConfirmHearingByIdAsync(hearingId, request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
