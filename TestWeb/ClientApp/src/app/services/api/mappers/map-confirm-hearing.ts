import { ConfirmHearingModel } from 'src/app/common/models/confirm.hearing.model';
import { UpdateBookingStatusRequest } from '../../clients/api-client';

export class MapConfirmHearing {

  public static map(model: ConfirmHearingModel): UpdateBookingStatusRequest {
    const request = new UpdateBookingStatusRequest();
    request.cancel_reason = model.cancel_reason;
    request.status = model.status;
    request.updated_by = model.updated_by;
    return request;
  }
}
