using System.Collections.Generic;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Requests
{
    public class UnallocateUsersBuilder
    {
        private readonly UnallocateUsersRequest _request;

        public UnallocateUsersBuilder()
        {
            _request = new UnallocateUsersRequest()
            {
                Usernames = new List<string>()
                {
                    $"{UserData.JUDGE}{UserData.USERNAME_STEM}"
                }
            };
        }

        public UnallocateUsersRequest Build()
        {
            return _request;
        }
    }
}
