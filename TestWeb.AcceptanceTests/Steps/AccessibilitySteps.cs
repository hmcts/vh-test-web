using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using FluentAssertions;
using Selenium.Axe;
using TechTalk.SpecFlow;

namespace TestWeb.AcceptanceTests.Steps
{
    namespace VideoWeb.AcceptanceTests.Steps
    {
        [Binding]
        public class AccessibilitySteps
        {
            private readonly UserBrowser _browser;

            public AccessibilitySteps(UserBrowser browser)
            {
                _browser = browser;
            }

            [Then(@"the page should be accessible")]
            public void ThenThePageShouldBeAccessible()
            {
                _browser.Driver.WaitForPageToLoad();
                var axeResult = new AxeBuilder(_browser.Driver).Analyze();
                axeResult.Violations.Should().BeEmpty();
            }
        }
    }
}
