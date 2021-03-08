using System;
using TestApi.Contract.Responses;
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
                ExpiresAt = AllocationData.EXPIRES_AT,
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Username = $"{UserData.JUDGE}{UserData.USERNAME_STEM}"
            };
        }

        public AllocationDetailsResponseBuilder AllocatedBy(string allocatedBy)
        {
            _response.AllocatedBy = allocatedBy;
            return this;
        }

        public AllocationDetailsResponse Build()
        {
            return _response;
        }
    }
}
