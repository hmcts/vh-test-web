using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using AcceptanceTests.Common.Test.Steps;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.AcceptanceTests.Pages;

namespace TestWeb.AcceptanceTests.Steps
{
    [Binding]
    public class CreateHearingsSteps : ISteps
    {
        private readonly  UserBrowser _browser;
        private readonly TestContext _c;
        private readonly CommonSharedSteps _commonSharedSteps;
        private int _numberOfHearings;

        public CreateHearingsSteps(UserBrowser browser, TestContext testContext, CommonSharedSteps commonSharedSteps)
        {
            _browser = browser;
            _c = testContext;
            _commonSharedSteps = commonSharedSteps;
        }

        public void ProgressToNextPage()
        {
            _numberOfHearings = 1;
            ClickBook();
            VerifyTextPresence.Verify(_browser, CreateHearingPage.SummaryTextfield, "Hearing ID", _numberOfHearings);
            GetTheHearingNames();
            _c.Test.CaseNames.Count.Should().BeGreaterThan(0);
            _browser.ClickLink(HeaderPage.DeleteHearingsLink);
        }

        [When(@"the user creates (.*) hearings")]
        public void WhenTheUserCreatesHearings(int numberOfHearings)
        {
            _numberOfHearings = numberOfHearings;
            _browser.Driver.WaitForListToBePopulated(CreateHearingPage.NumberOfHearingsDropdown);
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, CreateHearingPage.NumberOfHearingsDropdown, numberOfHearings.ToString());
            ClickBook();
        }

        private void ClickBook()
        {
            _browser.Click(CreateHearingPage.BookAndConfirmButton);
        }

        [Then(@"the progress is visible")]
        public void ThenTheProgressIsVisible()
        {
            VerifyTextPresence.Verify(_browser, CreateHearingPage.ProgressTextfield, "[Allocating] Complete", _numberOfHearings);
            VerifyTextPresence.Verify(_browser, CreateHearingPage.ProgressTextfield, "[Creating hearing] Complete", _numberOfHearings);
            VerifyTextPresence.Verify(_browser, CreateHearingPage.ProgressTextfield, "[Confirming hearing] Complete", _numberOfHearings);
            VerifyTextPresence.Verify(_browser, CreateHearingPage.ProgressTextfield, "[Resetting user passwords] Complete", _numberOfHearings);
        }

        [Then(@"the conference details appear in the summary")]
        public void ThenTheConferenceDetailsAppearInTheSummary()
        {
            VerifyTextPresence.Verify(_browser, CreateHearingPage.SummaryTextfield, "Hearing ID", _numberOfHearings);
            VerifyTextPresence.Verify(_browser, CreateHearingPage.SummaryTextfield, "Conference ID", _numberOfHearings);
            GetTheHearingNames();
        }

        private void GetTheHearingNames()
        {
            var summary = _browser.Driver.WaitUntilVisible(CreateHearingPage.SummaryTextfield).GetProperty("value");
            summary = summary.Replace("\r\n", ".");
            var sentences = summary.Split(new[] { '.' });

            foreach (var sentence in sentences)
            {
                if (sentence.Contains("Test"))
                {
                    _c.Test.CaseNames.Add(sentence);
                }
            }
        }

        [When(@"the date is set to a past date")]
        public void WhenTheDateIsSetToThePast()
        {
            _browser.Driver.WaitUntilVisible(CreateHearingPage.HearingStartTimeHour).Clear();
            _browser.Driver.WaitUntilVisible(CreateHearingPage.HearingStartTimeHour).SendKeys("00");
            _browser.Driver.WaitUntilVisible(CreateHearingPage.HearingStartTimeMinute).Clear();
            _browser.Driver.WaitUntilVisible(CreateHearingPage.HearingStartTimeMinute).SendKeys("00");
        }

        [Then(@"an error appears stating the hearing time must be in the future")]
        public void ThenAnErrorAppearsStatingTheHearingTimeMustBeInTheFuture()
        {
            _browser.Driver.WaitUntilVisible(CreateHearingPage.HearingTimeError).Displayed.Should().BeTrue();
        }
    }
}
