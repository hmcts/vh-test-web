using System.Collections.Generic;
using System.Linq;
using TestWeb.Contracts.Responses;
using VideoApi.Contract.Responses;

namespace TestWeb.Mappings
{
    public static class ConferencesResponseMapper
    {
        public static List<ConferenceResponse> Map(ICollection<ConferenceForAdminResponse> responses)
        {
            return responses.Select(response => new ConferenceResponse()
                {
                    Id = response.Id,
                    HearingRefId = response.HearingRefId,
                    Case_name = response.CaseName,
                    Participants = ParticipantsResponseMapper.Map(response.Participants),
                    Status = response.Status
                })
                .ToList();
        }

    }
}
