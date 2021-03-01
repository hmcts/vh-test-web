using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class CreateHearingPage
    {
        public static readonly By CustomCaseNameTextfield = By.Id("customCaseNamePrefix");
        public static readonly By NumberOfHearingsDropdown = By.Id("quantityDropdown");
        public static readonly By NumberOfEndpointsDropdown = By.Id("endpointsDropdown");
        public static readonly By BookAndConfirmButton = By.Id("bookButton");
        public static readonly By HearingDate = By.Id("hearingDate");
        public static readonly By HearingStartTimeHour = By.Id("hearingStartTimeHour");
        public static readonly By HearingStartTimeMinute = By.Id("hearingStartTimeMinute");
        public static readonly By HearingTimeError = By.Id("hearingTime-error");
        public static readonly By HearingTimeExceedsMaxError = By.Id("hearingDateExceedsMax-error");
        public static readonly By IndividualsTextfield = By.Id("individualsTextfield");
        public static readonly By InterpretersTextfield = By.Id("interpretersTextfield");
        public static readonly By RepresentativesTextfield = By.Id("representativesTextfield");
        public static readonly By ObserversTextfield = By.Id("observersTextfield");
        public static readonly By PanelMembersTextfield = By.Id("panelMembersTextfield");
        public static readonly By WitnessesTextfield = By.Id("witnessesTextfield");
        public static readonly By ProgressDialog = By.Id("progressDialog");
        public static readonly By InProgressTitle = By.Id("inProgressTitle");
        public static readonly By CompleteTitle = By.Id("completeTitle");
        public static By NumberOfCaseNames => By.XPath("//div[@class='govuk-summary-list__row']");
        public static By CaseName(int i) => By.Id($"hearing-{i}");
        public static readonly By ContinueButton = By.Id("continueButton");
        public static readonly By InvalidIndividualsError = By.Id("individualsInvalid-error");
        public static readonly By InvalidRepsError = By.Id("representativesInvalid-error");
        public static readonly By InvalidObserversError = By.Id("observersInvalid-error");
        public static readonly By InvalidPanelMembersError = By.Id("panelMembersInvalid-error");
        public static readonly By InvalidNumberOfIndividualsAndRepsError = By.Id("noIndividualsOrReps-error");
        public static readonly By MoreInterpretersThanIndividualsError = By.Id("moreInterpretersThanIndividuals-error");
    }
}
