using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class CreateHearingPage
    {
        public static readonly By NumberOfHearingsDropdown = By.Id("quantityDropdown");
        public static readonly By BookAndConfirmButton = By.Id("bookButton");
        public static readonly By ProgressTextfield = By.Id("progressTextfield");
        public static readonly By SummaryTextfield = By.Id("summaryTextfield");
        public static readonly By HearingStartTimeHour = By.Id("hearingStartTimeHour");
        public static readonly By HearingStartTimeMinute = By.Id("hearingStartTimeMinute");
        public static readonly By HearingTimeError = By.Id("hearingTime-error");
    }
}
