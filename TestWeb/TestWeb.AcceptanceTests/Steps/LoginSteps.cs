using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using AcceptanceTests.Common.PageObject.Pages;
using AcceptanceTests.Common.Test.Steps;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;

namespace TestWeb.AcceptanceTests.Steps
{
    [Binding]
    public class LoginSteps : ISteps
    {
        private readonly UserBrowser _browser;
        private readonly TestContext _c;

        public LoginSteps(UserBrowser browser, TestContext testContext)
        {
            _browser = browser;
            _c = testContext;
        }

        [When(@"the user logs in with valid credentials")]
        public void ProgressToNextPage()
        {
            EnterUsername(_c.CurrentUser.Username);
            ClickNextButton();
            EnterPassword(_c.Config.TestSettings.TestUserPassword);
            ClickSignInButton();
        }

        private void EnterUsername(string username)
        {
            _browser.Driver.WaitUntilVisible(LoginPage.LoginHeader).Click();
            _browser.Driver.WaitUntilVisible(LoginPage.UsernameTextfield).Clear();
            _browser.Driver.WaitUntilVisible(LoginPage.UsernameTextfield).SendKeys(username);
        }

        private void ClickNextButton() => _browser.Click(LoginPage.Next);

        private void EnterPassword(string password)
        {
            _browser.Driver.WaitUntilVisible(LoginPage.PasswordField).Clear();
            _browser.Driver.WaitUntilVisible(LoginPage.PasswordField).SendKeys(password);
        }

        private void ClickSignInButton() => _browser.Click(LoginPage.SignIn);
    }
}
