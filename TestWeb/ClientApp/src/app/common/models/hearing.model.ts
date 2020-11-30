import { Application } from 'src/app/services/clients/api-client';
import { UserModel } from './user.model';

export class HearingModel {
  constructor() {
    this.application = Application.VideoWeb;
    this.users = [];
  }

  application: Application | undefined;
  audio_recording_required?: boolean;
  case_type: string | undefined;
  questionnaire_not_required: boolean;
  scheduled_date_time?: Date | undefined;
  test_type: string | undefined;
  users: UserModel[] | undefined;
  venue: string | undefined;
}
