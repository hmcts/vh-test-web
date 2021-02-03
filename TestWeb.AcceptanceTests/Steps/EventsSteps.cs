using System;
using System.Data;
using System.Linq;
using System.Net;
using System.Threading;
using AcceptanceTests.Common.Api.Helpers;
using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using AcceptanceTests.Common.Test.Steps;
using FluentAssertions;
using OpenQA.Selenium;
using Polly;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;
using TestWeb.AcceptanceTests.Pages;
using TestWeb.TestApi.Client;

namespace TestWeb.AcceptanceTests.Steps
{
    [Binding]
    public class EventsSteps
    {
        private readonly UserBrowser _browser;
        private readonly TestContext _c;
        private readonly CommonSharedSteps _commonSharedSteps;
        private Guid _participantId;
        private ConferenceState _conferenceState = ConferenceState.NotStarted;
        private ParticipantState _participantState = ParticipantState.None;

        public EventsSteps(UserBrowser browser, TestContext testContext, CommonSharedSteps commonSharedSteps)
        {
            _browser = browser;
            _c = testContext;
            _commonSharedSteps = commonSharedSteps;
        }

        [When(@"the user sends a hearing event")]
        public void WhenTheUserSendsAHearingEvent()
        {
            SelectAConference();
            GetTheConferenceDetailsById();
            VerifyHearingDetails();
            VerifyParticipantDetails();
            SelectStartHearing();
            _browser.Driver.WaitUntilVisible(EventsPage.ConferenceDetailsTitle).Displayed.Should().BeTrue();
            ClickRefresh();
        }

