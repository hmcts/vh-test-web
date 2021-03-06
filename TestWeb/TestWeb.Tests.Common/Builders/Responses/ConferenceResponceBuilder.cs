using System.Collections.Generic;
using System.Linq;
using TestWeb.Contracts.Responses;
using VideoApi.Contract.Responses;
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
                    Case_name = _conferencesForAdminResponses.First().CaseName,
                    HearingRefId =_conferencesForAdminResponses.First().HearingRefId,
                    Id = _conferencesForAdminResponses.First().Id,
                    Status = _conferencesForAdminResponses.First().Status
                }
            };

            var participants = _conferencesForAdminResponses.First()
                .Participants.Select(participantSummaryResponse => new ParticipantResponse()
                {
                    Display_name = participantSummaryResponse.DisplayName,
                    Hearing_role = participantSummaryResponse.HearingRole,
                    Id = participantSummaryResponse.Id,
                    Status = participantSummaryResponse.Status,
                    Username = participantSummaryResponse.Username,
                    User_role = participantSummaryResponse.UserRole
                })
                .ToList();

            conferencesResponse.First().Participants = participants;

            return conferencesResponse;
        }

        public ConferenceResponse Build()
        {
            var participants = _conferenceDetailsResponse.Participants.Select(participant => new ParticipantResponse()
                {
                    Display_name = participant.DisplayName,
                    Hearing_role = participant.HearingRole,
                    Id = participant.Id,
                    Status = participant.CurrentStatus,
                    User_role = participant.UserRole,
                    Username = participant.Username
                })
                .ToList();

            return new ConferenceResponse()
            {
                Case_name = _conferenceDetailsResponse.CaseName,
                HearingRefId = _conferenceDetailsResponse.HearingId,
                Id = _conferenceDetailsResponse.Id,
                Participants = participants,
                Status = _conferenceDetailsResponse.CurrentStatus
            };
        }
    }
}
