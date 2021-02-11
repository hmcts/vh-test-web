using System.Collections.Generic;
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
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Controllers.Hearings
{
    public class GetAllHearingsControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<HearingsController>> _loggerMock;
        private readonly CreateHearingRequest _request;

        public GetAllHearingsControllerTests()
        {
            _loggerMock = new Mock<ILogger<HearingsController>>();
            _request = new CreateHearingRequestBuilder().Build();
        }

        [Test]
        public async Task Should_get_all_hearings()
        {
            const string CREATED_BY = HearingsData.CREATED_BY;

            var client = new Mock<ITestApiClient>();
            var createHearingsResponse = new HearingsResponseBuilder(_request).Build();
            var bookingsHearingResponse = new BookingsHearingResponseBuilder(createHearingsResponse).Build();
            var bookingsHearingsResponses = new List<BookingsHearingResponse>(){bookingsHearingResponse};
            var hearingsResponse = new List<HearingResponse>()
            {
                new HearingResponse()
                {
                    Case_name = bookingsHearingResponse.Hearing_name,
                    Id = bookingsHearingResponse.Hearing_id,
                    ScheduledDate = bookingsHearingResponse.Scheduled_date_time
                }
            };

            client.Setup(x => x.HearingsAllAsync())
                .ReturnsAsync(bookingsHearingsResponses);

            var controller = new HearingsController(client.Object, _loggerMock.Object);

            var result = await controller.GetAllHearingsByCreatedByAsync(CREATED_BY);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var hearingDetails = (List<HearingResponse>)typedResult.Value;
            hearingDetails.Should().NotBeNull();
            hearingDetails.Should().BeEquivalentTo(hearingsResponse);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            const string CREATED_BY = HearingsData.CREATED_BY;

            var testApiClientMock = new Mock<ITestApiClient>();
            testApiClientMock
                .Setup(x => x.HearingsAllAsync())
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new HearingsController(testApiClientMock.Object, _loggerMock.Object);
            var result = await controller.GetAllHearingsByCreatedByAsync(CREATED_BY);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
