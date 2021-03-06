using TestApi.Contract.Enums;
using TestApi.Contract.Requests;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Requests
{
    public class AllocateUserBuilder
    {
        private readonly AllocateUserRequest _request;

        public AllocateUserBuilder()
        {
            _request = new AllocateUserRequest()
            {
                Application = AllocationData.APPLICATION,
                ExpiryInMinutes = AllocationData.EXPIRY_IN_MINUTES,
                IsProdUser = UserData.IS_PROD_USER,
                TestType = AllocationData.TEST_TYPE
            };
        }

        public AllocateUserBuilder Judge()
        {
            _request.UserType = UserType.Judge;
            return this;
        }

        public AllocateUserBuilder Individual()
        {
            _request.UserType = UserType.Individual;
            return this;
        }

        public AllocateUserBuilder Representative()
        {
            _request.UserType = UserType.Representative;
            return this;
        }

        public AllocateUserBuilder AllocatedBy(string allocatedBy)
        {
            _request.AllocatedBy = allocatedBy;
            return this;
        }

        public AllocateUserRequest Build()
        {
            return _request;
        }
    }
}
