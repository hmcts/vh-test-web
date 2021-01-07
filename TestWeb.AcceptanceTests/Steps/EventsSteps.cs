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
            var participantId = GetParticipantId();
            participantId.Should().NotBeEmpty();
            _participantState = ParticipantState.InHearing;
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, EventsPage.ParticipantEventDropdown(participantId), "Transfer");
            _browser.Driver.WaitUntilVisible(EventsPage.ParticipantTransferFromDropdown(participantId)).Displayed.Should().BeTrue();
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, EventsPage.ParticipantTransferFromDropdown(participantId), "WaitingRoom");
            _commonSharedSteps.WhenTheUserSelectsTheOptionFromTheDropdown(_browser.Driver, EventsPage.ParticipantTransferToDropdown(participantId), "HearingRoom");
            _browser.Click(EventsPage.ParticipantSendEventButton(participantId));
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
            var participantId = GetParticipantId();
            participantId.Should().NotBeEmpty();
            PollForStatusToUpdate(EventsPage.ParticipantStatus(participantId), _participantState.ToString()).Should()
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
                var status = _browser.Driver.WaitUntilVisible(element).Text.Trim();

                if (status.Equals(expectedStatus))
                {
                    return true;
                }

                Thread.Sleep(TimeSpan.FromSeconds(DELAY));
                ClickRefresh();
            }
            throw new DataException($"Status not updated after {RETRIES * DELAY} seconds");
        }
    }
}
