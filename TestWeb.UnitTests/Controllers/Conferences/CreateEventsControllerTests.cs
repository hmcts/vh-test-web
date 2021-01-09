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
using TestWeb.Tests.Common.Data;

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
    }
}
