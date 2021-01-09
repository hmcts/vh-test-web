using System;
using TestWeb.TestApi.Client;

namespace TestWeb.Contracts.Responses
{
    public class ParticipantResponse
    {
        public string Display_name { get; set; }
        public string Hearing_role { get; set; }
        public Guid Id { get; set; }
        public ParticipantState Status { get; set; }
        public UserRole User_role { get; set; }
        public string Username { get; set; }
    }
}
