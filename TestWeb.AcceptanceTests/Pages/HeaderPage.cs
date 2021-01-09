using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class HeaderPage
    {
        public static readonly By DeleteHearingsLink = By.PartialLinkText("Delete Hearings");
        public static readonly By EventsLink = By.PartialLinkText("Events");
    }
}
