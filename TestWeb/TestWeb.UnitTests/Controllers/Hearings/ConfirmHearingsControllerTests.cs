using System;
using System.Net;
using System.Threading.Tasks;
using BookingsApi.Contract.Requests;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestApi.Client;
using TestWeb.Controllers;
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;
using TestWeb.Tests.Common.Data;
using VideoApi.Contract.Responses;

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
            var hearing = new CreateHearingRequestBuilder().Build();
            var hearingResponse = new HearingsResponseBuilder(hearing).Build();
            var request = new ConfirmHearingBuilder().Build();
            var conferenceResponse = new ConferenceDetailsResponseBuilder(hearingResponse).Build();

            var client = new Mock<ITestApiClient>();
            client.Setup(x => x.ConfirmHearingByIdAsync(It.IsAny<Guid>(), It.IsAny<UpdateBookingStatusRequest>()))
                .ReturnsAsync(conferenceResponse);

            var controller = new HearingsController(client.Object, _loggerMock.Object);

            var result = await controller.ConfirmHearingById(hearingId, request);
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
            var result = await controller.ConfirmHearingById(hearingId, request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
