using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestApi.Client;
using TestApi.Contract.Requests;
using TestWeb.Controllers;
using TestWeb.Tests.Common.Data;
using UserApi.Contract.Responses;

namespace TestWeb.UnitTests.Controllers.User
{
    public class ResetPasswordUserControllerTests : ControllersTestBase
    {
        private readonly Mock<ILogger<UserController>> _loggerMock;
        private readonly ResetUserPasswordRequest _request;

        public ResetPasswordUserControllerTests()
        {
            _loggerMock = new Mock<ILogger<UserController>>();
            _request = new ResetUserPasswordRequest();
        }

        [Test]
        public async Task Should_reset_password()
        {
            var client = new Mock<ITestApiClient>();
            var response = new UpdateUserResponse
            {
                NewPassword = UserData.NEW_PASSWORD
            };

            client
                .Setup(x => x.GetUserExistsInAdAsync(It.IsAny<string>()))
                .ReturnsAsync(true);

            client
                .Setup(x => x.ResetUserPasswordAsync(It.IsAny<ResetUserPasswordRequest>()))
                .ReturnsAsync(response);

            var controller = new UserController(client.Object, _loggerMock.Object);

            var result = await controller.ResetPasswordAsync(_request);
            var typedResult = (ObjectResult) result;
            typedResult.StatusCode.Should().Be((int) HttpStatusCode.OK);

            var updateUserResponse = (UpdateUserResponse) typedResult.Value;
            updateUserResponse.Should().NotBeNull();
            updateUserResponse.Should().BeEquivalentTo(response);
        }

        [Test]
        public async Task Should_throw_internal_server()
        {
            var testApiClientMock = new Mock<ITestApiClient>();

            testApiClientMock
                .Setup(x => x.GetUserExistsInAdAsync(It.IsAny<string>()))
                .ReturnsAsync(true);

            testApiClientMock
                .Setup(x => x.ResetUserPasswordAsync(It.IsAny<ResetUserPasswordRequest>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new UserController(testApiClientMock.Object, _loggerMock.Object);
            var result = await controller.ResetPasswordAsync(_request);
            var typedResult = (ObjectResult) result;
            typedResult.StatusCode.Should().Be((int) HttpStatusCode.InternalServerError);
        }

        [Test]
        public async Task Should_throw_exception_whilst_searching_for_user()
        {
            var testApiClientMock = new Mock<ITestApiClient>();

            testApiClientMock
                .Setup(x => x.GetUserExistsInAdAsync(It.IsAny<string>()))
                .ThrowsAsync(ExceptionsData.INTERNAL_SERVER_EXCEPTION);

            var controller = new UserController(testApiClientMock.Object, _loggerMock.Object);
            var result = await controller.ResetPasswordAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.InternalServerError);
        }

        [Test]
        public async Task Should_throw_not_found_whilst_searching_for_user()
        {
            var testApiClientMock = new Mock<ITestApiClient>();

            testApiClientMock
                .Setup(x => x.GetUserExistsInAdAsync(It.IsAny<string>()))
                .ThrowsAsync(ExceptionsData.NOT_FOUND_EXCEPTION);

            var controller = new UserController(testApiClientMock.Object, _loggerMock.Object);
            var result = await controller.ResetPasswordAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        }
    }
}
