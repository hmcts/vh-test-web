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
    userModel.created_date = new Date();
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

    it('should reset the passwords for the user in the hearing', async () => {
        const updateUserResponse = new UpdateUserResponse();
        updateUserResponse.new_password = 'password';
        testApiService.resetUserPassword.and.returnValue(Promise.resolve(updateUserResponse));

        const result = await service.resetPasswords(allocatedUsers);

        expect(testApiService.resetUserPassword).toHaveBeenCalledWith(allocatedUsers[0].username);
    });

    it('should throw an error if call to test api to allocate users fails', async () => {
        const error = { error: 'not found!' };
        testApiService.resetUserPassword.and.callFake(() => Promise.reject(error));

        const result = await service.resetPasswords(allocatedUsers);
        expect(logger.error).toHaveBeenCalled();
    });
});
