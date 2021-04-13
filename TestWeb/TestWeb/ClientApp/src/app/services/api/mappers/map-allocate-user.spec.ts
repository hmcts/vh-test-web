import { AllocateUserModel } from 'src/app/common/models/allocate.user.model';
import { Application, TestType, UserType } from '../../clients/api-client';
import { MapAllocateUser } from './map-allocate-user';

describe('AllocateUserMapper', () => {
    it('should map the AllocateUserModel to the AllocateUserRequest', () => {
        const userTypes = [];
        userTypes.push(UserType.Judge);
        userTypes.push(UserType.Individual);
        userTypes.push(UserType.Representative);
        const allocateUserModel: AllocateUserModel = {
            allocated_by: 'test@user.com',
            application: Application.AdminWeb,
            expiry_in_minutes: 10,
            is_ejud: false,
            is_prod_user: false,
            test_type: TestType.Manual,
            user_type: UserType.Individual
        };

        const request = MapAllocateUser.map(allocateUserModel);
        expect(request.allocated_by).toBe(allocateUserModel.allocated_by);
        expect(request.application).toBe(allocateUserModel.application);
        expect(request.expiry_in_minutes).toBe(allocateUserModel.expiry_in_minutes);
        expect(request.is_ejud).toBe(allocateUserModel.is_ejud);
        expect(request.is_prod_user).toBe(allocateUserModel.is_prod_user);
        expect(request.test_type).toBe(allocateUserModel.test_type);
        expect(request.user_type).toBe(allocateUserModel.user_type);
    });
});
