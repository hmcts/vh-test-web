import { ConfirmHearingModel } from 'src/app/common/models/confirm.hearing.model';
import { UserModel } from 'src/app/common/models/user.model';
import { TestData } from 'src/app/testing/mocks/test-data';
import { ProfileService } from '../api/profile-service';
import { Application, TestType, UpdateBookingStatus, UserType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { ConfirmService } from './confirm-service';
import { TestApiService } from './test-api-service';

describe('ConfirmService', () => {
    let service: ConfirmService;
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const profileService = jasmine.createSpyObj<ProfileService>('ProfileService', ['getUserProfile', `getLoggedInUsername`]);
    const testApiService = jasmine.createSpyObj<TestApiService>('TestApiService', ['confirmHearing']);

    const allocatedUsers: UserModel[] = [];
    const userModel = new UserModel();
    userModel.application = Application.VideoWeb;
    userModel.contact_email = 'test.user@hmcts.net';
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
    const hearing = new TestData().getHearingDetails();

    beforeEach(() => {
        service = new ConfirmService(logger, testApiService, profileService);
    });

    it('should call the test api to confirm a hearing', async () => {
        const conferenceDetailsResponse = new TestData().getConference();
        testApiService.confirmHearing.and.returnValue(Promise.resolve(conferenceDetailsResponse));

        const username = 'test_web_created_by@hmcts.net';
        profileService.getLoggedInUsername.and.returnValue(Promise.resolve(username));

        const result = await service.ConfirmHearing(hearing, allocatedUsers);

        const confirmHearingModel = new ConfirmHearingModel(username);
        confirmHearingModel.cancel_reason = null;
        confirmHearingModel.status = UpdateBookingStatus.Created;

        expect(testApiService.confirmHearing).toHaveBeenCalledWith(hearing.id, confirmHearingModel);
        expect(result).not.toBeNull();
        expect(result.audio_recording_required).toBe(conferenceDetailsResponse.audio_recording_required);
    });

    it('should throw an error if call to test api to confirm a hearing fails', async () => {
        const error = { error: 'not found!' };
        testApiService.confirmHearing.and.callFake(() => Promise.reject(error));
        await expectAsync(service.ConfirmHearing(hearing, allocatedUsers)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });
});
