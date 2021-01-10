import { Injectable } from '@angular/core';
import { Logger } from '../logging/logger-base';
import { AllocationService } from './allocation-service';
import { ConfirmService } from './confirm-service';
import { HearingFormData } from './models/hearing-form-data';
import { HearingService } from './hearing-service';
import { ResetService } from './reset-service';
import { Summary } from './models/summary';
import { SummeriesService } from './summeries-service';
import { UserModel } from 'src/app/common/models/user.model';
import Dictionary from 'src/app/shared/helpers/dictionary';

@Injectable({
    providedIn: 'root'
})
export class CreateService {
    private readonly loggerPrefix: string = '[CreateService] -';
    private allocatedUsers: UserModel[];
    private resetPasswords: Dictionary<string>;

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
            if (!hearingFormData.reuseUsers || index === 0) {
                this.allocatedUsers = await this.allocationService.allocatateUsers(hearingFormData);
            }

            const hearing = await this.hearingService.CreateHearing(hearingFormData, this.allocatedUsers);
            const conference = await this.confirmService.ConfirmHearing(hearing, this.allocatedUsers);

            if (!hearingFormData.reuseUsers || index === 0) {
                this.resetPasswords = await this.resetService.resetPasswords(this.allocatedUsers);
            }

            summaries.push(new Summary(conference, this.resetPasswords));
        }
        this.logger.debug(`${this.loggerPrefix} ${summaries.length} SUMMARIES CREATED`);
        this.summeriesService.setSummaries(summaries);
        return summaries;
    }
}
