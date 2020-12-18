import { AllocateUsersModel } from 'src/app/common/models/allocate.users.model';
import { AllocateUsersRequest } from '../../clients/api-client';

export class MapAllocateUsers {
    public static map(model: AllocateUsersModel): AllocateUsersRequest {
        const request = new AllocateUsersRequest();
        request.application = model.application;
        request.expiry_in_minutes = model.expiry_in_minutes;
        request.is_prod_user = model.is_prod_user;
        request.test_type = model.test_type;
        request.user_types = model.usertypes;
        return request;
    }
}
