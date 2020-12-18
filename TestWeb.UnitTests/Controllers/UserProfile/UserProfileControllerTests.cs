using System.Linq;
using System.Net;
using System.Security.Claims;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using TestWeb.Common.Security;
using TestWeb.Contracts.Responses;
using TestWeb.Controllers;
using TestWeb.Tests.Common.Builders.Models;
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Controllers.UserProfile
{
    public class UserProfileControllerTests
    {
        private UserProfileController _controller;
        private ClaimsPrincipal _claimsPrincipal;
        private Mock<ILogger<UserProfileController>> _loggerMock;

        [SetUp]
        public void Setup()
        {
            _loggerMock = new Mock<ILogger<UserProfileController>>();
            _claimsPrincipal = new ClaimsPrincipalBuilder()
                .WithRole(AppRoles.QA)
                .WithClaim(ClaimTypes.GivenName, UserData.FIRST_NAME)
                .WithClaim(ClaimTypes.Surname, UserData.LAST_NAME)
                .WithClaim("name", UserData.DISPLAY_NAME)
                .Build();
            _controller = SetupControllerWithClaims();
        }

        [Test]
        public void Should_return_ok_code_when_user_profile_found()
        {
            var result = _controller.GetUserProfile();
            var typedResult = (OkObjectResult)result;
            typedResult.Should().NotBeNull();

            var userProfile = (UserProfileResponse)typedResult.Value;
            var username = _claimsPrincipal.Claims.FirstOrDefault()?.Value;

            userProfile.Username.Should().Be(username);
            userProfile.Role.Should().Be(_claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value);
        }

        [Test]
        public void Should_return_401_when_exception_thrown()
        {
            _claimsPrincipal = new ClaimsPrincipalBuilder()
                .WithClaim(ClaimTypes.GivenName, UserData.FIRST_NAME)
                .WithClaim(ClaimTypes.Surname, UserData.LAST_NAME)
                .Build();
            _controller = SetupControllerWithClaims();

            var result = _controller.GetUserProfile();
            var typedResult = (ObjectResult)result;
            typedResult.StatusCode.Should().Be((int)HttpStatusCode.Unauthorized);
        }

        private UserProfileController SetupControllerWithClaims()
        {
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = _claimsPrincipal
                }
            };

            return new UserProfileController(_loggerMock.Object)
            {
                ControllerContext = context
            };
        }
    }
}
