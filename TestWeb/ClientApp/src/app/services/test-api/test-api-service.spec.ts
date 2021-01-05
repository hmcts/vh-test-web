import { of } from 'rxjs';
import { AllocateUsersModel } from 'src/app/common/models/allocate.users.model';
import { ConfirmHearingModel } from 'src/app/common/models/confirm.hearing.model';
import { DeleteModel } from 'src/app/common/models/delete-model';
import { HearingModel } from 'src/app/common/models/hearing.model';
import { testerTestProfile } from 'src/app/testing/data/test-profiles';
import {
    AllocateUsersRequest,
    ApiClient,
    Application,
    ConferenceDetailsResponse,
    ConferenceState,
    CreateHearingRequest,
    DeletedResponse,
    DeleteTestHearingDataRequest,
    HearingDetailsResponse,
    ResetUserPasswordRequest,
    TestType,
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

    const apiClient = jasmine.createSpyObj<ApiClient>('ApiClient', [
        'allocateUsers',
        'hearings',
        'confirmHearingById',
        'password',
        'removeTestData'
    ]);
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);

    const allocatedUsersModel: AllocateUsersModel = {
        application: Application.AdminWeb,
        expiry_in_minutes: 5,
        is_prod_user: false,
        test_type: TestType.Manual,
        usertypes: [UserType.Individual, UserType.Representative]
    };
    const createHearingModel: HearingModel = {
        application: Application.AdminWeb,
        case_type: 'tax',
        questionnaire_not_required: true,
        test_type: TestType.Manual,
        users: null,
        venue: 'court',
        audio_recording_required: false,
        scheduled_date_time: new Date()
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
});
