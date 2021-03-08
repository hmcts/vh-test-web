using System.Collections.Generic;
using TestApi.Contract.Enums;
using TestApi.Contract.Requests;
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
                ExpiryInMinutes = AllocationData.EXPIRY_IN_MINUTES,
                IsProdUser = UserData.IS_PROD_USER,
                TestType = AllocationData.TEST_TYPE,
                UserTypes = new List<UserType>()
            };
        }

        public AllocateUsersBuilder Judge()
        {
            _request.UserTypes.Add(UserType.Judge);
            return this;
        }

        public AllocateUsersBuilder Individual()
        {
            _request.UserTypes.Add(UserType.Individual);
            return this;
        }

        public AllocateUsersBuilder Representative()
        {
            _request.UserTypes.Add(UserType.Representative);
            return this;
        }

        public AllocateUsersRequest Build()
        {
            return _request;
        }
    }
}
