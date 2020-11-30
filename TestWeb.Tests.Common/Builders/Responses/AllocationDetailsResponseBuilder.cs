using System;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class AllocationDetailsResponseBuilder
    {
        private readonly AllocationDetailsResponse _response;

        public AllocationDetailsResponseBuilder()
        {
            _response = new AllocationDetailsResponse()
            {
                Allocated = AllocationData.ALLOCATED,
                Expires_at = AllocationData.EXPIRES_AT,
                Id = Guid.NewGuid(),
                User_id = Guid.NewGuid(),
                Username = $"{UserData.JUDGE}{UserData.USERNAME_STEM}"
            };
        }

        public AllocationDetailsResponse Build()
        {
            return _response;
        }
    }
}
