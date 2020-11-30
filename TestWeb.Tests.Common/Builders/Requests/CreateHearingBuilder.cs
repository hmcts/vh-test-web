using System;
using System.Collections.Generic;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Requests
{
    public class CreateHearingBuilder
    {
        private readonly CreateHearingRequest _request;

        public CreateHearingBuilder()
        {
            var judge = new UserBuilder().Judge().Build();
            var individual = new UserBuilder().Individual().Build();
            var representative = new UserBuilder().Representative().Build();
            var users = new List<User>() { judge, individual, representative };

            _request = new CreateHearingRequest()
            {
                Audio_recording_required = HearingsData.AUDIO_RECORDING_REQUIRED,
                Application = HearingsData.APPLICATION,
                Case_type = HearingsData.CASE_TYPE,
                Questionnaire_not_required = HearingsData.QUESTIONNAIRE_NOT_REQUIRED,
                Scheduled_date_time = DateTime.UtcNow,
                Test_type = HearingsData.TEST_TYPE,
                Users = users,
                Venue = HearingsData.VENUE
            };
        }

        public CreateHearingRequest Build()
        {
            return _request;
        }
    }
}
