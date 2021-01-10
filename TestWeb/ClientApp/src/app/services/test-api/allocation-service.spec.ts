import { AllocateUsersModel } from 'src/app/common/models/allocate.users.model';
import { TestApiServiceTestData } from 'src/app/testing/mocks/testapiservice-test-data';
import { ProfileService } from '../api/profile-service';
import { Application, TestType, UserDetailsResponse, UserProfileResponse, UserType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { AllocationService } from './allocation-service';
import { TestApiService } from './test-api-service';

describe('AllocationService', () => {
    let service: AllocationService;
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const testApiService = jasmine.createSpyObj<TestApiService>('TestApiService', ['allocateUsers']);
    const profileService = jasmine.createSpyObj<ProfileService>('ProfileService', ['getUserProfile']);
    const testData = new TestApiServiceTestData();

    beforeAll(() => {
        service = new AllocationService(logger, testApiService, profileService);
    });

    it('should call the test api to allocate users for the hearing', async () => {
        const userDetailsResponse: UserDetailsResponse[] = testData.getAllocatedUsersResponse();
        testApiService.allocateUsers.and.returnValue(Promise.resolve(userDetailsResponse));

        const profile = new UserProfileResponse();
        profile.role = 'Role';
        profile.username = 'user@email.com';
        profileService.getUserProfile.and.returnValue(Promise.resolve(profile));

        const hearingFormData = testData.createHearingFormData();
        const result = await service.allocatateUsers(hearingFormData);

        const allocateUserModel = new AllocateUsersModel();
        allocateUserModel.allocated_by = profile.username;
        allocateUserModel.application = Application.VideoWeb;
        allocateUserModel.expiry_in_minutes = 1;
        allocateUserModel.is_prod_user = false;
        allocateUserModel.usertypes = [UserType.Judge, UserType.Individual, UserType.Representative];
        allocateUserModel.test_type = TestType.Manual;

        expect(testApiService.allocateUsers).toHaveBeenCalledWith(allocateUserModel);
    });

    it('should throw an error if test api to allocate users fails', async () => {
        const error = { error: 'not found!' };
        testApiService.allocateUsers.and.callFake(() => Promise.reject(error));
        const hearingFormData = testData.createHearingFormData();
        await expectAsync(service.allocatateUsers(hearingFormData)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });
});
