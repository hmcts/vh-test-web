using System;
using System.Collections.Generic;
using TestApi.Contract.Dtos;
using TestApi.Contract.Requests;
using TestWeb.Tests.Common.Builders.Models;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Requests
{
    public class CreateHearingRequestBuilder
    {
        private readonly CreateHearingRequest _request;

        public CreateHearingRequestBuilder()
        {
            var judge = new UserBuilder().Judge().Build();
            var individual = new UserBuilder().Individual().Build();
            var representative = new UserBuilder().Representative().Build();
            var users = new List<UserDto>() { judge, individual, representative };

            _request = new CreateHearingRequest()
            {
                AudioRecordingRequired = HearingsData.AUDIO_RECORDING_REQUIRED,
                Application = HearingsData.APPLICATION,
                CaseType = HearingsData.CASE_TYPE,
                QuestionnaireNotRequired = HearingsData.QUESTIONNAIRE_NOT_REQUIRED,
                ScheduledDateTime = DateTime.UtcNow,
                TestType = HearingsData.TEST_TYPE,
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
