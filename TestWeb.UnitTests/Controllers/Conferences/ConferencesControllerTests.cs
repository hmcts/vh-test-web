using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestWeb.Contracts.Responses;
using TestWeb.Controllers;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Builders.Responses;
using TestWeb.Tests.Common.Data;
using ParticipantResponse = TestWeb.Contracts.Responses.ParticipantResponse;

namespace TestWeb.UnitTests.Controllers.Conferences
{
    public class ConferenceControllerTests : ControllersTestBase
    {
        private readonly ConferencesController _controller;
        private readonly Mock<ILogger<ConferencesController>> _loggerMock;
        private readonly ConferenceEventRequest _request;

        public ConferenceControllerTests()
        {
            _loggerMock = new Mock<ILogger<ConferencesController>>();
            _controller = new ConferencesController(_testApiClientMock.Object, _loggerMock.Object);
            _request = new ConferenceEventRequest()
            {
                Conference_id = Guid.NewGuid().ToString(),
                Event_id = Guid.NewGuid().ToString(),
                Event_type = EventsData.EVENT_TYPE,
                Participant_id = Guid.NewGuid().ToString(),
                Phone = EventsData.PHONE,
                Reason = EventsData.REASON,
                Time_stamp_utc = DateTime.UtcNow,
                Transfer_from = EventsData.TRANSFER_FROM,
                Transfer_to = EventsData.TRANSFER_TO
            };
        }

        [Test]
        public async Task Should_create_video_event()
        {
            var result = await _controller.CreateVideoEventAsync(_request);
            var typedResult = (NoContentResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.NoContent);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var testApiClientMock = new Mock<ITestApiClient>();
            testApiClientMock
                .Setup(x => x.CreateVideoEventAsync(It.IsAny<ConferenceEventRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new ConferencesController(testApiClientMock.Object, _loggerMock.Object);
            var result = await controller.CreateVideoEventAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }

        [Test]
        public async Task Should_get_conferences_for_today()
        {
            var conferencesForAdminResponse = new ConferencesForAdminResponseBuilder().Build();
            var conferencesResponse = new ConferenceResponseBuilder(conferencesForAdminResponse).Build();

            var testApiClientMock = new Mock<ITestApiClient>();
            testApiClientMock
                .Setup(x => x.GetConferencesForTodayVhoAsync())
                .ReturnsAsync(conferencesForAdminResponse);

            var controller = new ConferencesController(testApiClientMock.Object, _loggerMock.Object);

            var response = await controller.GetConferencesForTodayAsync();
            response.Should().NotBeNull();

            var result = (OkObjectResult)response;
            result.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var conferenceDetails = (List<ConferenceResponse>)result.Value;
            conferenceDetails.Should().NotBeNull();
            conferenceDetails.Should().BeEquivalentTo(conferencesResponse);
        }
    }
}
