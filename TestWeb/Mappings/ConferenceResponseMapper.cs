using System.Collections.Generic;
using System.Linq;
using TestWeb.Contracts.Responses;
using TestWeb.TestApi.Client;

namespace TestWeb.Mappings
{
    public static class ConferenceResponseMapper
    {
        public static List<ConferenceResponse> Map(List<ConferenceForAdminResponse> responses)
        {
            return responses.Select(response => new ConferenceResponse()
                {
                    Id = response.Id,
                    HearingRefId = response.Hearing_ref_id,
                    Case_name = response.Case_name,
                    Participants = ParticipantsResponseMapper.Map(response.Participants),
                    Status = response.Status
                })
                .ToList();
        }

    }
}
