using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class DeleteHearingPage
    {
        public static readonly By CaseNameText = By.Id("caseNameTextfield");
        public static readonly By CaseNameError = By.Id("caseNameNotContainingTest-error");
        public static readonly By ResultsTextfield = By.Id("resultsTextfield");
        public static readonly By DeleteButton = By.Id("deleteButton");
    }
}
