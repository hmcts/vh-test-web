using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class HeaderPage
    {
        public static readonly By HomeLink = By.PartialLinkText("Home");
        public static readonly By CreateHearingsLink = By.PartialLinkText("Create Hearings");
        public static readonly By DeleteHearingsLink = By.PartialLinkText("Delete Hearings");
        public static readonly By EventsLink = By.PartialLinkText("Events");
        public static readonly By AllocateUserLink = By.PartialLinkText("Allocate Users");
    }
}
