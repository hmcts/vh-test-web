using System;
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
    public class HomeSteps
    {
        private readonly UserBrowser _browser;
        private readonly TestContext _c;
        private string _username;

        public HomeSteps(UserBrowser browser, TestContext testContext)
        {
            _browser = browser;
            _c = testContext;
        }

        [Then(@"the user can see the created hearing")]
        public void ThenTheUserCanSeeTheCreatedHearing()
        {
            _browser.Driver.WaitUntilVisible(HomePage.CaseName(_c.Test.CaseNames.Single())).Displayed.Should().BeTrue();
        }

        [Then(@"the user can see the allocated users")]
        public void ThenTheUserCanSeeThe()
        {
            _browser.Driver.WaitUntilElementsVisible(HomePage.ManualAllocatedUsers).Count.Should().BeGreaterThan(0);
        }

        [When(@"the user deletes the newly created hearing")]
        public void WhenTheUserDeletesTheNewlyCreatedHearing()
        {
            var hearingId = GetTheHearingId();
            _browser.Click(HomePage.DeleteButton(hearingId));
        }

        private Guid GetTheHearingId()
        {
            var idAsString = _browser.Driver.WaitUntilVisible(HomePage.CaseName(_c.Test.CaseNames.Single())).GetAttribute("id");
            idAsString = idAsString.Replace("-case-name", string.Empty);
            return Guid.Parse(idAsString);
        }

        [Then(@"the hearing is deleted")]
        public void ThenTheHearingIsDeleted()
        {
            _browser.Driver.WaitUntilElementNotVisible(HomePage.CaseName(_c.Test.CaseNames.Single())).Should().BeTrue();
        }

        [When(@"the user unallocates a user")]
        public void WhenTheUserUnallocatesAUser()
        {
            _browser.Driver.WaitUntilElementsVisible(HomePage.ManualAllocatedUsers).Count.Should().BeGreaterThan(0);
            _username = GetTheFirstAllocatedUsername();
            _browser.Click(HomePage.UnallocateButton(_username));
        }

        [Then(@"the user is unallocated")]
        public void ThenTheUserIsUnallocated()
        {
            _browser.Driver.WaitUntilElementNotVisible(HomePage.UnallocateButton(_username)).Should().BeTrue();
        }

        private string GetTheFirstAllocatedUsername()
        {
            return _browser.Driver.WaitUntilVisible(HomePage.FirstManualAllocatedUser).Text.Trim();
        }

        [When(@"the user resets a users password")]
        public void WhenTheUserResetsAUsersPassword()
        {
            _browser.Driver.WaitUntilElementsVisible(HomePage.ManualAllocatedUsers).Count.Should().BeGreaterThan(0);
            _username = GetTheFirstAllocatedUsername();
            _browser.Click(HomePage.ResetPasswordButton(_username));
        }

        [Then(@"the new password details are displayed")]
        public void ThenTheNewPasswordDetailsAreDisplayed()
        {
            _browser.Driver.WaitUntilVisible(HomePage.ResetTitle).Displayed.Should().BeTrue();
            _browser.Driver.WaitUntilVisible(HomePage.ResetUsername).Text.Trim().Should().Be(_username);
            _browser.Driver.WaitUntilVisible(HomePage.NewPassword).Text.Trim().Length.Should().BeGreaterThan(0);
        }
    }
}
