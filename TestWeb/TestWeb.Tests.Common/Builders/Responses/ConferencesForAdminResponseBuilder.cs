using System;
using System.Collections.Generic;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class ConferencesForAdminResponseBuilder
    {
        public List<ConferenceForAdminResponse> Build()
        {
            var participants = new List<ParticipantSummaryResponse>();

            var judge = new ParticipantSummaryResponse()
            {
                Display_name = UserData.DISPLAY_NAME,
                First_name = UserData.FIRST_NAME,
                Id = Guid.NewGuid(),
                Last_name = UserData.LAST_NAME,
                Representee = string.Empty,
                User_role = UserRole.Judge,
                Username = UserData.USERNAME
            };

            var individual = new ParticipantSummaryResponse()
            {
                Display_name = UserData.DISPLAY_NAME,
                First_name = UserData.FIRST_NAME,
                Id = Guid.NewGuid(),
                Last_name = UserData.LAST_NAME,
                Representee = string.Empty,
                User_role = UserRole.Individual,
                Username = UserData.USERNAME
            };

            participants.Add(judge);
            participants.Add(individual);


            return new List<ConferenceForAdminResponse>()
            {
                new ConferenceForAdminResponse()
                {
                    Case_name = HearingsData.CASE_NAME,
                    Case_number = HearingsData.CASE_NUMBER,
                    Case_type = HearingsData.CASE_TYPE,
                    Closed_date_time = null,
                    Hearing_venue_name = HearingsData.VENUE,
                    Id = Guid.NewGuid(),
                    Participants = participants,
                    Scheduled_date_time = DateTime.UtcNow,
                    Scheduled_duration = HearingsData.SCHEDULED_DURATION,
                    Started_date_time = null
                }
            };
        }
    }
}
