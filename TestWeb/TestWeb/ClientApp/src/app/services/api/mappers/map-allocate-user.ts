import { AllocateUserModel } from 'src/app/common/models/allocate.user.model';
import { AllocateUserRequest } from '../../clients/api-client';

export class MapAllocateUser {
    public static map(model: AllocateUserModel): AllocateUserRequest {
        const request = new AllocateUserRequest();
        request.allocated_by = model.allocated_by;
        request.application = model.application;
        request.expiry_in_minutes = model.expiry_in_minutes;
        request.is_prod_user = model.is_prod_user;
        request.test_type = model.test_type;
        request.user_type = model.user_type;
        return request;
    }
}
