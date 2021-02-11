using AcceptanceTests.Common.Api.Hearings;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;

namespace TestWeb.AcceptanceTests.Hooks
{
    [Binding]
    public class RegisterApisHooks
    {
        [BeforeScenario(Order = (int)HooksSequence.RegisterApisHooks)]
        public void RegisterApis(TestContext context)
        {
            context.TestApi = new TestApiManager(context.Config.Services.TestApiUrl, context.TestApiToken);
        }
    }
}
