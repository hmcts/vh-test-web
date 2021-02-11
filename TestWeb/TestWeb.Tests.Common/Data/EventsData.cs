using TestWeb.Common.Enums;
using TestWeb.TestApi.Client;

namespace TestWeb.Tests.Common.Data
{
    public static class EventsData
    {
        public static string PHONE = "1234";
        public static string REASON = "Test event";
        public static EventType EVENT_TYPE = EventType.None;
        public static string TRANSFER_FROM = RoomType.WaitingRoom.ToString();
        public static string TRANSFER_TO = RoomType.ConsultationRoom1.ToString();
    }
}
