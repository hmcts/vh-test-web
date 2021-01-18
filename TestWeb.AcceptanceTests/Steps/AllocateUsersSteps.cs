using System;
using System.Threading;
using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using AcceptanceTests.Common.Test.Steps;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.AcceptanceTests.Hooks;
using TestWeb.AcceptanceTests.Pages;

namespace TestWeb.AcceptanceTests.Steps
{
    [Binding]
    public class AllocateUsersSteps
    {
        private readonly UserBrowser _browser;
        private readonly TestContext _c;
        private readonly CommonSharedSteps _commonSharedSteps;
        private readonly ProgressionSteps _progressionSteps;

        public AllocateUsersSteps(UserBrowser browser, TestContext testContext, CommonSharedSteps commonSharedSteps, ProgressionSteps progressionSteps)
        {
            _browser = browser;
            _c = testContext;
            _commonSharedSteps = commonSharedSteps;
            _progressionSteps = progressionSteps;
        }

        [Given(@"the user has allocated an individual user")]
        public void GivenTheUserHasAllocatedAnIndividualUser()
        {
            _progressionSteps.GivenTheUserHasProgressedToTheAllocateUsersPage();
            WhenTheUserAllocatesAnIndividualUser();
        }

        [Given(@"the user has allocated two individual users")]
        public void GivenTheUserHasAllocatedTwoIndividualUsers()
        {
            GivenTheUserHasAllocatedAnIndividualUser();
            WhenTheUserAllocatesAnIndividualUser();
        }
        
        [When(@"the user allocates an individual user")]
        [When(@"the user allocates another individual user")]
        public void WhenTheUserAllocatesAnIndividualUser()
        {
            SelectUserType("Individual");
            SelectTestType("Manual");
            SelectExpiry(0, 0, 1);
            ClickAllocate();
            ThenTheAllocatedUsernameAndPasswordAreDisplayed();
            DismissThePopup();
        }

        private void SelectUserType(string userType)
        {
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, AllocateUsersPage.UserTypeDropdown, userType);
        }

        private void SelectTestType(string testType)
        {
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, AllocateUsersPage.TestTypeDropdown, testType);
        }

        private void SelectExpiry(int days, int hours, int minutes)
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.DaysTextfield).Clear();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.DaysTextfield).SendKeys(days.ToString());
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
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.UnallocateButton(_c.Test.AllocateUsername)).Displayed.Should().BeTrue();
            _browser.Click(AllocateUsersPage.UnallocateButton(_c.Test.AllocateUsername));
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.CompletedTitle).Displayed.Should().BeTrue();
        }

        private void DismissThePopup()
        {
            _browser.Click(AllocateUsersPage.CloseButton);
            _browser.Driver.WaitUntilElementNotVisible(AllocateUsersPage.CloseButton);
        }

        // private void ClickRefresh()
        // {
        //     _browser.Refresh();
        //     _browser.Driver.WaitUntilVisible(AllocateUsersPage.RefreshButton).Displayed.Should().BeTrue();
        //     _browser.Click(AllocateUsersPage.RefreshButton);
        //     Thread.Sleep(TimeSpan.FromSeconds(1));
        //     _browser.Driver.WaitUntilVisible(AllocateUsersPage.ExpiresAt(_c.Test.AllocateUsername)).Text.Trim().Should().NotBeNullOrEmpty();
        // }

        [Then(@"the user is no longer allocated")]
        public void ThenTheUserIsNoLongerAllocated()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.UnallocatedText).Displayed.Should().BeTrue();
            _c.Test.AllocateUsername = null;
        }

        [When(@"the user resets the users password")]
        public void WhenTheUserResetsTheUsersPassword()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.ResetButton(_c.Test.AllocateUsername)).Displayed.Should().BeTrue();
            _browser.Click(AllocateUsersPage.ResetButton(_c.Test.AllocateUsername));
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.CompletedTitle).Displayed.Should().BeTrue();
        }

        [When(@"the user attempts to add invalid days, hours and minutes")]
        public void WhenTheUserAttemptsToAddInvalidHoursAndMinutes()
        {
            SelectExpiry(30, 24, 60);
        }

        [Then(@"the days, hours and minutes error messages are displayed")]
        public void ThenHoursAndMinutesErrorMessagesAreDisplayed()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.DaysError).Displayed.Should().BeTrue();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.HoursError).Displayed.Should().BeTrue();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.MinutesError).Displayed.Should().BeTrue();
        }

        [When(@"the user attempts to add zero for days, hours and minutes")]
        public void WhenTheUserAttemptsToAddZeroForBothHoursAndMinutes()
        {
            SelectExpiry(0, 0, 0);
        }

        [Then(@"the zero days, hours and minutes error messages are displayed")]
        public void ThenTheZeroHoursAndMinutesErrorMessageIsDisplayed()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.TimeError).Displayed.Should().BeTrue();
        }

        [Then(@"the allocate button is disabled")]
        public void ThenTheAllocateButtonIsDisabled()
        {
            _browser.Driver.WaitUntilElementNotVisible(AllocateUsersPage.AllocateButton).Should().BeTrue();
        }

        [When(@"the user unallocates all users")]
        public void WhenTheUserUnallocatesAllUsers()
        {
            _browser.Click(AllocateUsersPage.UnallocateAllButton);
        }

        [Then(@"there a no users allocated")]
        public void ThenThereANoUsersAllocated()
        {
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.UnallocatedText).Displayed.Should().BeTrue();
            _c.Test.AllocateUsername = null;
            DismissThePopup();
            _browser.Driver.WaitUntilVisible(AllocateUsersPage.NoAllocationsMessage).Displayed.Should().BeTrue();
        }
    }
}
