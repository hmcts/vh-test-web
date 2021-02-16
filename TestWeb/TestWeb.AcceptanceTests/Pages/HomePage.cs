using System;
using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class HomePage
    {
        public static By CaseName(string caseName) => By.XPath($"//td[contains(text(),'{caseName}')]");
        public static readonly By ManualAllocatedUsers = By.XPath($"//div[@class='govuk-grid-column-full' and ./h1[text()='Your Allocated Users']]//tbody/tr");
        public static readonly By FirstManualAllocatedUser = By.XPath($"//div[@class='govuk-grid-column-full' and ./h1[text()='Your Allocated Users']]//tbody/tr[1]/td[contains(@id,'username')]");
        public static By DeleteButton(Guid hearingId) => By.Id($"{hearingId:D}-delete-button");
        public static By UnallocateButton(string username) => By.Id($"{username}-unallocate-button");
        public static By ResetPasswordButton(string username) => By.Id($"{username}-reset-button");
        public static readonly By ResetTitle = By.Id("resetTitle");
        public static readonly By ResetUsername = By.Id("reset-username");
        public static readonly By NewPassword = By.Id("reset-password");
    }
}
