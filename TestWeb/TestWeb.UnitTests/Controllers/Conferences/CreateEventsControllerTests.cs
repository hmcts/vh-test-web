using System;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestApi.Client;
using TestWeb.Controllers;
using TestWeb.Tests.Common.Data;
using VideoApi.Contract.Requests;

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
                ConferenceId = Guid.NewGuid().ToString(),
                EventId = Guid.NewGuid().ToString(),
                EventType = EventsData.EVENT_TYPE,
                ParticipantId = Guid.NewGuid().ToString(),
                Phone = EventsData.PHONE,
                Reason = EventsData.REASON,
                TimeStampUtc = DateTime.UtcNow,
                TransferFrom = EventsData.TRANSFER_FROM,
                TransferTo = EventsData.TRANSFER_TO
            };
        }

        [Test]
        public async Task Should_create_video_event()
        {
            var result = await _controller.CreateVideoEvent(_request);
            var typedResult = (NoContentResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.NoContent);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var testApiClientMock = new Mock<ITestApiClient>();
            testApiClientMock
                .Setup(x => x.CreateEventAsync(It.IsAny<ConferenceEventRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new ConferencesController(testApiClientMock.Object, _loggerMock.Object);
            var result = await controller.CreateVideoEvent(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
