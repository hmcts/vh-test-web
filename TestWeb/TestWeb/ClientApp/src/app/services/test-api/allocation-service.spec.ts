import { AllocateUserModel } from 'src/app/common/models/allocate.user.model';
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
    const testApiService = jasmine.createSpyObj<TestApiService>('TestApiService', [
        'allocateUsers',
        `allocateSingleUser`,
        `getAllAllocationsByAllocatedBy`,
        `unallocateUsers`
    ]);
    const profileService = jasmine.createSpyObj<ProfileService>('ProfileService', ['getUserProfile', `getLoggedInUsername`]);
    const testData = new TestApiServiceTestData();
    const error = { error: 'not found!' };
    const hearingFormData = testData.createHearingFormData();
    const allocationFormData = testData.createAllocationFormData();

    beforeAll(() => {
        service = new AllocationService(logger, testApiService, profileService);
    });

    it('should call the test api to allocate users for the hearing', async () => {
        const userDetailsResponse: UserDetailsResponse[] = testData.getAllocatedUsersResponse();
        testApiService.allocateUsers.and.returnValue(Promise.resolve(userDetailsResponse));
        const username = 'user@hmcts.net';
        profileService.getLoggedInUsername.and.returnValue(Promise.resolve(username));

        await service.allocatateUsers(hearingFormData);

        const allocateUserModel = new AllocateUsersModel();
        allocateUserModel.allocated_by = username;
        allocateUserModel.application = Application.VideoWeb;
        allocateUserModel.expiry_in_minutes = 59;
        allocateUserModel.is_prod_user = false;
        allocateUserModel.usertypes = [
            UserType.Judge,
            UserType.Individual,
            UserType.Interpreter,
            UserType.Representative,
            UserType.Observer,
            UserType.PanelMember,
            UserType.Witness
        ];
        allocateUserModel.test_type = TestType.Manual;

        expect(testApiService.allocateUsers).toHaveBeenCalledWith(allocateUserModel);
    });

    it('should throw an error if test api to allocate users fails', async () => {
        testApiService.allocateUsers.and.callFake(() => Promise.reject(error));
        await expectAsync(service.allocatateUsers(hearingFormData)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });

    it('should call the test api to allocate a single user for the hearing', async () => {
        const allocationResponse = testData.getAllocationDetailsResponse();
        testApiService.allocateSingleUser.and.returnValue(Promise.resolve(allocationResponse));

        await service.allocateSingleUser(allocationFormData);

        const allocateUserModel = new AllocateUserModel();
        allocateUserModel.allocated_by = allocationResponse.username;
        allocateUserModel.application = allocationFormData.application;
        allocateUserModel.expiry_in_minutes = allocationFormData.expiry_in_minutes;
        allocateUserModel.is_prod_user = false;
        allocateUserModel.user_type = allocationFormData.userType;
        allocateUserModel.test_type = allocationFormData.testType;

        expect(testApiService.allocateSingleUser).toHaveBeenCalledWith(allocateUserModel);
    });

    it('should throw an error if allocate a single user fails', async () => {
        testApiService.allocateSingleUser.and.callFake(() => Promise.reject(error));
        await expectAsync(service.allocateSingleUser(allocationFormData)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });

    it('should throw an error if profile service fails to retreive the logged in user', async () => {
        profileService.getUserProfile.and.callFake(() => Promise.reject(error));
        await expectAsync(service.allocateSingleUser(allocationFormData)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });

    it('should call the test api to get all allocated users by logged in user', async () => {
        const allocationDetailsResponse = [];
        const allocationResponse = testData.getAllocationDetailsResponse();
        allocationDetailsResponse.push(allocationResponse);
        testApiService.getAllAllocationsByAllocatedBy.and.returnValue(Promise.resolve(allocationDetailsResponse));

        const profile = new UserProfileResponse();
        profile.role = 'Role';
        profile.username = allocationResponse.allocated_by;
        profileService.getUserProfile.and.returnValue(Promise.resolve(profile));

        await service.getAllAllocationsByUsername();
        expect(testApiService.getAllAllocationsByAllocatedBy).toHaveBeenCalledWith(profile.username);
    });

    it('should throw an error if get all allocated users by logged in user fails', async () => {
        testApiService.getAllAllocationsByAllocatedBy.and.callFake(() => Promise.reject(error));
        await expectAsync(service.getAllAllocationsByUsername()).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });

    it('should call the test api to unallocate users', async () => {
        const allocationDetailsResponse = [];
        const allocationResponse = testData.getAllocationDetailsResponse();
        allocationDetailsResponse.push(allocationResponse);
        testApiService.unallocateUsers.and.returnValue(Promise.resolve(allocationDetailsResponse));

        await service.unallocateUser(allocationResponse.username);

        const usernames = [];
        usernames.push(allocationResponse.username);

        expect(testApiService.unallocateUsers).toHaveBeenCalledWith(usernames);
    });

    it('should throw an error if get unallocated users fails', async () => {
        testApiService.unallocateUsers.and.callFake(() => Promise.reject(error));
        const username = 'user@hmcts.net';
        await expectAsync(service.unallocateUser(username)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });

    it('should call the test api to unallocate all allocated users', async () => {
        const allocationDetailsResponse = [];
        const allocationResponse = testData.getAllocationDetailsResponse();
        allocationDetailsResponse.push(allocationResponse);
        testApiService.getAllAllocationsByAllocatedBy.and.returnValue(Promise.resolve(allocationDetailsResponse));

        const profile = new UserProfileResponse();
        profile.role = 'Role';
        profile.username = allocationResponse.allocated_by;
        profileService.getUserProfile.and.returnValue(Promise.resolve(profile));

        testApiService.unallocateUsers.and.returnValue(Promise.resolve(allocationDetailsResponse));

        await service.unallocateAllAllocatedUsers();

        const usernames = [];
        usernames.push(allocationResponse.username);

        expect(testApiService.unallocateUsers).toHaveBeenCalledWith(usernames);
    });
});
