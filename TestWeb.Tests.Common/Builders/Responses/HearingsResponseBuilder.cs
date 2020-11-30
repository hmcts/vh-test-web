using System;
using System.Collections.Generic;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class HearingsResponseBuilder
    {
        private readonly HearingDetailsResponse _response;

        public HearingsResponseBuilder(CreateHearingRequest request)
        {
            _response = new HearingDetailsResponse()
            {
                AdditionalProperties = new Dictionary<string, object>(),
                Audio_recording_required = request.Audio_recording_required,
                Cancel_reason = null,
                Case_type_name = request.Case_type,
                Cases = new List<CaseResponse>()
                {
                    new CaseResponse()
                    {
                        AdditionalProperties = new Dictionary<string, object>(),
                        Is_lead_case = HearingsData.IS_LEAD_CASE,
                        Name = HearingsData.CASE_NAME,
                        Number = HearingsData.CASE_NUMBER
                    }
                },
                Confirmed_by = null,
                Confirmed_date = null,
                Created_by = HearingsData.CREATED_BY,
                Created_date = DateTime.UtcNow,
                Endpoints = new List<EndpointResponse2>(),
                Group_id = null,
                Hearing_room_name = HearingsData.HEARING_ROOM_NAME,
                Hearing_type_name = HearingsData.HEARING_TYPE_NAME,
                Hearing_venue_name = request.Venue,
                Id = Guid.NewGuid(),
                Other_information = HearingsData.OTHER_INFORMATION,
                Participants = new List<ParticipantResponse>(),
                Status = HearingsData.HEARING_STATUS,
                Questionnaire_not_required = request.Questionnaire_not_required,
                Scheduled_date_time = request.Scheduled_date_time,
                Scheduled_duration = HearingsData.SCHEDULED_DURATION,
                Updated_by = HearingsData.UPDATED_BY,
                Updated_date = DateTime.UtcNow
            };
        }

        public HearingDetailsResponse Build()
        {
            return _response;
        }
    }
}
