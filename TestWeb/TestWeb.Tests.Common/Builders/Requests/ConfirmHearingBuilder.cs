using BookingsApi.Contract.Requests;
using BookingsApi.Contract.Requests.Enums;
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
                CancelReason = null,
                Status = UpdateBookingStatus.Created,
                UpdatedBy = HearingsData.UPDATED_BY
            };
        }

        public UpdateBookingStatusRequest Build()
        {
            return _request;
        }
    }
}