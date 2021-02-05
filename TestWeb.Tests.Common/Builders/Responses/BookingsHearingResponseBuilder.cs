using System.Linq;
using TestWeb.TestApi.Client;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class BookingsHearingResponseBuilder
    {
        private readonly BookingsHearingResponse _response;

        public BookingsHearingResponseBuilder(HearingDetailsResponse hearingResponse)
        {
            _response = new BookingsHearingResponse()
            {
                Audio_recording_required = hearingResponse.Audio_recording_required,
                Cancel_reason = hearingResponse.Cancel_reason,
                Case_type_name = hearingResponse.Case_type_name,
                Confirmed_by = hearingResponse.Confirmed_by,
                Confirmed_date = hearingResponse.Confirmed_date,
                Court_address = string.Empty,
                Court_room = string.Empty,
                Court_room_account = string.Empty,
                Created_by = hearingResponse.Created_by,
                Created_date = hearingResponse.Created_date,
                Group_id = hearingResponse.Group_id,
                Hearing_date = hearingResponse.Scheduled_date_time,
                Hearing_id = hearingResponse.Id,
                Hearing_name = hearingResponse.Cases.Single().Name,
                Hearing_number = hearingResponse.Cases.Single().Number,
                Hearing_type_name = hearingResponse.Hearing_type_name,
                Judge_name = hearingResponse.Participants.First(x => x.Hearing_role_name.Equals("Judge")).Display_name,
                Last_edit_by = hearingResponse.Updated_by,
                Last_edit_date = hearingResponse.Updated_date,
                Questionnaire_not_required = hearingResponse.Questionnaire_not_required,
                Scheduled_date_time = hearingResponse.Scheduled_date_time,
                Scheduled_duration = hearingResponse.Scheduled_duration,
                Status = hearingResponse.Status
            };
        }

        public BookingsHearingResponse Build()
        {
            return _response;
        }
    }
}