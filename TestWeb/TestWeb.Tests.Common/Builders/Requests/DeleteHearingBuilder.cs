using TestApi.Contract.Requests;
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
                PartialHearingCaseName = DeleteData.PARTIAL_HEARING_CASE_NAME
            };
        }
        public DeleteTestHearingDataRequest Build()
        {
            return _request;
        }

    }
}
