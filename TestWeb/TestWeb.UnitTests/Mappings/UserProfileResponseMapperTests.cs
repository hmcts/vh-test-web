using System.Security.Claims;
using FluentAssertions;
using NUnit.Framework;
using TestWeb.Mappings;
using TestWeb.Tests.Common.Builders.Models;
using TestWeb.Tests.Common.Data;

namespace TestWeb.UnitTests.Mappings
{
    public class UserProfileResponseMapperTests
    {
        [Test]
        public void Should_map_all_properties()
        {
            const string ROLE = "VHQA";
            var USERNAME = ClaimsPrincipalBuilder.USERNAME;
            
            var user = new ClaimsPrincipalBuilder()
                .WithClaim(ClaimTypes.GivenName, UserData.FIRST_NAME)
                .WithClaim(ClaimTypes.Surname, UserData.LAST_NAME)
                .WithClaim("name", UserData.DISPLAY_NAME)
                .WithUsername(USERNAME)
                .WithRole(ROLE).Build();

            var response = UserProfileResponseMapper.MapUserToResponseModel(user);
            response.Username.Should().Be(USERNAME);
            response.Role.Should().Be(ROLE);
        }
    }
}
