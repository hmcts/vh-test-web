using TestWeb.Contracts.Responses;
using VideoApi.Contract.Responses;

namespace TestWeb.Mappings
{
    public static class ConferenceResponseMapper
    {
        public static ConferenceResponse Map(ConferenceDetailsResponse response)
        {
            return new ConferenceResponse()
                {
                    Id = response.Id,
                    HearingRefId = response.HearingId,
                    Case_name = response.CaseName,
                    Participants = ParticipantsResponseMapper.Map(response.Participants),
                    Status = response.CurrentStatus
                };
        }
    }
}
