import { AllocateUsersModel } from 'src/app/common/models/allocate.users.model';
import { Application, TestType, UserType } from '../../clients/api-client';
import { MapAllocateUsers } from './map-allocate-users';

describe('AllocateUserMapper', () => {
    it('should map the AllocateUsersModel to the AllocateUsersRequest', () => {
        const userTypes = [];
        userTypes.push(UserType.Judge);
        userTypes.push(UserType.Individual);
        userTypes.push(UserType.Representative);
        const allocateUsersModel: AllocateUsersModel = {
            allocated_by: 'user@hmcts.net',
            application: Application.AdminWeb,
            expiry_in_minutes: 10,
            is_prod_user: false,
            test_type: TestType.Manual,
            usertypes: userTypes
        };

        const request = MapAllocateUsers.map(allocateUsersModel);
        expect(request.allocated_by).toBe(allocateUsersModel.allocated_by);
        expect(request.application).toBe(allocateUsersModel.application);
        expect(request.expiry_in_minutes).toBe(allocateUsersModel.expiry_in_minutes);
        expect(request.is_prod_user).toBe(allocateUsersModel.is_prod_user);
        expect(request.test_type).toBe(allocateUsersModel.test_type);
        expect(request.user_types).toBe(allocateUsersModel.usertypes);
    });
});