        [When(@"the user sends a participant event")]
        public void WhenTheUserSendsAParticipantEvent()
        {
            SelectAConference();
            GetTheConferenceDetailsById();
            VerifyHearingDetails();
            VerifyParticipantDetails();
            _participantId = GetParticipantId();
            _participantId.Should().NotBeEmpty();
            _participantState = ParticipantState.InHearing;
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, EventsPage.ParticipantEventDropdown(_participantId), "Transfer");
            _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferFromTextfield(_participantId)).Displayed.Should().BeTrue();
            SetTheTransferFromAndTo("WaitingRoom", "HearingRoom");
            _browser.Click(EventsPage.ParticipantSendEventButton(_participantId));
        }

        private void SetTheTransferFromAndTo(string transferFrom, string transferTo)
        {
            _browser.Clear(EventsPage.ParticipantTransferFromTextfield(_participantId));
            _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferFromTextfield(_participantId)).SendKeys(transferFrom);
            _browser.Clear(EventsPage.ParticipantTransferToTextfield(_participantId));
            _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferToTextfield(_participantId)).SendKeys(transferTo);
        }

        private void SelectAConference()
        {
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, EventsPage.CaseNamesDropdown, _c.Test.CaseNames.First());
            ClickSelect();
            _browser.Driver.WaitUntilVisible(EventsPage.ConferenceDetailsTitle).Displayed.Should().BeTrue();
            ClickRefresh();
            _browser.Driver.WaitUntilVisible(EventsPage.ConferenceDetailsTitle).Displayed.Should().BeTrue();
        }

        private void ClickSelect()
        {
            _browser.Click(EventsPage.SelectButton);
        }

        private void ClickRefresh()
        {
            _browser.Click(EventsPage.RefreshConferenceButton);
        }

        private void GetTheConferenceDetailsById()
        {
            var conferenceId = _browser.Driver.WaitUntilVisible(EventsPage.ConferenceIdText).Text.Trim();
            conferenceId.Should().NotBeNullOrEmpty();
            var response = _c.TestApi.GetConferenceByConferenceId(Guid.Parse(conferenceId));
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            _c.Test.Conference = RequestHelper.Deserialise<ConferenceDetailsResponse>(response.Content);
        }

        private void VerifyHearingDetails()
        {
            _browser.Driver.WaitUntilVisible(EventsPage.HearingIdText).Text.Trim().Should().Be(_c.Test.Conference.Hearing_id.ToString());
            _browser.Driver.WaitUntilVisible(EventsPage.ConferenceIdText).Text.Trim().Should().Be(_c.Test.Conference.Id.ToString());
            _browser.Driver.WaitUntilVisible(EventsPage.ConferenceStatus).Text.Trim().Should().Be(_conferenceState.ToString());
        }

        private void VerifyParticipantDetails()
        {
            foreach (var participant in _c.Test.Conference.Participants)
            {
                _browser.Driver.WaitUntilVisible(EventsPage.ParticipantDisplayName(participant.Id)).Text.Trim().Should().Be(participant.Display_name);
                _browser.Driver.WaitUntilVisible(EventsPage.ParticipantUsername(participant.Id)).Text.Trim().Should().Be(participant.Username);
                _browser.Driver.WaitUntilVisible(EventsPage.ParticipantUserRole(participant.Id)).Text.Trim().Should().Be(participant.User_role.ToString());
                _browser.Driver.WaitUntilVisible(EventsPage.ParticipantId(participant.Id)).Text.Trim().Should().Be(participant.Id.ToString());
                _browser.Driver.WaitUntilVisible(EventsPage.ParticipantStatus(participant.Id)).Text.Trim().Should().Be(participant.Current_status.ToString());
            }
        }

        private void SelectStartHearing()
        {
            _conferenceState = ConferenceState.InSession;
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, EventsPage.HearingEventDropdown, "Start");
            _browser.Click(EventsPage.SendHearingEventButton);
        }

        [Then(@"the hearing status changes")]
        public void ThenTheHearingStatusChanges()
        {
            PollForStatusToUpdate(EventsPage.ConferenceStatus, _conferenceState.ToString()).Should().BeTrue();
        }

        [Then(@"the participant status changes")]
        public void ThenTheParticipantStatusChanges()
        {
            _participantId = GetParticipantId();
            _participantId.Should().NotBeEmpty();
            PollForStatusToUpdate(EventsPage.ParticipantStatus(_participantId), _participantState.ToString()).Should()
                .BeTrue();
        }

        private Guid GetParticipantId()
        {
            return _c.Test.Conference.Participants.First(x => x.User_role != UserRole.Judge).Id;
        }

        private bool PollForStatusToUpdate(By element, string expectedStatus)
        {
            const int RETRIES = 5;
            const int DELAY = 2;

            for (var i = 0; i < RETRIES; i++)
            {
                var status = string.Empty;

                Policy.Handle<StaleElementReferenceException>()
                    .Or<NoSuchElementException>()
                    .WaitAndRetry(2, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)))
                    .Execute(() => status = _browser.Driver.WaitUntilVisible(element).Text.Trim());
                
                if (status.Equals(expectedStatus))
                {
                    return true;
                }

                Thread.Sleep(TimeSpan.FromSeconds(DELAY));
                ClickRefresh();
            }
            throw new DataException($"Status not updated after {RETRIES * DELAY} seconds");
        }

        [When(@"the user attempts to send a transfer event with a blank transfer from and to")]
        public void WhenTheUserAttemptsToSendATransferEventWithABlankTransferFromAndTo()
        {
            SelectAConference();
            GetTheConferenceDetailsById();
            VerifyHearingDetails();
            VerifyParticipantDetails();
            _participantId = GetParticipantId();
            _participantId.Should().NotBeEmpty();
            _participantState = ParticipantState.InHearing;
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, EventsPage.ParticipantEventDropdown(_participantId), "Transfer");
            _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferFromTextfield(_participantId)).Displayed.Should().BeTrue();
            ClearTheTransferFromAndToTextFields();
        }

        private void ClearTheTransferFromAndToTextFields()
        {
            var transferFromText = _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferFromTextfield(_participantId)).GetAttribute("value");
            DeleteTextFromTextField.Delete(_browser, EventsPage.ParticipantTransferFromTextfield(_participantId), transferFromText.Length);
            var transferToText = _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferToTextfield(_participantId)).GetAttribute("value");
            DeleteTextFromTextField.Delete(_browser, EventsPage.ParticipantTransferToTextfield(_participantId), transferToText.Length);
        }

        [Then(@"the transfer from and to invalid error messages are displayed")]
        public void ThenTheTransferFromAndToInvalidErrorMessagesAreDisplayed()
        {
            _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferFromError(_participantId)).Displayed.Should().BeTrue();
            _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferToError(_participantId)).Displayed.Should().BeTrue();
        }

        [Then(@"the event cannot be sent")]
        public void ThenTheEventCannotBeSent()
        {
            _browser.Driver.WaitUntilVisible(EventsPage.ParticipantSendEventButton(_participantId)).Enabled.Should().BeFalse();
        }
    }
}
