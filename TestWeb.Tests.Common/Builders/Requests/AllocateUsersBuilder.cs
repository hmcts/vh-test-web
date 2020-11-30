using System.Collections.Generic;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Requests
{
    public class AllocateUsersBuilder
    {
        private readonly AllocateUsersRequest _request;

        public AllocateUsersBuilder()
        {
            _request = new AllocateUsersRequest()
            {
                Application = AllocationData.APPLICATION,
                Expiry_in_minutes = AllocationData.EXPIRY_IN_MINUTES,
                Is_prod_user = UserData.IS_PROD_USER,
                Test_type = AllocationData.TEST_TYPE,
                User_types = new List<UserType>()
            };
        }

        public AllocateUsersBuilder Judge()
        {
            _request.User_types.Add(UserType.Judge);
            return this;
        }

        public AllocateUsersBuilder Individual()
        {
            _request.User_types.Add(UserType.Individual);
            return this;
        }

        public AllocateUsersBuilder Representative()
        {
            _request.User_types.Add(UserType.Representative);
            return this;
        }

        public AllocateUsersRequest Build()
        {
            return _request;
        }
    }
}
