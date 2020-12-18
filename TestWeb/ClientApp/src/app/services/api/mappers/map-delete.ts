import { ConfirmHearingModel } from 'src/app/common/models/confirm.hearing.model';
import { DeleteModel } from 'src/app/common/models/delete-model';
import { DeleteTestHearingDataRequest } from '../../clients/api-client';

export class MapDelete {

  public static map(model: DeleteModel): DeleteTestHearingDataRequest {
    const request = new DeleteTestHearingDataRequest();
    request.partial_hearing_case_name = model.case_name;
    request.limit = model.limit;
    return request;
  }
}
