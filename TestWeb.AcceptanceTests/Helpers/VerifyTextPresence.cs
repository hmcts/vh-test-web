﻿using System;
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
            const int RETRIES = 10;
            const int DELAY = 2;
            var actual = "";

            for (var i = 0; i < RETRIES; i++)
            {
                actual = browser.Driver.WaitUntilVisible(element).GetProperty("value");
                actual = actual.Replace("\r\n", ".");
                actual = actual.Replace("\n", ".");

                var sentences = actual.Split('.', ':', '\'');

                var count = sentences.Count(sentence => sentence.Contains(expected));

                if (count.Equals(numberOfHearings))
                {
                    return;
                }

                Thread.Sleep(TimeSpan.FromSeconds(DELAY));
            }

            throw new DataException($"Failed to find {numberOfHearings} occurrence(s) of the expected text '{expected}' after {RETRIES * DELAY} seconds. Text was '{actual}'");
        }

        public static void VerifyOnce(UserBrowser browser, By element, string expected)
        {
            const int RETRIES = 10;
            const int DELAY = 2;
            var actual = "";

            for (var i = 0; i < RETRIES; i++)
            {
                actual = browser.Driver.WaitUntilVisible(element).GetProperty("value");
                actual = actual.Replace("\r\n", ".");
                actual = actual.Replace("\n", ".");

                if (actual.Contains(expected))
                {
                    return;
                }

                Thread.Sleep(TimeSpan.FromSeconds(DELAY));
            }

            throw new DataException($"Failed to find the expected text '{expected}' after {RETRIES * DELAY} seconds. Text was '{actual}'");
        }
    }
}
