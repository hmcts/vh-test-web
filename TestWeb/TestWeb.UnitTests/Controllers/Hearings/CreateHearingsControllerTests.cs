﻿using System.Net;
using System.Threading.Tasks;
using BookingsApi.Contract.Responses;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestApi.Client;
using TestApi.Contract.Requests;
using TestWeb.Controllers;
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Controllers.Hearings
{
    public class CreateHearingsControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<HearingsController>> _loggerMock;
        private readonly CreateHearingRequest _request;

        public CreateHearingsControllerTests()
        {
            _loggerMock = new Mock<ILogger<HearingsController>>();
            _request = new CreateHearingRequestBuilder().Build();
        }

        [Test]
        public async Task Should_create_hearing()
        {

            var client = new Mock<ITestApiClient>();
            var response = new HearingsResponseBuilder(_request).Build();

            client.Setup(x => x.CreateHearingAsync(It.IsAny<CreateHearingRequest>()))
                .ReturnsAsync(response);

            var controller = new HearingsController(client.Object, _loggerMock.Object);

            var result = await controller.CreateHearing(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.Created);

            var hearingDetails = (HearingDetailsResponse)typedResult.Value;
            hearingDetails.Should().NotBeNull();
            hearingDetails.Should().BeEquivalentTo(response);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var testApiClientMock = new Mock<ITestApiClient>();
            testApiClientMock
                .Setup(x => x.CreateHearingAsync(It.IsAny<CreateHearingRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new HearingsController(testApiClientMock.Object, _loggerMock.Object);
            var result = await controller.CreateHearing(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }
    }
}
