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
                New_password = UserData.NEW_PASSWORD
            };

            client
                .Setup(x => x.AadAsync(It.IsAny<string>()))
                .ReturnsAsync(true);

            client
                .Setup(x => x.PasswordAsync(It.IsAny<ResetUserPasswordRequest>()))
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
                .Setup(x => x.AadAsync(It.IsAny<string>()))
                .ReturnsAsync(true);

            testApiClientMock
                .Setup(x => x.PasswordAsync(It.IsAny<ResetUserPasswordRequest>()))
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
                .Setup(x => x.AadAsync(It.IsAny<string>()))
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
                .Setup(x => x.AadAsync(It.IsAny<string>()))
                .ThrowsAsync(ExceptionsData.NOT_FOUND_EXCEPTION);

            var controller = new UserController(testApiClientMock.Object, _loggerMock.Object);
            var result = await controller.ResetPasswordAsync(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        }
    }
}
