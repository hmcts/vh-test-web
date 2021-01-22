using System;

namespace TestWeb.Contracts.Responses
{
    public class HearingResponse
    {
        public Guid Id { get; set; }
        public string Case_name { get; set; }
        public DateTime ScheduledDate { get; set; }
    }
}
