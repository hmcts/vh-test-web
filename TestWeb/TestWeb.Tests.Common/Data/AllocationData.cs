using System;
using TestApi.Contract.Enums;

namespace TestWeb.Tests.Common.Data
{
    public static class AllocationData
    {
        public const bool ALLOCATED = false;
        public const string ALLOCATED_BY = "user@user.com";
        public static Application APPLICATION = Application.VideoWeb;
        public static DateTime EXPIRES_AT = DateTime.UtcNow.AddMinutes(1);
        public static int EXPIRY_IN_MINUTES = 0;
        public static TestType TEST_TYPE = TestType.Manual;
    }
}
