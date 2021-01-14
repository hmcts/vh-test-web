using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using FluentAssertions;
using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Helpers
{
    public static class DeleteTextFromTextField
    {
        public static void Delete(UserBrowser browser, By element, int textLength)
        {
            textLength.Should().BeGreaterThan(0);
            for (var i = 0; i < textLength; i++)
            {
                browser.Driver.WaitUntilVisible(element).SendKeys(Keys.Backspace);
            }
        }
    }
}
