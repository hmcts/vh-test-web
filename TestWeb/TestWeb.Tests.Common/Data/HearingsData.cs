using TestWeb.TestApi.Client;

namespace TestWeb.Tests.Common.Data
{
    public static class HearingsData
    {
        public const bool AUDIO_RECORDING_REQUIRED = false;
        public const Application APPLICATION = Application.VideoWeb;
        public const bool IS_LEAD_CASE = false;
        public const string CASE_NAME = "Test Case Name";
        public const string CASE_NUMBER = "Test Case Number";
        public const string CASE_TYPE = "Civil Money Claims";
        public const string CREATED_BY = "CreatedBy";
        public const string HEARING_ROOM_NAME = "Room 1";
        public const BookingStatus HEARING_STATUS = BookingStatus.Booked;
        public const string HEARING_TYPE_NAME = "Application to Set Judgment Aside";
        public const int LIMIT = 2000;
        public const string OTHER_INFORMATION = "Other information";
        public const bool QUESTIONNAIRE_NOT_REQUIRED = true;
        public const int SCHEDULED_DURATION = 45;
        public const TestType TEST_TYPE = TestType.Manual;
        public const string UPDATED_BY = "UpdatedBy";
        public const string VENUE = "Birmingham";
    }
}
