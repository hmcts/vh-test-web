import { Injectable } from '@angular/core';
import { DeleteModel } from 'src/app/common/models/delete-model';
import { DeletedResponse } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { TestApiService } from './test-api-service';

@Injectable({
    providedIn: 'root'
})
export class DeleteService {
    private readonly loggerPrefix: string = '[DeleteService] -';

    constructor(private logger: Logger, private testApiService: TestApiService) {}

    async deleteHearing(caseName: string): Promise<DeletedResponse> {
        return await this.sendDeleteRequest(caseName);
    }

    private async sendDeleteRequest(caseName: string): Promise<DeletedResponse> {
        this.logger.debug(`${this.loggerPrefix} SENDING DELETE REQUEST`);
        const deleteModel = new DeleteModel();
        deleteModel.case_name = caseName;
        try {
            const response = await this.testApiService.deleteHearings(deleteModel);
            this.logger.debug(`${this.loggerPrefix} ${response.number_of_deleted_hearings} HEARING(S) DELETED.`);
            return response;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to delete hearings.`, error);
        }
    }
}
