import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllocatedUserModel } from '../common/models/allocated.user.model';
import { HearingResponse } from '../services/clients/api-client';
import { Logger } from '../services/logging/logger-base';
import { AllocationService } from '../services/test-api/allocation-service';
import { DeleteService } from '../services/test-api/delete-service';
import { HearingService } from '../services/test-api/hearing-service';
import { ResetService } from '../services/test-api/reset-service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    protected readonly loggerPrefix: string = '[Home] -';
    form: FormGroup;
    hearings: HearingResponse[] = [];
    allocations: AllocatedUserModel[] = [];

    error: string;
    errorRetrievingHearings = false;
    errorRetrievingAllocations = false;
    errorDeletingHearing = false;
    errorResettingPassword = false;
    errorUnallocatingUser = false;

    displayPopup = false;
    displaySummary = false;
    resettingPassword = false;
    resetPasswordComplete = false;
    resetUsername: string;
    newPassword: string;

    constructor(
        private logger: Logger,
        private allocationService: AllocationService,
        private hearingsService: HearingService,
        private deleteService: DeleteService,
        private resetService: ResetService,
        private spinnerService: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.getAllHearings();
        this.getAllAllocations();
    }

    async getAllHearings() {
        this.spinnerService.show();
        this.hearings = await this.sendGetHearings();
        this.spinnerService.hide();
    }

    private async sendGetHearings(): Promise<HearingResponse[]> {
        try {
            return await this.hearingsService.GetAllHearings();
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to retrieve hearings.`, error);
            this.errorRetrievingHearings = true;
            this.error = error;
            this.displayPopup = true;
        }
    }

    hearingsToDisplay(): boolean {
        if (this.hearings !== undefined) {
            if (this.hearings.length > 0) {
                return true;
            }
            return false;
        }
    }

    async getAllAllocations() {
        this.spinnerService.show();
        this.allocations = await this.sendGetAllocations();
        this.spinnerService.hide();
    }

    private async sendGetAllocations(): Promise<AllocatedUserModel[]> {
        try {
            return await this.allocationService.getAllAllocationsByUsername();
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to retrieve allocations.`, error);
            this.errorRetrievingAllocations = true;
            this.error = error;
            this.displayPopup = true;
        }
    }

    allocationsToDisplay(): boolean {
        if (this.allocations !== undefined) {
            if (this.allocations.length > 0) {
                return true;
            }
            return false;
        }
    }

    async deleteHearing(caseName: string) {
        this.spinnerService.show();
        try {
            await this.deleteService.deleteHearing(caseName);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to delete hearing.`, error);
            this.errorDeletingHearing = true;
            this.error = error;
            this.displayPopup = true;
        }
        this.spinnerService.hide();
        await this.getAllHearings();
    }

    async resetPassword(username: string) {
        this.spinnerService.show();
        this.resettingPassword = true;
        this.displayPopup = true;
        try {
            const response = await this.resetService.resetPassword(username);
            this.resetUsername = username;
            this.newPassword = response.new_password;
            this.resettingPassword = false;
            this.resetPasswordComplete = true;
            this.displaySummary = true;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to reset password.`, error);
            this.resettingPassword = false;
            this.errorResettingPassword = true;
            this.error = error;
        }
        this.spinnerService.hide();
    }

    async unallocateUser(username: string) {
        this.spinnerService.show();
        try {
            await this.allocationService.unallocateUser(username);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to unallocate user.`, error);
            this.errorUnallocatingUser = true;
            this.error = error;
            this.displayPopup = true;
        }
        this.spinnerService.hide();
        this.getAllAllocations();
    }

    closeDialog() {
        this.displayPopup = false;
        this.displaySummary = false;
        this.errorRetrievingHearings = false;
        this.errorRetrievingAllocations = false;
        this.errorDeletingHearing = false;
        this.errorResettingPassword = false;
        this.errorUnallocatingUser = false;
        this.resettingPassword = false;
        this.resetPasswordComplete = false;
        this.resetUsername = undefined;
        this.newPassword = undefined;
        this.error = undefined;
    }
}
