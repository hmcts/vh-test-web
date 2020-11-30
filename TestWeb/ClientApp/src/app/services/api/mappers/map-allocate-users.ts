import { AllocateUsersModel } from 'src/app/common/models/allocate.users.model';
import { AllocateUsersRequest, Application, TestType, UserType } from '../../clients/api-client';

export class MapAllocateUsers {

  public static map(model: AllocateUsersModel): AllocateUsersRequest {
    const request = new AllocateUsersRequest();
    request.application = Application[model.application];
    request.expiry_in_minutes = model.expiry_in_minutes;
    request.is_prod_user = model.is_prod_user;
    request.test_type = TestType[model.test_type];
    request.user_types = this.convertUserTypesArray(model.usertypes);
    return request;
  }

  private static convertUserTypesArray(userTypes: string[]): UserType[] {
    const userTypesArray = [];
    userTypes.forEach(userType => {
      userTypesArray.push(UserType[userType]);
    });
    return userTypesArray;
  }
}
