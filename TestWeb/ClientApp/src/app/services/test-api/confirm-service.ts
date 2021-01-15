import { Injectable } from '@angular/core';
import { ConfirmHearingModel } from 'src/app/common/models/confirm.hearing.model';
import { UserData } from 'src/app/common/models/data/user-data';
import { UserModel } from 'src/app/common/models/user.model';
import { ProfileService } from '../api/profile-service';
import { ConferenceDetailsResponse, HearingDetailsResponse, UserType } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { TestApiService } from './test-api-service';

@Injectable({
    providedIn: 'root'
})
export class ConfirmService {
    private readonly loggerPrefix: string = '[ConfirmService] -';
    private confirmModel: ConfirmHearingModel;

    constructor(private logger: Logger, private testApiService: TestApiService, private profileService: ProfileService) {}

    async ConfirmHearing(hearing: HearingDetailsResponse, allocatedUsers: UserModel[]): Promise<ConferenceDetailsResponse> {
        await this.createConfirmModel(allocatedUsers);
        return await this.sendConfirmRequest(hearing);
    }

    private async createConfirmModel(allocatedUsers: UserModel[]) {
        this.logger.debug(`${this.loggerPrefix} CREATING CONFIRM MODEL`);
        const updatedBy = await this.profileService.getLoggedInUsername();
        this.confirmModel = new ConfirmHearingModel(updatedBy);
    }

    private async sendConfirmRequest(hearing: HearingDetailsResponse) {
        this.logger.debug(`${this.loggerPrefix} SENDING CONFIRM REQUEST`);
        try {
            const confirmResponse = await this.testApiService.confirmHearing(hearing.id, this.confirmModel);
            this.logger.debug(`${this.loggerPrefix} CONFERENCE CREATED.`);
            this.logger.debug(`${this.loggerPrefix} Confirm Response:`, { payload: confirmResponse });
            return confirmResponse;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to confirm hearing.`, error, { payload: hearing });
            throw error;
        }
    }
}
