using BookingsApi.Contract.Responses;
using TestWeb.Contracts.Responses;

namespace TestWeb.Mappings
{
    public static class HearingResponseMapper
    {
        public static HearingResponse Map(BookingsHearingResponse response)
        {
            return new HearingResponse()
            {
                Id = response.HearingId,
                Case_name = response.HearingName,
                ScheduledDate = response.ScheduledDateTime
            };
        }
    }
}
