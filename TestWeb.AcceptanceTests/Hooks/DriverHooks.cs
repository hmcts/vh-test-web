using System.Linq;
using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Enums;
using AcceptanceTests.Common.Driver.Helpers;
using AcceptanceTests.Common.Driver.Settings;
using AcceptanceTests.Common.PageObject.Pages;
using BoDi;
using FluentAssertions;
using TechTalk.SpecFlow;
using TestWeb.AcceptanceTests.Helpers;
using TimeZone = AcceptanceTests.Common.Data.Time.TimeZone;

namespace TestWeb.AcceptanceTests.Hooks
{
    [Binding]
    public class DriverHooks
    {
        private UserBrowser _browser;
        private readonly IObjectContainer _objectContainer;

        public DriverHooks(IObjectContainer objectContainer)
        {
            _objectContainer = objectContainer;
        }

        [BeforeScenario(Order = (int)HooksSequence.InitialiseBrowserHooks)]
        public void InitialiseBrowserContainer()
        {
            _browser = new UserBrowser();
            _objectContainer.RegisterInstanceAs(_browser);
        }

        [BeforeScenario(Order = (int) HooksSequence.ConfigureDriverHooks)]
        public void ConfigureDriver(TestContext context, ScenarioContext scenario)
        {
            DriverManager.KillAnyLocalDriverProcesses();
            context.Config.TestSettings.TargetBrowser = DriverManager.GetTargetBrowser(NUnit.Framework.TestContext.Parameters["TargetBrowser"]);
            context.Config.TestSettings.TargetBrowserVersion = NUnit.Framework.TestContext.Parameters["TargetBrowserVersion"];
            context.Config.TestSettings.TargetDevice = DriverManager.GetTargetDevice(NUnit.Framework.TestContext.Parameters["TargetDevice"]);
            context.Config.TestSettings.TargetDeviceName = NUnit.Framework.TestContext.Parameters["TargetDeviceName"];
            context.Config.TestSettings.TargetOS = DriverManager.GetTargetOS(NUnit.Framework.TestContext.Parameters["TargetOS"]);

            var driverOptions = new DriverOptions()
            {
                TargetBrowser = context.Config.TestSettings.TargetBrowser,
                TargetBrowserVersion = context.Config.TestSettings.TargetBrowserVersion,
                TargetDevice = context.Config.TestSettings.TargetDevice,
                TargetOS = context.Config.TestSettings.TargetOS
            };

            var sauceLabsOptions = new SauceLabsOptions()
            {
                EnableLogging = EnableLogging(context.Config.TestSettings.TargetOS, context.Config.TestSettings.TargetBrowser, scenario.ScenarioInfo),
                Name = scenario.ScenarioInfo.Title
            };

            context.Driver = new DriverSetup(context.Config.SauceLabsConfiguration, driverOptions, sauceLabsOptions);
        }

        private static bool EnableLogging(TargetOS os, TargetBrowser browser, ScenarioInfo scenario)
        {
            if (os == TargetOS.Windows && browser == TargetBrowser.Firefox)
            {
                return false;
            }
            return !scenario.Tags.Contains("DisableLogging");
        }

        [BeforeScenario(Order = (int)HooksSequence.SetTimeZone)]
        public void SetTimeZone(TestContext context)
        {
            context.TimeZone = new TimeZone(context.Config.SauceLabsConfiguration.RunningOnSauceLabs(), context.Config.TestSettings.TargetOS);
        }

        [AfterScenario(Order = (int) HooksSequence.SignOutHooks)]
        public void SignOutIfPossible(TestContext context)
        {
            if (context.CurrentUser == null) return;
            if (_browser?.Driver == null) return;
            if (SignOutLinkIsPresent())
                SignOut();
        }

        public bool SignOutLinkIsPresent()
        {
            try
            {
                _browser.Driver.FindElement(CommonPages.SignOutLink, 2);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private void SignOut()
        {
            try
            {
                _browser.ClickLink(CommonPages.SignOutLink, 2);
                _browser.Driver.WaitUntilVisible(CommonPages.SignOutMessage).Displayed.Should().BeTrue();
            }
            catch
            {
                NUnit.Framework.TestContext.WriteLine($"Attempted to sign out but link no longer visible");
            }
        }

        [AfterScenario(Order = (int)HooksSequence.LogResultHooks)]
        public void LogResult(TestContext context, ScenarioContext scenarioContext)
        {
            _browser ??= new UserBrowser()
                .SetBaseUrl(context.Config.Services.TestWebUrl)
                .SetTargetDevice(context.Config.TestSettings.TargetDevice)
                .SetTargetBrowser(context.Config.TestSettings.TargetBrowser)
                .SetDriver(context.Driver);

            DriverManager.LogTestResult(
                context.Config.SauceLabsConfiguration.RunningOnSauceLabs(),
                _browser.Driver,
                scenarioContext.TestError == null);
        }

        [AfterScenario(Order = (int)HooksSequence.TearDownBrowserHooks)]
        public void TearDownBrowser()
        {
            _browser?.BrowserTearDown();
            DriverManager.KillAnyLocalDriverProcesses();
        }
    }
}
