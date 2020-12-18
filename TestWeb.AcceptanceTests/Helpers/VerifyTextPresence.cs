using System;
using System.Data;
using System.Linq;
using System.Threading;
using AcceptanceTests.Common.Driver.Drivers;
using AcceptanceTests.Common.Driver.Helpers;
using OpenQA.Selenium;

namespace TestWeb.AcceptanceTests.Helpers
{
    public static class VerifyTextPresence
    {
        public static void Verify(UserBrowser browser, By element, string expected, int numberOfHearings)
        {
            const int RETRIES = 20;
            const int DELAY = 2;

            for (var i = 0; i < RETRIES; i++)
            {
                var actual = browser.Driver.WaitUntilVisible(element).GetProperty("value");
                actual = actual.Replace("\r\n", ".");

                var sentences = actual.Split(new[] { '.', ':', '\'' });

                var wordsToMatch = new[] { expected };

                var sentenceQuery = from sentence in sentences
                    let w = sentence.Split(new[] { '.' },
                        StringSplitOptions.RemoveEmptyEntries)
                    where w.Distinct().Intersect(wordsToMatch).Count() == wordsToMatch.Count()
                    select sentence;

                if (sentenceQuery.Count().Equals(numberOfHearings))
                {
                    return;
                }

                Thread.Sleep(TimeSpan.FromSeconds(DELAY));
            }

            throw new DataException($"Failed to find {numberOfHearings} occurrence(s) of the expected text '{expected}' after {RETRIES * DELAY} seconds");
        }
    }
}
