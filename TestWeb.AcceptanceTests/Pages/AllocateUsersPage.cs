using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class AllocateUsersPage
    {
        public static By TestTypeDropdown = By.Id("testTypesDropdown");
        public static By UserTypeDropdown = By.Id("userTypesDropdown");
        public static By DaysTextfield = By.Id("daysTextfield");
        public static By HoursTextfield = By.Id("hoursTextfield");
        public static By MinutesTextfield = By.Id("minutesTextfield");
        public static By AllocateButton = By.Id("allocateButton");
        public static By RefreshButton = By.Id("refreshButton");
        public static By Username(string username) => By.Id($"{username}-username");
        public static By ExpiresAt(string username) => By.Id($"{username}-expiry-at");
        public static By ResetButton(string username) => By.Id($"{username}-reset-button");
        public static By UnallocateButton(string username) => By.Id($"{username}-unallocate-button");
        public static By ResetUsername = By.Id("reset-username");
        public static By ResetPassword = By.Id("reset-password");
        public static By CloseButton = By.Id("closeButton");
        public static By CompletedTitle = By.Id("completedTitle");
        public static By UnallocatedText = By.Id("unallocatedText");
        public static By TimeError = By.Id("time-error");
        public static By DaysError = By.Id("days-error");
        public static By HoursError = By.Id("hours-error");
        public static By MinutesError = By.Id("minutes-error");
        public static By UnallocateAllButton = By.Id("unallocateAllButton");
        public static By NoAllocationsMessage = By.Id("noAllocationsMessage");
    }
}
