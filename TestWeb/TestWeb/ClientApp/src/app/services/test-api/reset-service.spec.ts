import { UserModel } from 'src/app/common/models/user.model';
import { Application, TestType, UpdateUserResponse, UserType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { ResetService } from './reset-service';
import { TestApiService } from './test-api-service';

describe('ResetService', () => {
    let service: ResetService;
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const testApiService = jasmine.createSpyObj<TestApiService>('TestApiService', ['resetUserPassword']);

    const allocatedUsers: UserModel[] = [];
    const userModel = new UserModel();
    userModel.application = Application.VideoWeb;
    userModel.contact_email = 'test.user@email.com';
    userModel.display_name = 'firstname lastname';
    userModel.first_name = 'firstname';
    userModel.is_prod_user = false;
    userModel.last_name = 'lastname';
    userModel.number = 100;
    userModel.test_type = TestType.Manual;
    userModel.user_type = UserType.Individual;
    userModel.username = 'test.user@email.net';
    allocatedUsers.push(userModel);

    beforeAll(() => {
        service = new ResetService(logger, testApiService);
    });

    it('should reset the passwords for an allocated user', async () => {
        const updateUserResponse = new UpdateUserResponse();
        updateUserResponse.new_password = 'password';
        testApiService.resetUserPassword.and.returnValue(Promise.resolve(updateUserResponse));

        const result = await service.resetPassword(allocatedUsers[0].username);
        expect(testApiService.resetUserPassword).toHaveBeenCalledWith(allocatedUsers[0].username);
    });

    it('should reset all the passwords for all users in the hearing', async () => {
        const updateUserResponse = new UpdateUserResponse();
        updateUserResponse.new_password = 'password';
        testApiService.resetUserPassword.and.returnValue(Promise.resolve(updateUserResponse));

        const result = await service.resetAllPasswords(allocatedUsers);
        expect(testApiService.resetUserPassword).toHaveBeenCalledWith(allocatedUsers[0].username);
    });

    it('should throw an error if call to test api to reset password fails', async () => {
        const error = { error: 'not found!' };
        testApiService.resetUserPassword.and.callFake(() => Promise.reject(error));
        await expectAsync(service.resetAllPasswords(allocatedUsers)).toBeRejected(error.error);
    });
});
