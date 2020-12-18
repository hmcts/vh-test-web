using System.Linq;
using System.Net;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.TestApi.Client;

namespace TestWeb.AcceptanceTests.Hooks
{
    [Binding]
    public class RemoveDataHooks
    {
        [AfterScenario]
        public void RemoveData(TestContext context)
        {
            if (context?.Test?.CaseNames == null) return;
            if (context.Test.CaseNames.Count == 0) return;

            foreach (var response in context.Test.CaseNames.Select(caseName => new DeleteTestHearingDataRequest()
            {
                Partial_hearing_case_name = caseName
            }).Select(request => context.TestApi.DeleteTestData(request)))
            {
                response.StatusCode.Should().Be(HttpStatusCode.OK);
            }
        }
    }
}
