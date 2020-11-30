import { HearingModel } from 'src/app/common/models/hearing.model';
import { UserModel } from 'src/app/common/models/user.model';
import { CreateHearingRequest, TestType, User } from '../../clients/api-client';

export class MapHearing {

  public static map(model: HearingModel): CreateHearingRequest {
    const request = new CreateHearingRequest();
    request.application = model.application;
    request.audio_recording_required = model.audio_recording_required;
    request.case_type = model.case_type;
    request.questionnaire_not_required = model.audio_recording_required;
    request.scheduled_date_time = model.scheduled_date_time;
    request.test_type = TestType[model.test_type];
    request.users = this.mapUser(model.users);
    request.venue = model.venue;
    return request;
  }

  private static mapUser(userModels: UserModel[]): User[] {
    const users = [];
    userModels.forEach(userModel => {
      const user = new User();
      user.application = userModel.application;
      user.contact_email = userModel.contact_email;
      user.created_date = userModel.created_date;
      user.display_name = userModel.display_name;
      user.first_name = userModel.first_name;
      user.is_prod_user = userModel.is_prod_user;
      user.last_name = userModel.last_name;
      user.number = userModel.number;
      user.test_type = userModel.test_type;
      user.user_type = userModel.user_type;
      user.username = userModel.username;
      users.push(user);
    });
    return users;
  }
}
