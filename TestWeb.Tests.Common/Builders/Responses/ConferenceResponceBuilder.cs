using System.Collections.Generic;
using System.Linq;
using TestWeb.Contracts.Responses;
using TestWeb.TestApi.Client;
using ParticipantResponse = TestWeb.Contracts.Responses.ParticipantResponse;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class ConferenceResponseBuilder
    {
        private readonly List<ConferenceForAdminResponse> _conferencesForAdminResponses;
        private readonly ConferenceDetailsResponse _conferenceDetailsResponse;

        public ConferenceResponseBuilder(List<ConferenceForAdminResponse> conferencesForAdminResponses)
        {
            _conferencesForAdminResponses = conferencesForAdminResponses;
        }

        public ConferenceResponseBuilder(ConferenceDetailsResponse conferenceDetailsResponse)
        {
            _conferenceDetailsResponse = conferenceDetailsResponse;
        }

        public List<ConferenceResponse> BuildFromAdminResponse()
        {
            var conferencesResponse = new List<ConferenceResponse>()
            {
                new ConferenceResponse()
                {
                    Case_name = _conferencesForAdminResponses.First().Case_name,
                    HearingRefId =_conferencesForAdminResponses.First().Hearing_ref_id,
                    Id = _conferencesForAdminResponses.First().Id,
                    Status = _conferencesForAdminResponses.First().Status
                }
            };

            var participants = _conferencesForAdminResponses.First()
                .Participants.Select(participantSummaryResponse => new ParticipantResponse()
                {
                    Display_name = participantSummaryResponse.Display_name,
                    Hearing_role = participantSummaryResponse.Hearing_role,
                    Id = participantSummaryResponse.Id,
                    Status = participantSummaryResponse.Status,
                    Username = participantSummaryResponse.Username,
                    User_role = participantSummaryResponse.User_role
                })
                .ToList();

            conferencesResponse.First().Participants = participants;

            return conferencesResponse;
        }

        public ConferenceResponse Build()
        {
            var participants = _conferenceDetailsResponse.Participants.Select(participant => new ParticipantResponse()
                {
                    Display_name = participant.Display_name,
                    Hearing_role = participant.Hearing_role,
                    Id = participant.Id,
                    Status = participant.Current_status,
                    User_role = participant.User_role,
                    Username = participant.Username
                })
                .ToList();

            return new ConferenceResponse()
            {
                Case_name = _conferenceDetailsResponse.Case_name,
                HearingRefId = _conferenceDetailsResponse.Hearing_id,
                Id = _conferenceDetailsResponse.Id,
                Participants = participants,
                Status = _conferenceDetailsResponse.Current_status
            };
        }
    }
}
