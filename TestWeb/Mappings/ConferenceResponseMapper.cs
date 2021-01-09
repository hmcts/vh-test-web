using TestWeb.Contracts.Responses;
using TestWeb.TestApi.Client;

namespace TestWeb.Mappings
{
    public static class ConferenceResponseMapper
    {
        public static ConferenceResponse Map(ConferenceDetailsResponse response)
        {
            return new ConferenceResponse()
                {
                    Id = response.Id,
                    HearingRefId = response.Hearing_id,
                    Case_name = response.Case_name,
                    Participants = ParticipantsResponseMapper.Map(response.Participants),
                    Status = response.Current_status
                };
        }
    }
}
