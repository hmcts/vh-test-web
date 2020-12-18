namespace TestWeb.Common.Configuration
{
    public class HearingServicesConfiguration
    {
        public string TestApiResourceId { get; set; }
        public string TestApiUrl { get; set; }
        public string TestWebUrl { get; set; }
        public bool RunningTestApiLocally { get; set; }
        public bool RunningTestWebLocally { get; set; }
    }
}
