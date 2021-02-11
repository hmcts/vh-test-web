namespace TestWeb.Tests.Common.Configuration
{
    public static class ApiUriFactory
    {
        public static class HealthCheckEndpoints
        {
            private const string ApiRoot = "/health";
            public static string CheckServiceHealth => $"{ApiRoot}/health";
        }
    }
}
