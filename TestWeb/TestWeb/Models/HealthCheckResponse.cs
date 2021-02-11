using System.Collections;

namespace TestWeb.Models
{
    public class HealthCheckResponse
    {
        public HealthCheckResponse()
        {
            TestApiHealth = new HealthCheck();
            AppVersion = new ApplicationVersion();
        }

        public HealthCheck TestApiHealth { get; set; }
        public ApplicationVersion AppVersion { get; set; }
    }

    public class HealthCheck
    {
        public bool Successful { get; set; }
        public string ErrorMessage { get; set; }
        public IDictionary Data { get; set; }
    }

    public class ApplicationVersion
    {
        public string FileVersion { get; set; }
        public string InformationVersion { get; set; }
    }
}
