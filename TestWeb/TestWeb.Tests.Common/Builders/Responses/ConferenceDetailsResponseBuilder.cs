using System;
using System.Collections.Generic;
using System.Linq;
using BookingsApi.Contract.Responses;
using Newtonsoft.Json.Converters;
using TestWeb.Tests.Common.Data;
using VideoApi.Contract.Enums;
using VideoApi.Contract.Responses;
using EndpointResponse = VideoApi.Contract.Responses.EndpointResponse;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class ConferenceDetailsResponseBuilder
    {
        private readonly ConferenceDetailsResponse _response;

        public ConferenceDetailsResponseBuilder(HearingDetailsResponse hearing)
        {
            _response = new ConferenceDetailsResponse()
            {
                AudioRecordingRequired = hearing.AudioRecordingRequired,
                CaseName = hearing.Cases.First().Name,
                CaseNumber = hearing.Cases.First().Number,
                CaseType = hearing.CaseTypeName,
                ClosedDateTime = null,
                CurrentStatus = ConferenceData.CURRENT_STATUS,
                Endpoints = new List<EndpointResponse>(),
                HearingId = hearing.Id,
                HearingVenueName = hearing.HearingVenueName,
                Id = Guid.NewGuid(),
                MeetingRoom = new MeetingRoomResponse(),
                ScheduledDateTime = hearing.ScheduledDateTime,
                ScheduledDuration = hearing.ScheduledDuration,
                StartedDateTime = null
            };
            AddParticipants(hearing);
        }

        private void AddParticipants(HearingDetailsResponse hearing)
        {
            _response.Participants = new List<ParticipantDetailsResponse>();

            foreach (var participant in hearing.Participants)
            {
                Enum.TryParse(participant.UserRoleName, out UserRole role);
                var response = new ParticipantDetailsResponse()
                {
                    CaseTypeGroup = participant.UserRoleName,
                    ContactEmail = participant.ContactEmail,
                    ContactTelephone = participant.Title,
                    CurrentStatus = ParticipantState.NotSignedIn,
                    DisplayName = participant.DisplayName,
                    FirstName = participant.FirstName,
                    HearingRole = participant.UserRoleName,
                    Id = participant.Id,
                    LastName = participant.LastName,
                    Name = participant.DisplayName,
                    RefId = participant.Id,
                    Representee = participant.Representee,
                    UserRole = role,
                    Username = participant.Username
                };
                _response.Participants.Add(response);
            }
        }

        public ConferenceDetailsResponse Build()
        {
            return _response;
        }
    }
}
