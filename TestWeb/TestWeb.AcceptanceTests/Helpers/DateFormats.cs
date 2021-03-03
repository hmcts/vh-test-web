using System.Globalization;

namespace TestWeb.AcceptanceTests.Helpers
{
    public static class DateFormats
    {
        public static string LocalDateFormat(bool runningOnSaucelabs)
        {
            if (runningOnSaucelabs) return new CultureInfo("es-PR").DateTimeFormat.ShortDatePattern;
            return CultureInfo.CurrentCulture.Name.ToLower().Equals("en-us") || CultureInfo.CurrentCulture.TwoLetterISOLanguageName.ToLower().Equals("iv")
                ? new CultureInfo("en-GB").DateTimeFormat.ShortDatePattern
                : CultureInfo.CurrentUICulture.DateTimeFormat.ShortDatePattern;
        }
    }
}
