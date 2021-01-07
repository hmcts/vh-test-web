using System;
using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class EventsPage
    {
        public static readonly By CaseNamesDropdown = By.Id("caseNamesDropdown");
        public static readonly By SelectButton = By.Id("selectButton");
        public static readonly By RefreshConferenceButton = By.Id("refreshConferenceDetailsButton");
        public static readonly By ConferenceDetailsTitle = By.Id("conferenceTitle");
        public static readonly By HearingIdText = By.Id("hearing-id");
        public static readonly By ConferenceIdText = By.Id("conference-id");
        public static readonly By ConferenceStatus = By.Id("conference-status");
        public static readonly By HearingEventDropdown = By.Id("hearingEventTypeDropdown");
        public static readonly By SendHearingEventButton = By.Id("sendHearingEventButton");
        public static By ParticipantDisplayName(Guid participantId) => By.Id($"participant-{participantId}-display-name");
        public static By ParticipantUsername(Guid participantId) => By.Id($"participant-{participantId}-username");
        public static By ParticipantUserRole(Guid participantId) => By.Id($"participant-{participantId}-user-role");
        public static By ParticipantId(Guid participantId) => By.Id($"participant-{participantId}-id");
        public static By ParticipantStatus(Guid participantId) => By.Id($"participant-{participantId}-status");
        public static By ParticipantEventDropdown(Guid participantId) => By.Id($"participant-event-type-dropdown-{participantId}");
        public static By ParticipantTransferFromDropdown(Guid participantId) => By.Id($"participant-transfer-from-dropdown-{participantId}");
        public static By ParticipantTransferToDropdown(Guid participantId) => By.Id($"participant-transfer-to-dropdown-{participantId}");
        public static By ParticipantSendEventButton(Guid participantId) => By.Id($"send-participant-event-button-{participantId}");
    }
}
