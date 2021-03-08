import { TestData } from 'src/app/testing/mocks/test-data';
import { ConferenceResponse } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { ConferenceService } from './conference-service';
import { TestApiService } from './test-api-service';

describe('ConferenceService', () => {
    let service: ConferenceService;
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const testApiService = jasmine.createSpyObj<TestApiService>('TestApiService', [
        'getConferencesForToday',
        'getConferencesByHearingRefId'
    ]);
    const testData = new TestData();

    beforeAll(() => {
        service = new ConferenceService(logger, testApiService);
    });

    it('should call the test api to get conferences for today', async () => {
        const conferencesResponse: ConferenceResponse[] = testData.getConferencesResponse();
        testApiService.getConferencesForToday.and.returnValue(Promise.resolve(conferencesResponse));
        const result = await service.getConferencesForToday();
        expect(testApiService.getConferencesForToday).toHaveBeenCalled();
    });

    it('should throw an error if test api to get conferences for today fails', async () => {
        const error = { error: 'not found!' };
        testApiService.getConferencesForToday.and.callFake(() => Promise.reject(error));
        await expectAsync(service.getConferencesForToday()).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });

    it('should call the test api to get conference by hearing ref id', async () => {
        const conferenceResponse: ConferenceResponse = testData.getConferenceResponse();
        testApiService.getConferencesByHearingRefId.and.returnValue(Promise.resolve(conferenceResponse));
        const result = await service.getConferenceByHearingRefId(conferenceResponse.hearing_ref_id);
        expect(testApiService.getConferencesByHearingRefId).toHaveBeenCalledWith(conferenceResponse.hearing_ref_id);
    });

    it('should throw an error if test api to get conference by hearing ref id fails', async () => {
        const error = { error: 'not found!' };
        const hearing_ref_id = '123';
        testApiService.getConferencesByHearingRefId.and.callFake(() => Promise.reject(error));
        await expectAsync(service.getConferenceByHearingRefId(hearing_ref_id)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });
});
