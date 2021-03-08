using System;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestApi.Client;
using TestWeb.Contracts.Responses;
using TestWeb.Controllers;
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;

namespace TestWeb.UnitTests.Controllers.Conferences
{
    public class GetConferenceByHearingIdControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<ConferencesController>> _loggerMock;

        public GetConferenceByHearingIdControllerTests()
        {
            _loggerMock = new Mock<ILogger<ConferencesController>>();
        }

        [Test]
        public async Task Should_get_conference_by_id()
        {
            var hearing = new CreateHearingRequestBuilder().Build();
            var hearingResponse = new HearingsResponseBuilder(hearing).Build();
            var conferenceDetailsResponse = new ConferenceDetailsResponseBuilder(hearingResponse).Build();
            var conferenceResponse = new ConferenceResponseBuilder(conferenceDetailsResponse).Build();

            var testApiClientMock = new Mock<ITestApiClient>();
            testApiClientMock
                .Setup(x => x.GetConferenceByHearingRefIdAsync(hearingResponse.Id))
                .ReturnsAsync(conferenceDetailsResponse);

            var controller = new ConferencesController(testApiClientMock.Object, _loggerMock.Object);

            var response = await controller.GetConferenceByHearingRefIdAsync(hearingResponse.Id);
            response.Should().NotBeNull();

            var result = (OkObjectResult)response;
            result.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var conferenceDetails = (ConferenceResponse)result.Value;
            conferenceDetails.Should().NotBeNull();
            conferenceDetails.Should().BeEquivalentTo(conferenceResponse);
        }

        [Test]
        public async Task Should_return_not_found_for_non_existent_hearing_id()
        {
            var hearingId = Guid.NewGuid();

            var testApiClientMock = new Mock<ITestApiClient>();
            testApiClientMock
                .Setup(x => x.GetConferenceByHearingRefIdAsync(hearingId))
                .ThrowsAsync(new TestApiException("Message", (int)HttpStatusCode.NotFound, "response", null, null));

            var controller = new ConferencesController(testApiClientMock.Object, _loggerMock.Object);

            var response = await controller.GetConferenceByHearingRefIdAsync(hearingId);
            response.Should().NotBeNull();

            var result = (ObjectResult)response;
            result.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        }
    }
}
