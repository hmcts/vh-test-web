using System;
using System.Net;
using AcceptanceTests.Common.Api.Helpers;
using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.PageObject.Pages;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestApi.Contract.Enums;
using TestApi.Contract.Requests;
using TestApi.Contract.Responses;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.AcceptanceTests.Pages;

namespace TestWeb.AcceptanceTests.Steps
{
    [Binding]
    public class BrowserSteps
    {
        private const int REACHED_THE_PAGE_RETRIES = 2;
        private const int ALLOCATE_USERS_FOR_MINUTES = 2;
        private UserBrowser _browser;
        private readonly TestContext _c;

        public BrowserSteps(UserBrowser browser, TestContext testContext)
        {
            _browser = browser;
            _c = testContext;
        }

        [Given(@"a new browser is open for a (.*) user")]
        [Given(@"a new browser is open for an (.*) user")]
        public void GivenANewBrowserIsOpenForAUser(string userTypeString)
        {
            var userType = GetUserType(userTypeString);
            AllocateUser(userType);

            _browser = _browser
                .SetBaseUrl(_c.Config.Services.TestWebUrl)
                .SetTargetBrowser(_c.Config.TestSettings.TargetBrowser)
                .SetTargetDevice(_c.Config.TestSettings.TargetDevice)
                .SetDriver(_c.Driver);

            _browser.LaunchBrowser();
            _browser.NavigateToPage();
        }

        private static UserType GetUserType(string userTypeString)
        {
            return (UserType)Enum.Parse(typeof(UserType), userTypeString.Replace(" ", string.Empty), true);
        }

        private void AllocateUser(UserType userType)
        {
            var request = new AllocateUserRequest()
            {
                Application = Application.TestWeb,
                ExpiryInMinutes = ALLOCATE_USERS_FOR_MINUTES,
                IsProdUser = false,
                TestType = TestType.Automated,
                UserType = userType
            };

            var response = _c.TestApi.AllocateUser(request);
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.Should().NotBeNull();
            var user = RequestHelper.Deserialise<UserDetailsResponse>(response.Content);
            user.Should().NotBeNull();
            _c.CurrentUser = user;
        }

        [Then(@"the user is able to logout")]
        public void WhenTheUserAttemptsToLogout()
        {
            _browser.ClickLink(CommonPages.SignOutLink);
            _browser.ClickLink(CommonPages.SignInLink);
            ThenTheUserShouldBeNavigatedToSignInScreen();
        }

        [Then(@"the user should be navigated to sign in screen")]
        public void ThenTheUserShouldBeNavigatedToSignInScreen()
        {
            _browser.Retry(() => _browser.Driver.Title.Trim().Should().Be(LoginPage.SignInTitle), REACHED_THE_PAGE_RETRIES);
        }

        [Then(@"the user is on the (.*) page")]
        public void ThenTheUserIsOnThePage(string page)
        {
            _browser.PageUrl(Page.FromString(page).Url);
        }
    }
}
