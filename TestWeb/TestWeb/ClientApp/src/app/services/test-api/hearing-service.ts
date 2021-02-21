import { Injectable } from '@angular/core';
import { HearingModel } from 'src/app/common/models/hearing.model';
import { UserModel } from 'src/app/common/models/user.model';
import { ProfileService } from '../api/profile-service';
import { HearingDetailsResponse, HearingResponse } from '../clients/api-client';
import { Logger } from '../logging/logger-base';
import { HearingFormData } from './models/hearing-form-data';
import { TestApiService } from './test-api-service';

@Injectable({
    providedIn: 'root'
})
export class HearingService {
    private readonly loggerPrefix: string = '[HearingService] -';
    private hearingModel: HearingModel;

    constructor(private logger: Logger, private testApiService: TestApiService, private profileService: ProfileService) {}

    async CreateHearing(hearingFormData: HearingFormData, allocatedUsers: UserModel[]): Promise<HearingDetailsResponse> {
        await this.createHearingRequest(hearingFormData);
        this.addUsersToHearingModel(allocatedUsers);
        return await this.sendHearingRequest();
    }

    private async createHearingRequest(hearingFormData: HearingFormData) {
        this.hearingModel = new HearingModel();
        this.hearingModel.test_type = hearingFormData.testType;
        this.hearingModel.created_by = await this.profileService.getLoggedInUsername();
        this.hearingModel.custom_case_name_prefix = hearingFormData.customCaseNamePrefix;
        const hearingDate = new Date(hearingFormData.hearingDate);
        hearingDate.setHours(hearingFormData.hearingStartTimeHour, hearingFormData.hearingStartTimeMinute);
        this.hearingModel.scheduled_date_time = hearingDate;
        this.logger.debug(`${this.loggerPrefix} Scheduled date: ${hearingDate}`);
        this.hearingModel.questionnaire_not_required = hearingFormData.questionnaireNotRequired;
        this.hearingModel.audio_recording_required = hearingFormData.audioRecordingRequired;
        this.hearingModel.endpoints = hearingFormData.numberOfEndpoints;
        this.logger.debug(`${this.loggerPrefix}
        Test type: ${hearingFormData.testType}
        Created by: ${this.hearingModel.created_by}
        Custom Case Name Prefix ${hearingFormData.customCaseNamePrefix}
        Questionnaire not required: ${hearingFormData.questionnaireNotRequired}
        Audio recording required: ${hearingFormData.audioRecordingRequired}
        Individuals: ${hearingFormData.individuals}
        Representatives: ${hearingFormData.representatives}
        Observers: ${hearingFormData.observers}
        Panel Members: ${hearingFormData.panelMembers}
        Number of hearings: ${hearingFormData.numberOfHearings}
        Number of endpoints ${hearingFormData.numberOfEndpoints}
        Reuse users ${hearingFormData.reuseUsers}
        Witnesses ${hearingFormData.witnesses}`);
    }

    private addUsersToHearingModel(allocatedUsers: UserModel[]) {
        this.logger.debug(`${this.loggerPrefix} ADDING USERS TO HEARING REQUEST`);
        this.logger.debug(`${this.loggerPrefix} Adding ${allocatedUsers.length} allocated users to the hearing model`);
        this.hearingModel.users = allocatedUsers;
    }

    private async sendHearingRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING HEARING REQUEST`);
        try {
            const hearingResponse = await this.testApiService.createHearing(this.hearingModel);
            this.logger.debug(`${this.loggerPrefix} HEARING CREATED.`);
            this.logger.debug(`${this.loggerPrefix} Hearing Response  ${hearingResponse}.`, { payload: hearingResponse });
            return hearingResponse;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to create hearing.`, error, { payload: this.hearingModel });
            throw error;
        }
    }

    async GetAllHearings(): Promise<HearingResponse[]> {
        const createdBy = await this.profileService.getLoggedInUsername();
        return await this.sendGetAllHearingsRequest(createdBy);
    }

    private async sendGetAllHearingsRequest(createdBy: string) {
        this.logger.debug(`${this.loggerPrefix} SENDING GET ALL HEARINGS REQUEST`);
        try {
            const hearingsResponse = await this.testApiService.getAllHearingsByCreatedBy(createdBy);
            this.logger.debug(`${this.loggerPrefix} HEARINGS RETRIEVED.`);
            this.logger.debug(`${this.loggerPrefix} Hearing Response  ${hearingsResponse}.`, { payload: hearingsResponse });
            this.logger.debug(`${this.loggerPrefix} ${hearingsResponse.length} hearing(s) found`);
            return hearingsResponse;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to retreive hearings.`, error);
            throw error;
        }
    }
}
