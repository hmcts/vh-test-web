using System.Collections.Generic;
using TestApi.Contract.Dtos;
using VideoApi.Contract.Responses;

namespace TestWeb.AcceptanceTests.Data
{
    public class Test
    {
        public string AllocateUsername { get; set; }
        public List<string> CaseNames { get; set; }
        public int Endpoints { get; set; }
        public List<UserDto> Users { get; set; }
        public ConferenceDetailsResponse Conference { get; set; }
    }
}
