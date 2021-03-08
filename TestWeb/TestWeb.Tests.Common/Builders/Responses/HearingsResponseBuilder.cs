using System;
using System.Collections.Generic;
using BookingsApi.Contract.Responses;
using Microsoft.ApplicationInsights;
using TestApi.Contract.Dtos;
using TestApi.Contract.Requests;
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
                AudioRecordingRequired = request.AudioRecordingRequired,
                CancelReason = null,
                CaseTypeName = request.CaseType,
                Cases = new List<CaseResponse>()
                {
                    new CaseResponse()
                    {
                        IsLeadCase = HearingsData.IS_LEAD_CASE,
                        Name = HearingsData.CASE_NAME,
                        Number = HearingsData.CASE_NUMBER
                    }
                },
                ConfirmedBy = null,
                ConfirmedDate = null,
                CreatedBy = HearingsData.CREATED_BY,
                CreatedDate = DateTime.UtcNow,
                Endpoints = new List<EndpointResponse>(),
                GroupId = null,
                HearingRoomName = HearingsData.HEARING_ROOM_NAME,
                HearingTypeName = HearingsData.HEARING_TYPE_NAME,
                HearingVenueName = request.Venue,
                Id = Guid.NewGuid(),
                OtherInformation = HearingsData.OTHER_INFORMATION,
                Status = HearingsData.HEARING_STATUS,
                QuestionnaireNotRequired = request.QuestionnaireNotRequired,
                ScheduledDateTime = request.ScheduledDateTime,
                ScheduledDuration = HearingsData.SCHEDULED_DURATION,
                UpdatedBy = HearingsData.UPDATED_BY,
                UpdatedDate = DateTime.UtcNow
            };
            SetTheParticipants(request.Users);
        }

        private void SetTheParticipants(IEnumerable<UserDto> users)
        {
            _response.Participants = new List<ParticipantResponse>();
            foreach (var user in users)
            {
                _response.Participants.Add(new ParticipantResponse()
                {
                    CaseRoleName = user.UserType.ToString(),
                    ContactEmail = user.ContactEmail,
                    DisplayName = user.DisplayName,
                    FirstName = user.FirstName,
                    HearingRoleName = user.UserType.ToString(),
                    Id = user.Id,
                    LastName = user.LastName,
                    MiddleNames = string.Empty,
                    Organisation = string.Empty,
                    Representee = string.Empty,
                    TelephoneNumber = string.Empty,
                    Title = string.Empty,
                    UserRoleName = user.UserType.ToString(),
                    Username = user.Username
                });
            }
        }

        public HearingDetailsResponse Build()
        {
            return _response;
        }
    }
}