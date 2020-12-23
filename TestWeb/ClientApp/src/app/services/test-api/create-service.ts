import { Injectable } from '@angular/core';
import { Logger } from '../logging/logger-base';
import { AllocationService } from './allocation-service';
import { ConfirmService } from './confirm-service';
import { HearingFormData } from './models/hearing-form-data';
import { HearingService } from './hearing-service';
import { ResetService } from './reset-service';
import { Summary } from './models/summary';
import { SummeriesService } from './summeries-service';

@Injectable({
    providedIn: 'root'
})
export class CreateService {
    private readonly loggerPrefix: string = '[CreateService] -';

    constructor(
        private logger: Logger,
        private allocationService: AllocationService,
        private hearingService: HearingService,
        private confirmService: ConfirmService,
        private resetService: ResetService,
        private summeriesService: SummeriesService
    ) {}

    async createHearings(hearingFormData: HearingFormData): Promise<Summary[]> {
        this.logger.debug(`${this.loggerPrefix} Creating ${hearingFormData.numberOfHearings} hearings...`);
        const summaries = [];
        for (let index = 0; index < hearingFormData.numberOfHearings; index++) {
            const allocatedUsers = await this.allocationService.AllocatateUsers(hearingFormData);
            const hearing = await this.hearingService.CreateHearing(hearingFormData, allocatedUsers);
            const conference = await this.confirmService.ConfirmHearing(hearing, allocatedUsers);
            const resetPasswords = await this.resetService.resetPasswords(allocatedUsers);
            summaries.push(new Summary(conference, resetPasswords));
        }
        this.logger.debug(`${this.loggerPrefix} ${summaries.length} SUMMARIES CREATED`);
        this.summeriesService.setSummaries(summaries);
        return summaries;
    }
}
