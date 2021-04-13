using System.IO;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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
        private readonly Mock<IConfiguration> _configuration;

        public ResetPasswordUserControllerTests()
        {
            _loggerMock = new Mock<ILogger<UserController>>();
            _request = new ResetUserPasswordRequest{ Username = UserData.USERNAME };
            _configuration = new Mock<IConfiguration>();
            SetMockConfig();
        }

        private void SetMockConfig()
        {
            _configuration
                .Setup(x => x.GetSection("EjudUsernameStem").Value)
                .Returns(EjudUserData.FAKE_EJUD_DOMAIN);

            _configuration
                .Setup(x => x.GetSection("TestUserPassword").Value)
                .Returns(EjudUserData.FAKE_PASSWORD);
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

            var controller = new UserController(client.Object, _loggerMock.Object, _configuration.Object);

            var result = await controller.ResetPassword(_request);
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

            var controller = new UserController(testApiClientMock.Object, _loggerMock.Object, _configuration.Object);
            var result = await controller.ResetPassword(_request);
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

            var controller = new UserController(testApiClientMock.Object, _loggerMock.Object, _configuration.Object);
            var result = await controller.ResetPassword(_request);
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

            var controller = new UserController(testApiClientMock.Object, _loggerMock.Object, _configuration.Object);
            var result = await controller.ResetPassword(_request);
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        }

        [Test]
        public async Task Should_return_test_password_for_ejud_users()
        {
            var client = new Mock<ITestApiClient>();
            const string username = EjudUserData.FAKE_EJUD_DOMAIN;
            var request = new ResetUserPasswordRequest()
            {
                Username = username
            };

            var controller = new UserController(client.Object, _loggerMock.Object, _configuration.Object);

            var result = await controller.ResetPassword(request);
            var objectResult = (OkObjectResult)result;
            objectResult.StatusCode.Should().Be((int)HttpStatusCode.OK);

            var passwordResponse = (UpdateUserResponse)objectResult.Value;
            passwordResponse.NewPassword.Should().Be(EjudUserData.FAKE_PASSWORD);
        }

        [Test]
        public void Should_throw_error_if_ejud_domain_not_found()
        {
            var client = new Mock<ITestApiClient>();
            const string username = EjudUserData.FAKE_EJUD_DOMAIN;
            var request = new ResetUserPasswordRequest()
            {
                Username = username
            };

            var configuration = new Mock<IConfiguration>();
            configuration
                .Setup(x => x.GetSection("EjudUsernameStem").Value)
                .Returns(() => null);

            var controller = new UserController(client.Object, _loggerMock.Object, configuration.Object);



            Assert.ThrowsAsync<InvalidDataException>(async () => await controller.ResetPassword(request));
        }


        [Test]
        public void Should_throw_error_if_test_user_password_not_found()
        {
            var client = new Mock<ITestApiClient>();
            const string username = EjudUserData.FAKE_EJUD_DOMAIN;
            var request = new ResetUserPasswordRequest()
            {
                Username = username
            };

            var configuration = new Mock<IConfiguration>();

            configuration
                .Setup(x => x.GetSection("EjudUsernameStem").Value)
                .Returns(EjudUserData.FAKE_EJUD_DOMAIN);

            configuration
                .Setup(x => x.GetSection("TestUserPassword").Value)
                .Returns(() => null);

            var controller = new UserController(client.Object, _loggerMock.Object, configuration.Object);

            Assert.ThrowsAsync<InvalidDataException>(async () => await controller.ResetPassword(request));
        }
    }
}
