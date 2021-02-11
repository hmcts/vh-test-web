using TestWeb.Contracts.Responses;
using TestWeb.TestApi.Client;

namespace TestWeb.Mappings
{
    public static class HearingResponseMapper
    {
        public static HearingResponse Map(BookingsHearingResponse response)
        {
            return new HearingResponse()
            {
                Id = response.Hearing_id,
                Case_name = response.Hearing_name,
                ScheduledDate = response.Scheduled_date_time
            };
        }
    }
}
