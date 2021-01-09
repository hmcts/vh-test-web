import { Injectable } from '@angular/core';
import { ConferenceResponse } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { TestApiService } from './test-api-service';

@Injectable({
    providedIn: 'root'
})
export class ConferenceService {
    private readonly loggerPrefix: string = '[ConferenceService] -';

    constructor(private logger: Logger, private testApiService: TestApiService) {}

    async getConferencesForToday(): Promise<ConferenceResponse[]> {
        this.logger.debug(`${this.loggerPrefix} Fetching conferences for today...`);
        const conferences = await this.sendGetConferencesRequest();
        return conferences;
    }

    private async sendGetConferencesRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING GET CONFERENCES REQUEST`);
        try {
            const conferencesResponse = await this.testApiService.getConferencesForToday();
            this.logger.debug(`${this.loggerPrefix} CONFERENCES RETRIEVED.`);
            this.logger.debug(`${this.loggerPrefix} Hearing Response`, { payload: conferencesResponse });
            return conferencesResponse;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to fetch conferences.`, error);
            throw error;
        }
    }

    async getConferenceByHearingRefId(hearingRefId: string): Promise<ConferenceResponse> {
        this.logger.debug(`${this.loggerPrefix} Fetching conference by hearing ref id ${hearingRefId} ...`);
        try {
            const conferenceResponse = await this.testApiService.getConferencesByHearingRefId(hearingRefId);
            this.logger.debug(`${this.loggerPrefix} CONFERENCE RETRIEVED.`);
            this.logger.debug(`${this.loggerPrefix} Conference Response`, { payload: conferenceResponse });
            return conferenceResponse;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to fetch conferences.`, error);
            throw error;
        }
    }
}
