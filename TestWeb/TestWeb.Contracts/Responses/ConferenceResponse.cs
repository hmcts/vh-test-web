using System;
using System.Collections.Generic;
using VideoApi.Contract.Enums;

namespace TestWeb.Contracts.Responses
{
    public class ConferenceResponse
    {
        public Guid Id { get; set; }
        public Guid HearingRefId { get; set; }
        public string Case_name { get; set; }
        public ConferenceState Status { get; set; }
        public List<ParticipantResponse> Participants { get; set; }
    }
}
