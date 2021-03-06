using System.Linq;
using BookingsApi.Contract.Responses;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class BookingsHearingResponseBuilder
    {
        private readonly BookingsHearingResponse _response;

        public BookingsHearingResponseBuilder(HearingDetailsResponse hearingResponse)
        {
            _response = new BookingsHearingResponse()
            {
                AudioRecordingRequired = hearingResponse.AudioRecordingRequired,
                CancelReason = hearingResponse.CancelReason,
                CaseTypeName = hearingResponse.CaseTypeName,
                ConfirmedBy = hearingResponse.ConfirmedBy,
                ConfirmedDate = hearingResponse.ConfirmedDate,
                CourtAddress = string.Empty,
                CourtRoom = string.Empty,
                CourtRoomAccount = string.Empty,
                CreatedBy = hearingResponse.CreatedBy,
                CreatedDate = hearingResponse.CreatedDate,
                GroupId = hearingResponse.GroupId,
                HearingId = hearingResponse.Id,
                HearingName = hearingResponse.Cases.Single().Name,
                HearingNumber = hearingResponse.Cases.Single().Number,
                HearingTypeName = hearingResponse.HearingTypeName,
                JudgeName = hearingResponse.Participants.First(x => x.HearingRoleName.Equals("Judge")).DisplayName,
                LastEditBy = hearingResponse.UpdatedBy,
                LastEditDate = hearingResponse.UpdatedDate,
                QuestionnaireNotRequired = hearingResponse.QuestionnaireNotRequired,
                ScheduledDateTime = hearingResponse.ScheduledDateTime,
                ScheduledDuration = hearingResponse.ScheduledDuration,
                Status = hearingResponse.Status
            };
        }

        public BookingsHearingResponse Build()
        {
            return _response;
        }
    }
}