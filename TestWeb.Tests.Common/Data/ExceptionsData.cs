using System;
using TestWeb.TestApi.Client;

namespace TestWeb.Tests.Common.Data
{
    public static class ExceptionsData
    {
        public static AggregateException EXCEPTION = new AggregateException("Api Error");
        public static TestApiException NOT_FOUND_EXCEPTION = new TestApiException("Not Found Exception", 404, null, null, null);
        public static TestApiException INTERNAL_SERVER_EXCEPTION = new TestApiException("Internal Server Error", 500, null, null, null);
    }
}
