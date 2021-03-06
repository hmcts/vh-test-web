using System;
using System.Collections.Generic;
using TestWeb.Tests.Common.Data;
using VideoApi.Contract.Enums;
using VideoApi.Contract.Responses;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class ConferencesForAdminResponseBuilder
    {
        public List<ConferenceForAdminResponse> Build()
        {
            var participants = new List<ParticipantSummaryResponse>();

            var judge = new ParticipantSummaryResponse()
            {
                DisplayName = UserData.DISPLAY_NAME,
                FirstName = UserData.FIRST_NAME,
                Id = Guid.NewGuid(),
                LastName = UserData.LAST_NAME,
                Representee = string.Empty,
                UserRole = UserRole.Judge,
                Username = UserData.USERNAME
            };

            var individual = new ParticipantSummaryResponse()
            {
                DisplayName = UserData.DISPLAY_NAME,
                FirstName = UserData.FIRST_NAME,
                Id = Guid.NewGuid(),
                LastName = UserData.LAST_NAME,
                Representee = string.Empty,
                UserRole = UserRole.Individual,
                Username = UserData.USERNAME
            };

            participants.Add(judge);
            participants.Add(individual);


            return new List<ConferenceForAdminResponse>()
            {
                new ConferenceForAdminResponse()
                {
                    CaseName = HearingsData.CASE_NAME,
                    CaseNumber = HearingsData.CASE_NUMBER,
                    CaseType = HearingsData.CASE_TYPE,
                    ClosedDateTime = null,
                    HearingVenueName = HearingsData.VENUE,
                    Id = Guid.NewGuid(),
                    Participants = participants,
                    ScheduledDateTime = DateTime.UtcNow,
                    ScheduledDuration = HearingsData.SCHEDULED_DURATION,
                    StartedDateTime = null
                }
            };
        }
    }
}
