using System.Collections.Generic;
using System.Linq;
using VideoApi.Contract.Responses;
using ParticipantResponse = TestWeb.Contracts.Responses.ParticipantResponse;

namespace TestWeb.Mappings
{
    public static class ParticipantsResponseMapper
    {
        public static List<ParticipantResponse> Map(List<ParticipantDetailsResponse> participants)
        {
            return participants.Select(participant => new ParticipantResponse()
                {
                    Display_name = participant.DisplayName,
                    Hearing_role = participant.HearingRole,
                    Id = participant.Id,
                    Status = participant.CurrentStatus,
                    User_role = participant.UserRole,
                    Username = participant.Username
                })
                .ToList();
        }

        public static List<ParticipantResponse> Map(List<ParticipantSummaryResponse> participants)
        {
            return participants.Select(participant => new ParticipantResponse()
                {
                    Display_name = participant.DisplayName,
                    Hearing_role = participant.HearingRole,
                    Id = participant.Id,
                    Status = participant.Status,
                    User_role = participant.UserRole,
                    Username = participant.Username
                })
                .ToList();
        }
    }
}
