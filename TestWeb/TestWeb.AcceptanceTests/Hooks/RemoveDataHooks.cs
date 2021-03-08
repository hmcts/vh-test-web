using System.Net;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestApi.Contract.Requests;
using TestWeb.AcceptanceTests.Helpers;

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
            const int LIMIT = 1000;

            foreach (var caseName in context.Test.CaseNames)
            {
                var request = new DeleteTestHearingDataRequest()
                {
                    Limit = LIMIT,
                    PartialHearingCaseName = caseName
                };

                var response = context.TestApi.DeleteTestData(request); 
                response.StatusCode.Should().Be(HttpStatusCode.OK, $"Failed to delete hearing with case name '{request.PartialHearingCaseName}'");
            }
        }
    }
}
