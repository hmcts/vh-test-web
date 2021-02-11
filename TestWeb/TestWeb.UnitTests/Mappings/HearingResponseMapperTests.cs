using FluentAssertions;
using NUnit.Framework;
using TestWeb.Mappings;
using TestWeb.Tests.Common.Builders.Requests;
using TestWeb.Tests.Common.Builders.Responses;

namespace TestWeb.UnitTests.Mappings
{
    public class HearingResponseMapperTests
    {
        [Test]
        public void Should_map_all_properties()
        {
            var hearing = new CreateHearingRequestBuilder().Build();
            var hearingResponse = new HearingsResponseBuilder(hearing).Build();
            var bookingsResponse = new BookingsHearingResponseBuilder(hearingResponse).Build();

            var response = HearingResponseMapper.Map(bookingsResponse);
            response.Should().BeEquivalentTo(bookingsResponse, options => options.ExcludingMissingMembers());
        }
    }
}
