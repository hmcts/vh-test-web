using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Requests
{
    public class DeleteHearingBuilder
    {
        private readonly DeleteTestHearingDataRequest _request;

        public DeleteHearingBuilder()
        {
            _request = new DeleteTestHearingDataRequest()
            {
                Limit = DeleteData.LIMIT,
                Partial_hearing_case_name = DeleteData.PARTIAL_HEARING_CASE_NAME
            };
        }
        public DeleteTestHearingDataRequest Build()
        {
            return _request;
        }

    }
}
