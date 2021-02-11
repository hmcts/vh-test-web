using TestWeb.TestApi.Client;
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
                Expiry_in_minutes = AllocationData.EXPIRY_IN_MINUTES,
                Is_prod_user = UserData.IS_PROD_USER,
                Test_type = AllocationData.TEST_TYPE
            };
        }

        public AllocateUserBuilder Judge()
        {
            _request.User_type = UserType.Judge;
            return this;
        }

        public AllocateUserBuilder Individual()
        {
            _request.User_type = UserType.Individual;
            return this;
        }

        public AllocateUserBuilder Representative()
        {
            _request.User_type = UserType.Representative;
            return this;
        }

        public AllocateUserBuilder AllocatedBy(string allocatedBy)
        {
            _request.Allocated_by = allocatedBy;
            return this;
        }

        public AllocateUserRequest Build()
        {
            return _request;
        }
    }
}
