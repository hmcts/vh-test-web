using FluentAssertions;
using NUnit.Framework;
using TestWeb.Mappings;
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;

namespace TestWeb.UnitTests.Mappings
{
    public class ConferenceResponseMapperTests
    {
        [Test]
        public void Should_map_all_properties()
        {
            var hearing = new CreateHearingBuilder().Build();
            var hearingResponse = new HearingsResponseBuilder(hearing).Build();
            var conferenceDetailsResponse = new ConferenceDetailsResponseBuilder(hearingResponse).Build();
            var conferenceResponse = new ConferenceResponseBuilder(conferenceDetailsResponse).Build();

            var response = ConferenceResponseMapper.Map(conferenceDetailsResponse);
            response.Should().BeEquivalentTo(conferenceResponse, options => options.ExcludingMissingMembers());
        }
    }
}
