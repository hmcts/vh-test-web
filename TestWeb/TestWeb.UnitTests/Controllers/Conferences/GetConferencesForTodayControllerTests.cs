using System.Collections.Generic;
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
using TestWeb.Tests.Common.Builders.Responses;

namespace TestWeb.UnitTests.Controllers.Conferences
{
    public class GetConferencesForTodayControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<ConferencesController>> _loggerMock;

        public GetConferencesForTodayControllerTests()
        {
            _loggerMock = new Mock<ILogger<ConferencesController>>();
        }

        [Test]
        public async Task Should_get_conferences_for_today()
        {
            var conferencesForAdminResponse = new ConferencesForAdminResponseBuilder().Build();
            var conferencesResponse = new ConferenceResponseBuilder(conferencesForAdminResponse).BuildFromAdminResponse();

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
