using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using TechTalk.SpecFlow;
using TestApi.Contract.Enums;
using TestWeb.AcceptanceTests.Pages;

namespace TestWeb.AcceptanceTests.Steps
{
    [Binding]
    public class ProgressionSteps
    {
        private readonly UserBrowser _browser;
        private readonly BrowserSteps _browserSteps;
        private readonly CreateHearingsSteps _createHearingsSteps;
        private readonly LoginSteps _loginSteps;

        public ProgressionSteps(UserBrowser browser, LoginSteps loginSteps, BrowserSteps browserSteps, CreateHearingsSteps createHearingsSteps)
        {
            _browser = browser;
            _loginSteps = loginSteps;
            _browserSteps = browserSteps;
            _createHearingsSteps = createHearingsSteps;
        }

        [Given(@"the user has progressed to the Create Hearings page")]
        public void GivenTheUserHasProgressedToTheCreateHearingsPage()
        {
            _browserSteps.GivenANewBrowserIsOpenForAUser(UserType.Tester.ToString());
            _loginSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.CreateHearingsLink);
        }

        [Given(@"the user has progressed to the Summary page")]
        public void GivenTheUserHasProgressedToTheSummaryPage()
        {
            _browserSteps.GivenANewBrowserIsOpenForAUser(UserType.Tester.ToString());
            _loginSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.CreateHearingsLink);
            _createHearingsSteps.ProgressToNextPage();
        }

        [Given(@"the user has progressed to the Delete Hearings page with a hearing")]
        public void GivenTheUserHasProgressedToTheDeleteHearingsPageWithHearing()
        {
            _browserSteps.GivenANewBrowserIsOpenForAUser(UserType.Tester.ToString());
            _loginSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.CreateHearingsLink);
            _createHearingsSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.DeleteHearingsLink);
        }

        [Given(@"the user has progressed to the Home page with a hearing")]
        public void GivenTheUserHasProgressedToTheHomePageWithAHearing()
        {
            _browserSteps.GivenANewBrowserIsOpenForAUser(UserType.Tester.ToString());
            _loginSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.CreateHearingsLink);
            _createHearingsSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.HomeLink);
        }

        [Given(@"the user has progressed to the Delete Hearings page")]
        public void GivenTheUserHasProgressedToTheDeleteHearingsPageWithoutHearing()
        {
            _browserSteps.GivenANewBrowserIsOpenForAUser(UserType.Tester.ToString());
            _loginSteps.ProgressToNextPage();
            _browser.Driver.WaitUntilVisible(HeaderPage.DeleteHearingsLink);
            _browser.ClickLink(HeaderPage.DeleteHearingsLink);
        }

        [Given(@"the user has progressed to the Events page")]
        public void GivenTheUserHasProgressedToTheEventsPage()
        {
            _browserSteps.GivenANewBrowserIsOpenForAUser(UserType.Tester.ToString());
            _loginSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.CreateHearingsLink);
            _createHearingsSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.EventsLink);
        }

        [Given(@"the user has progressed to the Allocate Users page")]
        public void GivenTheUserHasProgressedToTheAllocateUsersPage()
        {
            _browserSteps.GivenANewBrowserIsOpenForAUser(UserType.Tester.ToString());
            _loginSteps.ProgressToNextPage();
            _browser.ClickLink(HeaderPage.AllocateUserLink);
        }
    }
}
