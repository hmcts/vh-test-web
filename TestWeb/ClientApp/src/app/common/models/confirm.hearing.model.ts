import { UpdateBookingStatus } from 'src/app/services/clients/api-client';

export class ConfirmHearingModel {
  constructor(updatedBy: string) {
    this.updated_by = updatedBy;
    this.status = UpdateBookingStatus.Created;
    this.cancel_reason = null;
  }

  updated_by: string | undefined;
  status: UpdateBookingStatus | undefined;
  cancel_reason: string | undefined;
}
