import { of } from 'rxjs';
import { AllocateUserModel } from 'src/app/common/models/allocate.user.model';
import { AllocateUsersModel } from 'src/app/common/models/allocate.users.model';
import { ConfirmHearingModel } from 'src/app/common/models/confirm.hearing.model';
import { DeleteModel } from 'src/app/common/models/delete-model';
import { HearingModel } from 'src/app/common/models/hearing.model';
import { TestApiServiceTestData } from 'src/app/testing/mocks/testapiservice-test-data';
import {
    AllocateUserRequest,
    AllocateUsersRequest,
    AllocationDetailsResponse,
    ApiClient,
    Application,
    ConferenceDetailsResponse,
    DeletedResponse,
    DeleteTestHearingDataRequest,
    ResetUserPasswordRequest,
    TestType,
    UnallocateUsersRequest,
    UpdateBookingStatus,
    UpdateBookingStatusRequest,
    UpdateUserResponse,
    UserDetailsResponse,
    UserType
} from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { TestApiService } from './test-api-service';

describe('TestApiService', () => {
    let service: TestApiService;
    const testData = new TestApiServiceTestData();

    const apiClient = jasmine.createSpyObj<ApiClient>('ApiClient', [
        'allocateUsers',
        'hearings',
        'confirmHearingById',
        'password',
        'removeTestData',
        'allocateUser',
        'unallocateUsers',
        'allocatedUsers',
        `getConferencesForToday`,
        `getConferenceByHearingRefId`,
        `createVideoEvent`,
        `getAllHearingsByCreatedBy`
    ]);
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);

    const allocatedUsersModel: AllocateUsersModel = {
        allocated_by: 'user@hmcts.net',
        application: Application.AdminWeb,
        expiry_in_minutes: 5,
        is_prod_user: false,
        test_type: TestType.Manual,
        usertypes: [UserType.Individual, UserType.Representative]
    };
    const deleteHearingsModel: DeleteModel = { case_name: 'test case name', limit: 1000 };

    beforeAll(() => {
        service = new TestApiService(apiClient, logger);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should call the allocate users test api endpoint', async () => {
        const userDetailsResponse: UserDetailsResponse[] = [];
        const userDetails = new UserDetailsResponse();
        userDetails.application = Application.AdminWeb;
        userDetailsResponse.push(userDetails);
        apiClient.allocateUsers.and.returnValue(of(userDetailsResponse));

        const allocateRequest = new AllocateUsersRequest();
        allocateRequest.allocated_by = 'user@hmcts.net';
        allocateRequest.application = Application.AdminWeb;
        allocateRequest.expiry_in_minutes = 5;
        allocateRequest.is_prod_user = false;
        allocateRequest.test_type = TestType.Manual;
        allocateRequest.user_types = [UserType.Individual, UserType.Representative];

        const result = await service.allocateUsers(allocatedUsersModel);
        expect(apiClient.allocateUsers).toHaveBeenCalledWith(allocateRequest);
        expect(result).toBe(userDetailsResponse);
    });

    it('should call the confirm hearing test api endpoint', async () => {
        const conferenceDetailsResponse = new ConferenceDetailsResponse();
        conferenceDetailsResponse.audio_recording_required = false;
        conferenceDetailsResponse.case_name = 'test case name';
        conferenceDetailsResponse.case_number = 'case nmumber';
        conferenceDetailsResponse.hearing_id = '100';
        conferenceDetailsResponse.id = '200;';
        apiClient.confirmHearingById.and.returnValue(of(conferenceDetailsResponse));

        const hearingId = '100';
        const confirmHearingModel = new ConfirmHearingModel('admin');
        confirmHearingModel.cancel_reason = '';
        confirmHearingModel.status = UpdateBookingStatus.Created;

        const updatebookingStatusRequest = new UpdateBookingStatusRequest();
        updatebookingStatusRequest.cancel_reason = '';
        updatebookingStatusRequest.status = UpdateBookingStatus.Created;
        updatebookingStatusRequest.updated_by = 'admin';
        const result = await service.confirmHearing(hearingId, confirmHearingModel);
        expect(apiClient.confirmHearingById).toHaveBeenCalledWith(hearingId, updatebookingStatusRequest);
        expect(result).toBe(conferenceDetailsResponse);
    });

    it('should call the password test api endpoint', async () => {
        const updateUserResponse = new UpdateUserResponse();
        updateUserResponse.new_password = 'pass';
        apiClient.password.and.returnValue(of(updateUserResponse));

        const resetUserPasswordRequest = new ResetUserPasswordRequest();
        resetUserPasswordRequest.username = 'test.user@email.net';

        const result = await service.resetUserPassword(resetUserPasswordRequest.username);
        expect(apiClient.password).toHaveBeenCalledWith(resetUserPasswordRequest);
        expect(result).toBe(updateUserResponse);
    });

    it('should call the remove test data api endpoint', async () => {
        const deleteRequest = new DeleteTestHearingDataRequest();
        deleteRequest.partial_hearing_case_name = 'test case name';
        deleteRequest.limit = 1000;

        const deletedResponse = new DeletedResponse();
        deletedResponse.number_of_deleted_hearings = 1;
        const result = apiClient.removeTestData.and.returnValue(of(deletedResponse));

        await service.deleteHearings(deleteHearingsModel);
        expect(apiClient.removeTestData).toHaveBeenCalledWith(deleteRequest);
    });

    it('should call the allocate single user test api endpoint', async () => {
        const userDetailsResponse = new UserDetailsResponse();
        apiClient.allocateUser.and.returnValue(of(userDetailsResponse));

        const allocateUserModel = new AllocateUserModel();
        allocateUserModel.allocated_by = 'user@hmcts.net';
        allocateUserModel.application = Application.AdminWeb;
        allocateUserModel.expiry_in_minutes = 5;
        allocateUserModel.is_prod_user = false;
        allocateUserModel.test_type = TestType.Manual;
        allocateUserModel.user_type = UserType.Individual;

        const allocateUserRequest = new AllocateUserRequest();
        allocateUserRequest.allocated_by = allocateUserModel.allocated_by;
        allocateUserRequest.application = allocateUserModel.application;
        allocateUserRequest.expiry_in_minutes = allocateUserModel.expiry_in_minutes;
        allocateUserRequest.is_prod_user = allocateUserModel.is_prod_user;
        allocateUserRequest.test_type = allocateUserModel.test_type;
        allocateUserRequest.user_type = allocateUserModel.user_type;

        const result = await service.allocateSingleUser(allocateUserModel);
        expect(apiClient.allocateUser).toHaveBeenCalledWith(allocateUserRequest);
        expect(result).toBe(userDetailsResponse);
    });

    it('should call the unallocate user test api endpoint', async () => {
        const allocationResponses = [];
        const allocationResponse = new AllocationDetailsResponse();
        allocationResponses.push(allocationResponse);
        apiClient.unallocateUsers.and.returnValue(of(allocationResponses));

        const usernames = [];
        const username = 'user@hmcts.net';
        usernames.push(username);
        const unallocateRequest = new UnallocateUsersRequest();
        unallocateRequest.usernames.push(username);

        const result = await service.unallocateUsers(usernames);
        expect(apiClient.unallocateUsers).toHaveBeenCalledWith(unallocateRequest);
        expect(result).toBe(allocationResponses);
    });

    it('should call the get all allocations by allocatedBy test api endpoint', async () => {
        const allocationResponses = [];
        const allocationResponse = new AllocationDetailsResponse();
        allocationResponses.push(allocationResponse);
        apiClient.allocatedUsers.and.returnValue(of(allocationResponses));

        const username = 'user@hmcts.net';

        const result = await service.getAllAllocationsByAllocatedBy(username);
        expect(apiClient.allocatedUsers).toHaveBeenCalledWith(username);
        expect(result).toBe(allocationResponses);
    });

    it('should call the create hearing test api endpoint', async () => {
        const hearingModel = testData.createHearingModel();
        const hearingDetailsResponse = testData.getHearingDetails();
        apiClient.hearings.and.returnValue(of(hearingDetailsResponse));
        const result = await service.createHearing(hearingModel);
        expect(apiClient.hearings).toHaveBeenCalled();
        expect(result).toBe(hearingDetailsResponse);
    });

    it('should call the get all conferences for today test api endpoint', async () => {
        const conferenceDetailsResponse = testData.getConferencesResponse();
        apiClient.getConferencesForToday.and.returnValue(of(conferenceDetailsResponse));
        const result = await service.getConferencesForToday();
        expect(apiClient.getConferencesForToday).toHaveBeenCalled();
        expect(result).toBe(conferenceDetailsResponse);
    });

    it('should call the get all conferences by hearing ref id test api endpoint', async () => {
        const conferenceDetailsResponse = testData.getConferenceResponse();
        apiClient.getConferenceByHearingRefId.and.returnValue(of(conferenceDetailsResponse));
        const result = await service.getConferencesByHearingRefId(conferenceDetailsResponse.hearing_ref_id);
        expect(apiClient.getConferenceByHearingRefId).toHaveBeenCalled();
        expect(result).toBe(conferenceDetailsResponse);
    });

    it('should call the send event test api endpoint', async () => {
        apiClient.createVideoEvent.and.returnValue(of());
        const event = testData.createEventModel();
        await service.sendEvent(event);
        expect(apiClient.createVideoEvent).toHaveBeenCalled();
    });

    it('should call the get all hearing by created by test api endpoint', async () => {
        const responses = [];
        const hearingResponse = testData.getHearingResponse();
        responses.push(hearingResponse);
        apiClient.getAllHearingsByCreatedBy.and.returnValue(of(responses));
        const username = 'user@123.com';
        const result = await service.getAllHearingsByCreatedBy(username);
        expect(apiClient.getAllHearingsByCreatedBy).toHaveBeenCalled();
        expect(result).toBe(responses);
    });
});
