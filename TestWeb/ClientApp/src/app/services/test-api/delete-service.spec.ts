import { DeleteModel } from 'src/app/common/models/delete-model';
import { DeletedResponse } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { DeleteService } from './delete-service';
import { TestApiService } from './test-api-service';

describe('DeleteService', () => {
    let service: DeleteService;
    const logger = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const testApiService = jasmine.createSpyObj<TestApiService>('TestApiService', ['deleteHearings']);
    const caseName = 'case name 123';

    beforeEach(() => {
        service = new DeleteService(logger, testApiService);
    });

    it('should call the test api to delete a hearing', async () => {
        const numberOfDeletedHearings = 1;
        const deletedResponse = new DeletedResponse();
        deletedResponse.number_of_deleted_hearings = numberOfDeletedHearings;
        testApiService.deleteHearings.and.returnValue(Promise.resolve(deletedResponse));

        const result = await service.deleteHearing(caseName);
        expect(testApiService.deleteHearings).toHaveBeenCalled();
        expect(result).not.toBeNull();
        expect(result.number_of_deleted_hearings).toBe(numberOfDeletedHearings);
    });

    it('should throw an error if call to test api to delete a hearing fails', async () => {
        const error = { error: 'not found!' };
        testApiService.deleteHearings.and.callFake(() => Promise.reject(error));
        await expectAsync(service.deleteHearing(caseName)).toBeRejected(error.error);
        expect(logger.error).toHaveBeenCalled();
    });
});
