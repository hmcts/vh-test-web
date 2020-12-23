import { Injectable } from "@angular/core";
import { Logger } from "../logging/logger-base";
import { TestApiService } from "./test-api-service";

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  private readonly loggerPrefix: string = '[ConferenceService] -';

  constructor(
      private logger: Logger,
      private testApiService: TestApiService
  ) {}

  async getConferencesForToday(): Promise<ConferenceForAdminResponse[]> {
    this.logger.debug(`${this.loggerPrefix} Fetching conferences for today...`);
    const conferences = [];
    const response = await this.sendGetConferencesRequest();
    return conferences;
  }

  private async sendGetConferencesRequest() {
    this.logger.debug(`${this.loggerPrefix} SENDING HEARING REQUEST`);
    try {
        const hearingResponse = await this.testApiService.createHearing(this.hearingModel);
        this.logger.debug(`${this.loggerPrefix} HEARING CREATED.`);
        this.logger.debug(`${this.loggerPrefix} Hearing Response  ${hearingResponse}.`, { payload: hearingResponse });
        return hearingResponse;
    } catch (error) {
        this.logger.error(`${this.loggerPrefix} Failed to create hearing.`, error, { payload: this.hearingModel });
    }
  }
}
