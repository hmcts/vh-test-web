import { HearingModel } from 'src/app/common/models/hearing.model';
import { TestData } from 'src/app/testing/mocks/test-data';
import { ProfileService } from '../api/profile-service';
import { Application, TestType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { HearingService } from './hearing-service';
import { TestApiService } from './test-api-service';

describe('HearingService', () => {
    let service: HearingService;
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const testApiService = jasmine.createSpyObj<TestApiService>('TestApiService', ['createHearing', `getAllHearingsByCreatedBy`]);
    const profileService = jasmine.createSpyObj<ProfileService>('ProfileService', ['getUserProfile', `getLoggedInUsername`]);
    const testData = new TestData();

    beforeAll(() => {
        service = new HearingService(logger, testApiService, profileService);
    });

    it('should call the test api to create a hearing', async () => {
        const hearingDetailsResponse = testData.getHearingDetails();
        testApiService.createHearing.and.returnValue(Promise.resolve(hearingDetailsResponse));

        const hearingFormData = testData.createHearingFormData();
        const allocatedUsers = testData.getAllocatedUserModel();
        const result = await service.CreateHearing(hearingFormData, allocatedUsers);

        const createHearingModel = new HearingModel();
        createHearingModel.application = Application.VideoWeb;
        createHearingModel.audio_recording_required = false;
        createHearingModel.case_type = '';
        createHearingModel.created_by = 'user@hmcts.net';
        createHearingModel.custom_case_name_prefix = 'custom';
        createHearingModel.questionnaire_not_required = true;
        createHearingModel.scheduled_date_time = new Date();
        createHearingModel.test_type = TestType.Manual;
        createHearingModel.users = null;
        createHearingModel.venue = 'court';

        expect(testApiService.createHearing).toHaveBeenCalled();
        expect(result).not.toBeNull();
        expect(result).toBe(hearingDetailsResponse);
        expect(result.audio_recording_required).toBe(hearingDetailsResponse.audio_recording_required);
    });

    it('should throw an error if test api to create hearing fails', async () => {
        const error = { error: 'not found!' };
        testApiService.createHearing.and.callFake(() => Promise.reject(error));
        const hearingFormData = testData.createHearingFormData();
        const allocatedUsers = testData.getAllocatedUserModel();
        await expectAsync(service.CreateHearing(hearingFormData, allocatedUsers)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });

    it('should call the test api to get all hearings', async () => {
        const responses = [];
        const hearingResponse = testData.getHearingResponse();
        responses.push(hearingResponse);
        testApiService.getAllHearingsByCreatedBy.and.returnValue(Promise.resolve(responses));

        const username = 'user@hmcts.net';
        profileService.getLoggedInUsername.and.returnValue(Promise.resolve(username));

        const result = await service.GetAllHearings();

        expect(testApiService.getAllHearingsByCreatedBy).toHaveBeenCalled();
        expect(result).not.toBeNull();
        expect(result).toBe(responses);
    });

    it('should throw an error if test api to get all hearings fails', async () => {
        const error = { error: 'not found!' };
        testApiService.getAllHearingsByCreatedBy.and.callFake(() => Promise.reject(error));
        await expectAsync(service.GetAllHearings()).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });
});
