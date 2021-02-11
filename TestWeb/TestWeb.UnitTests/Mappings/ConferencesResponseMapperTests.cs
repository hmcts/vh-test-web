using FluentAssertions;
using NUnit.Framework;
using TestWeb.Mappings;
using TestWeb.Tests.Common.Builders.Responses;

namespace TestWeb.UnitTests.Mappings
{
    public class ConferencesResponseMapperTests
    {
        [Test]
        public void Should_map_all_properties()
        {
            var conferencesForAdminResponse = new ConferencesForAdminResponseBuilder().Build();
            var conferencesResponse = new ConferenceResponseBuilder(conferencesForAdminResponse).BuildFromAdminResponse();

            var response = ConferencesResponseMapper.Map(conferencesForAdminResponse);
            response.Should().BeEquivalentTo(conferencesResponse, options => options.ExcludingMissingMembers());
        }
    }
}
