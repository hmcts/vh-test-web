using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Converters;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class ConferenceDetailsResponseBuilder
    {
        private readonly ConferenceDetailsResponse _response;

        public ConferenceDetailsResponseBuilder(HearingDetailsResponse hearing)
        {
            _response = new ConferenceDetailsResponse()
            {
                Audio_recording_required = hearing.Audio_recording_required,
                Case_name = hearing.Cases.First().Name,
                Case_number = hearing.Cases.First().Number,
                Case_type = hearing.Case_type_name,
                Closed_date_time = null,
                Current_status = ConferenceData.CURRENT_STATUS,
                Endpoints = new List<EndpointResponse>(),
                Hearing_id = hearing.Id,
                Hearing_venue_name = hearing.Hearing_venue_name,
                Id = Guid.NewGuid(),
                Meeting_room = new MeetingRoomResponse(),
                Scheduled_date_time = hearing.Scheduled_date_time,
                Scheduled_duration = hearing.Scheduled_duration,
                Started_date_time = null
            };
            AddParticipants(hearing);
        }

        private void AddParticipants(HearingDetailsResponse hearing)
        {
            _response.Participants = new List<ParticipantDetailsResponse>();

            foreach (var participant in hearing.Participants)
            {
                Enum.TryParse(participant.User_role_name, out UserRole role);
                var response = new ParticipantDetailsResponse()
                {
                    Case_type_group = participant.User_role_name,
                    Contact_email = participant.Contact_email,
                    Contact_telephone = participant.Telephone_number,
                    Current_status = ParticipantState.NotSignedIn,
                    Display_name = participant.Display_name,
                    First_name = participant.First_name,
                    Hearing_role = participant.User_role_name,
                    Id = participant.Id,
                    Last_name = participant.Last_name,
                    Name = participant.Display_name,
                    Ref_id = participant.Id,
                    Representee = participant.Representee,
                    User_role = role,
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
