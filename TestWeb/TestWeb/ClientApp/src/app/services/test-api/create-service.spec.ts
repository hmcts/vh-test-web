import { TestApiServiceTestData } from 'src/app/testing/mocks/testapiservice-test-data';
import { Logger } from '../logging/logger-base';
import { AllocationService } from './allocation-service';
import { ConfirmService } from './confirm-service';
import { CreateService } from './create-service';
import { HearingService } from './hearing-service';
import { ResetService } from './reset-service';
import { SummeriesService } from './summeries-service';

describe('CreateService', () => {
    let service: CreateService;
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const allocationService = jasmine.createSpyObj<AllocationService>('AllocationService', ['allocatateUsers']);
    const hearingService = jasmine.createSpyObj<HearingService>('HearingService', ['CreateHearing']);
    const confirmService = jasmine.createSpyObj<ConfirmService>('ConfirmService', ['ConfirmHearing']);
    const resetService = jasmine.createSpyObj<ResetService>('ResetService', ['resetAllPasswords']);
    const summaryService = jasmine.createSpyObj<SummeriesService>('SummaryService', ['setSummaries']);

    const testData = new TestApiServiceTestData();

    beforeEach(() => {
        service = new CreateService(logger, allocationService, hearingService, confirmService, resetService, summaryService);
    });

    it('should create and return summary', async () => {
        const allocatedUsersResponse = testData.getAllocatedUserModel();
        allocationService.allocatateUsers.and.returnValue(Promise.resolve(allocatedUsersResponse));

        const hearingResponse = testData.getHearingResponse();
        hearingService.CreateHearing.and.returnValue(Promise.resolve(hearingResponse));

        const conferenceResponse = testData.getConference();
        confirmService.ConfirmHearing.and.returnValue(Promise.resolve(conferenceResponse));

        const resetPasswords = testData.getUserPasswords();
        resetService.resetAllPasswords.and.returnValue(Promise.resolve(resetPasswords));

        const hearingFormData = testData.createHearingFormData();
        const result = await service.createHearings(hearingFormData);

        expect(summaryService.setSummaries).toHaveBeenCalled();
        expect(result).not.toBeNull();
    });
});
