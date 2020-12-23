using System.Collections.Generic;
using System.Linq;
using TestWeb.TestApi.Client;
using ParticipantResponse = TestWeb.Contracts.Responses.ParticipantResponse;

namespace TestWeb.Mappings
{
    public static class ParticipantsResponseMapper
    {
        public static List<ParticipantResponse> Map(List<ParticipantSummaryResponse> participants)
        {
            return participants.Select(participant => new ParticipantResponse()
                {
                    Display_name = participant.Display_name,
                    Hearing_role = participant.Hearing_role,
                    Id = participant.Id,
                    Status = participant.Status,
                    User_role = participant.User_role,
                    Username = participant.Username
                })
                .ToList();
        }
    }
}
