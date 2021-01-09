using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class SummaryPage
    {
        public static By CaseName(int i) => By.Id($"case-name-{i}");
        public static By CaseNumber(int i) => By.Id($"case-number-{i}");
        public static By ScheduledDate(int i) => By.Id($"scheduled-date-{i}");
        public static By HearingId(int i) => By.Id($"hearing-id-{i}");
        public static By ConferenceId(int i) => By.Id($"conference-id-{i}");
        public static By ParticipantUsername(int i, int j) => By.Id($"hearing-{i}-participant-{j}-username");
        public static By ParticipantPassword(int i, int j) => By.Id($"hearing-{i}-participant-{j}-password");
        public static By EndpointDisplayName(int i, int j) => By.Id($"hearing-{i}-endpoint-{j}-display-name");
        public static By EndpointSipAddress(int i, int j) => By.Id($"hearing-{i}-endpoint-{j}-sip-address");
        public static By EndpointPin(int i, int j) => By.Id($"hearing-{i}-endpoint-{j}-pin");
        public static By CopyButton(int i) => By.Id($"copy-hearing-button-{i}");
        public static By BackLink = By.Id("backLink");
    }
}
