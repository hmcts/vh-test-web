using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using AcceptanceTests.Common.Test.Steps;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Data;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.AcceptanceTests.Pages;

namespace TestWeb.AcceptanceTests.Steps
{
    [Binding]
    public class SummarySteps : ISteps
    {
        private readonly UserBrowser _browser;
        private readonly TestContext _c;
        private readonly BrowserSteps _browserSteps;
        private const int JudgesCount = 1;

        public SummarySteps(UserBrowser browser, TestContext testContext, BrowserSteps browserSteps)
        {
            _browser = browser;
            _c = testContext;
            _browserSteps = browserSteps;
        }

        [Then(@"the summary page displays the new hearing details")]
        public void ThenTheSummaryPageDisplaysTheNewHearingDetails()
        {
            for (var i = 0; i < _c.Test.CaseNames.Count; i++)
            {
                _browser.TextOf(SummaryPage.CaseName(i)).Should().Be(_c.Test.CaseNames[i]);
                _browser.TextOf(SummaryPage.CaseNumber(i)).Should().NotBeNull();
                _browser.TextOf(SummaryPage.ScheduledDate(i)).Should().NotBeNull();
                _browser.TextOf(SummaryPage.HearingId(i)).Should().NotBeNull();
                _browser.TextOf(SummaryPage.ConferenceId(i)).Should().NotBeNull();
                _browser.Driver.WaitUntilVisible(SummaryPage.CopyButton(i)).Displayed.Should().BeTrue();

                const int expectedNumberOfParticipants = JudgesCount + DefaultData.Individuals + DefaultData.Representatives + DefaultData.Observers + DefaultData.PanelMembers;

                for (var j = 0; j < expectedNumberOfParticipants; j++)
                {
                    _browser.TextOf(SummaryPage.ParticipantUsername(i, j)).Should().NotBeNull();
                    _browser.TextOf(SummaryPage.ParticipantPassword(i, j)).Should().NotBeNull();
                }

                for (var j = 0; j < _c.Test.Endpoints; j++)
                {
                    _browser.TextOf(SummaryPage.EndpointDisplayName(i, j)).Should().StartWith(DefaultData.EndpointsPrefix);
                    _browser.TextOf(SummaryPage.EndpointSipAddress(i, j)).Should().NotBeNull();
                    _browser.TextOf(SummaryPage.EndpointPin(i, j)).Should().NotBeNull();
                }
            }
        }

        [Then(@"the user can return to the Create Hearings page")]
        public void ProgressToNextPage()
        {
            _browser.ClickLink(SummaryPage.BackLink);
            _browserSteps.ThenTheUserIsOnThePage("create hearings");
        }
    }
}
