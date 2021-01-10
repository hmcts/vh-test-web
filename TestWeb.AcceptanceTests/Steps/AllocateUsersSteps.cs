using System;
using System.Threading;
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
    public class AllocateUsersSteps
    {
        private readonly UserBrowser _browser;
        private readonly TestContext _c;
        private readonly CommonSharedSteps _commonSharedSteps;

        public AllocateUsersSteps(UserBrowser browser, TestContext testContext, CommonSharedSteps commonSharedSteps)
        {
            _browser = browser;
            _c = testContext;
            _commonSharedSteps = commonSharedSteps;
        }

        [When(@"the user allocates an individual user")]
        public void WhenTheUserAllocatesAnIndividualUser()
        {
            SelectUserType("Individual");
            SelectTestType("Manual");
            SelectExpiry(0, 1);
            ClickAllocate();
        }

        private void SelectUserType(string userType)
        {
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, AllocateUsersPage.UserTypeDropdown, userType);
        }

        private void SelectTestType(string testType)
        {
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, AllocateUsersPage.TestTypeDropdown, testType);
        }

        private void SelectExpiry(int hours, int minutes)
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.HoursTextfield).Clear();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.HoursTextfield).SendKeys(hours.ToString());
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.MinutesTextfield).Clear();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.MinutesTextfield).SendKeys(minutes.ToString());
        }

        private void ClickAllocate()
        {
            _browser.Click(AllocateUsersPage.AllocateButton);
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.CompletedTitle).Displayed.Should().BeTrue();
        }

        [Then(@"the allocated username and password are displayed")]
        [Then(@"the reset password is displayed")]
        public void ThenTheAllocatedUsernameAndPasswordAreDisplayed()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.ResetUsername).Text.Trim().Should().NotBeNullOrEmpty();
            _c.Test.AllocateUsername = _browser.Driver.WaitUntilVisible(AllocateUsersPage.ResetUsername).Text.Trim();
            _c.Test.AllocateUsername.Should().NotBeNullOrEmpty();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.ResetPassword).Text.Trim().Should().NotBeNullOrEmpty();
        }

        [When(@"the user unallocates the user")]
        public void WhenTheUserUnallocatesTheUser()
        {
            DismissThePopup();
            ClickRefresh();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.UnallocateButton(_c.Test.AllocateUsername)).Displayed.Should().BeTrue();
            _browser.Click(AllocateUsersPage.UnallocateButton(_c.Test.AllocateUsername));
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.CompletedTitle).Displayed.Should().BeTrue();
        }

        private void DismissThePopup()
        {
            _browser.Click(AllocateUsersPage.CloseButton);
            _browser.Driver.WaitUntilElementNotVisible(AllocateUsersPage.CloseButton);
        }

        private void ClickRefresh()
        {
            _browser.Refresh();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.RefreshButton).Displayed.Should().BeTrue();
            _browser.Click(AllocateUsersPage.RefreshButton);
            Thread.Sleep(TimeSpan.FromSeconds(1));
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.ExpiresAt(_c.Test.AllocateUsername)).Text.Trim().Should().NotBeNullOrEmpty();
        }

        [Then(@"the user is no longer allocated")]
        public void ThenTheUserIsNoLongerAllocated()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.UnallocatedText).Displayed.Should().BeTrue();
            _c.Test.AllocateUsername = null;
        }

        [When(@"the user resets the users password")]
        public void WhenTheUserResetsTheUsersPassword()
        {
            DismissThePopup();
            ClickRefresh();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.ResetButton(_c.Test.AllocateUsername)).Displayed.Should().BeTrue();
            _browser.Click(AllocateUsersPage.ResetButton(_c.Test.AllocateUsername));
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.CompletedTitle).Displayed.Should().BeTrue();
        }

        [When(@"the user attempts to add invalid hours and minutes")]
        public void WhenTheUserAttemptsToAddInvalidHoursAndMinutes()
        {
            SelectExpiry(9, 60);
        }

        [Then(@"hours and minutes error messages are displayed")]
        public void ThenHoursAndMinutesErrorMessagesAreDisplayed()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.HoursError).Displayed.Should().BeTrue();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.MinutesError).Displayed.Should().BeTrue();
        }

        [When(@"the user attempts to add zero for both hours and minutes")]
        public void WhenTheUserAttemptsToAddZeroForBothHoursAndMinutes()
        {
            SelectExpiry(0, 0);
        }

        [Then(@"the zero hours and minutes error message is displayed")]
        public void ThenTheZeroHoursAndMinutesErrorMessageIsDisplayed()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.TimeError).Displayed.Should().BeTrue();
        }
    }
}
