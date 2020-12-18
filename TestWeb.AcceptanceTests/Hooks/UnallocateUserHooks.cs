using System.Collections.Generic;
using System.Net;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.TestApi.Client;

namespace TestWeb.AcceptanceTests.Hooks
{
    [Binding]
    public class UnallocateUserHooks
    {
        [AfterScenario]
        public void UnallocateUsers(TestContext context)
        {
            if (context?.TestApi == null) return;
            if (context.CurrentUser == null) return;

            var request = new UnallocateUsersRequest()
            {
                Usernames = new List<string>{context.CurrentUser.Username}
            };

            var response = context.TestApi.UnallocateUsers(request);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}
