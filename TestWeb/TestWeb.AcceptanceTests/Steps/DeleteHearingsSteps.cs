using System.Linq;
using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.AcceptanceTests.Pages;

namespace TestWeb.AcceptanceTests.Steps
{
    [Binding]
    public class DeleteHearingsSteps
    {
        private readonly UserBrowser _browser;
        private readonly TestContext _c;
        private readonly ScenarioContext _scenario;

        public DeleteHearingsSteps(UserBrowser browser, TestContext testContext, ScenarioContext scenario)
        {
            _browser = browser;
            _c = testContext;
            _scenario = scenario;
        }

        [When(@"the user deletes the hearing")]
        public void WhenTheUserAddTheCaseName()
        {
            _browser.Driver.WaitUntilVisible(DeleteHearingPage.CaseNameError);
            var caseName = _c.Test.CaseNames.First();
            _browser.Driver.WaitUntilVisible(DeleteHearingPage.CaseNameText).SendKeys(caseName);
            ClickDelete();
            if (!_scenario.ScenarioInfo.Tags.Contains("Delete"))
            {
                _c.Test.CaseNames.Remove(caseName);
            }
        }

        [Then(@"the deleted hearing appears in the results")]
        public void ThenTheDeletedHearingAppearsInTheResults()
        {
            _c.Test.CaseNames.Should().NotBeNullOrEmpty();
            var prefix = $"{_c.Test.CaseNames.Count} hearing(s) deleted matching case name ";
            var caseName = _c.Test.CaseNames.First();
            VerifyTextPresence.VerifyOnce(_browser, DeleteHearingPage.ResultsTextfield, prefix);
            VerifyTextPresence.VerifyOnce(_browser, DeleteHearingPage.ResultsTextfield, caseName);
        }

        private void ClickDelete()
        {
            _browser.Click(DeleteHearingPage.DeleteButton);
        }

        [When(@"the user attempts to delete a hearing without the word test")]
        public void WhenTheUserAttemptsToDeleteAHearingWithoutTheWordTest()
        {
            const string caseName = "Invalid case name";
            _browser.Driver.WaitUntilVisible(DeleteHearingPage.CaseNameText).SendKeys(caseName);
        }

        [Then(@"an error message appears stating the case name must have the word test")]
        public void ThenAnErrorMessageAppearsStatingTheCaseNameMustHaveTheWordTest()
        {
            _browser.Driver.WaitUntilVisible(DeleteHearingPage.CaseNameError).Displayed.Should().BeTrue();
        }
    }
}
