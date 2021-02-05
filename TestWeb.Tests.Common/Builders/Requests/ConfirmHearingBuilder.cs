using System.Collections.Generic;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Requests
{
    public class ConfirmHearingBuilder
    {
        private readonly UpdateBookingStatusRequest _request;

        public ConfirmHearingBuilder()
        {
            _request = new UpdateBookingStatusRequest()
            {
                Cancel_reason = null,
                Status = UpdateBookingStatus.Created,
                Updated_by = HearingsData.UPDATED_BY
            };
        }

        public UpdateBookingStatusRequest Build()
        {
            return _request;
        }
    }
}