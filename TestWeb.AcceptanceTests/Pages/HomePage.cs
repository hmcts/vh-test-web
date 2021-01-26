﻿using System;
using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Pages
{
    public static class HomePage
    {
        public static By CaseName(string caseName) => By.XPath($"//td[contains(text(),'{caseName}')]");
        public static By ManualAllocatedUsers = By.XPath($"//td[contains(text(),'manual_')]");
        public static By FirstManualAllocatedUser = By.XPath($"//td[contains(text(),'manual_')][1]");
        public static By DeleteButton(Guid hearingId) => By.Id($"{hearingId:D}-delete-button");
        public static By UnallocateButton(string username) => By.Id($"{username}-unallocate-button");
        public static By ResetPasswordButton(string username) => By.Id($"{username}-reset-button");
        public static By ResetTitle = By.Id("resetTitle");
        public static By ResetUsername = By.Id("reset-username");
        public static By NewPassword = By.Id("reset-password");
    }
}
