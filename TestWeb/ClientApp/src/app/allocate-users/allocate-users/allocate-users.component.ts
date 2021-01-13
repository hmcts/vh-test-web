import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AllocatedUserModel } from 'src/app/common/models/allocated.user.model';
import { UserModel } from 'src/app/common/models/user.model';
import { TestType, UpdateUserResponse, UserType } from 'src/app/services/clients/api-client';
import { Logger } from 'src/app/services/logging/logger-base';
import { AllocationService } from 'src/app/services/test-api/allocation-service';
import { AllocationFormData } from 'src/app/services/test-api/models/allocation-form-data';
import { ResetService } from 'src/app/services/test-api/reset-service';

@Component({
    selector: 'app-allocate-users',
    templateUrl: './allocate-users.component.html',
    styleUrls: ['./allocate-users.component.css']
})
export class AllocateUsersComponent implements OnInit {
    protected readonly loggerPrefix: string = '[Allocate Users] -';
    form: FormGroup;
    testTypesDropdown: FormControl;
    userTypesDropdown: FormControl;
    daysTextfield: FormControl;
    hoursTextfield: FormControl;
    minutesTextfield: FormControl;
    private defaultTestType = TestType.Manual;
    private defaultUserType = UserType.Individual;
    private defaultDays = 0;
    private defaultHours = 0;
    private defaultMinutes = 1;
    testTypes: string[] = [TestType.Demo, TestType.ITHC, TestType.Manual];
    userTypes: string[] = [
        UserType.CaseAdmin,
        UserType.Individual,
        UserType.Judge,
        UserType.Observer,
        UserType.PanelMember,
        UserType.Representative,
        UserType.VideoHearingsOfficer,
        UserType.Winger
    ];
    allocations: AllocatedUserModel[] = [];
    allocatedUser: UserModel;
    resetUsername = '';
    newPassword = '';

    error: string;
    errorRetrievingAllocations = false;
    errorAllocatingUser = false;
    errorResettingPassword = false;
    errorUnallocatingUser = false;

    fetchingAllocations = false;
    allocatingUsers = false;
    resettingPasswords = false;
    unallocatingUsers = false;
    usersUnallocated = false;

    enableAllocateButton = true;
    enableRefreshButton = true;
    displayPopup = false;
    displaySummary = false;
    enableCloseButton = false;

    constructor(
        private fb: FormBuilder,
        private logger: Logger,
        private allocationService: AllocationService,
        private resetService: ResetService,
        private spinnerService: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.getAllAllocations();
        this.initForm();
    }

    async getAllAllocations() {
        this.spinnerService.show();
        this.fetchingAllocations = true;
        this.enableAllocateButton = false;
        this.enableRefreshButton = false;
        this.allocations = await this.sendGetAllocations();
        this.enableAllocateButton = true;
        this.enableRefreshButton = true;
        this.fetchingAllocations = false;
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
            this.enableCloseButton = true;
        }
    }

    private initForm() {
        this.testTypesDropdown = new FormControl(this.defaultTestType);
        this.userTypesDropdown = new FormControl(this.defaultUserType);
        this.daysTextfield = new FormControl(this.defaultDays);
        this.hoursTextfield = new FormControl(this.defaultHours);
        this.minutesTextfield = new FormControl(this.defaultMinutes);
        this.form = this.fb.group({
            testTypesDropdown: this.testTypesDropdown,
            userTypesDropdown: this.userTypesDropdown,
            daysTextfield: this.daysTextfield,
            hoursTextfield: this.hoursTextfield,
            minutesTextfield: this.minutesTextfield
        });
    }

    allocationsToDisplay(): boolean {
        if (this.allocations !== undefined) {
            if (this.allocations.length > 0) {
                return true;
            }
            return false;
        }
    }

    async allocate() {
        this.spinnerService.show();
        const data = this.setAllocationFormData();
        this.displayPopup = true;
        this.allocatingUsers = true;
        this.allocatedUser = await this.sendAllocation(data);
        this.allocatingUsers = false;
        if (this.allocatedUser !== undefined) {
            await this.resetUserPassword(this.allocatedUser.username);
        }
        this.enableCloseButton = true;
        this.getAllAllocations();
        this.spinnerService.hide();
    }

    private setAllocationFormData(): AllocationFormData {
        const data = new AllocationFormData();
        const minutes = this.minutesTextfield.value + this.hoursTextfield.value * 60;
        data.expiry_in_minutes = minutes;
        data.testType = this.testTypesDropdown.value;
        data.userType = this.userTypesDropdown.value;
        this.logger.debug(`${this.loggerPrefix} Allocation form data:`, { payload: data });
        return data;
    }

    private async sendAllocation(data: AllocationFormData): Promise<UserModel> {
        try {
            return await this.allocationService.allocateSingleUser(data);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to allocate user.`, error);
            this.errorAllocatingUser = true;
            this.error = error;
        }
    }

    async resetUserPassword(username: string) {
        this.spinnerService.show();
        this.displayPopup = true;
        this.resettingPasswords = true;
        const response = await this.sendResetPassword(username);
        this.resetUsername = username;
        if (this.newPassword !== undefined) {
            this.newPassword = response.new_password;
        }
        this.displaySummary = true;
        this.enableCloseButton = true;
        this.resettingPasswords = false;
        this.spinnerService.hide();
    }

    private async sendResetPassword(username: string): Promise<UpdateUserResponse> {
        try {
            return await this.resetService.resetPassword(username);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to reset password.`, error);
            this.errorResettingPassword = true;
            this.error = error;
        }
    }

    async unallocateUser(username: string) {
        this.spinnerService.show();
        this.displayPopup = true;
        this.unallocatingUsers = true;
        await this.sendUnallocateUser(username);
        this.enableCloseButton = true;
        this.unallocatingUsers = false;
        this.getAllAllocations();
        this.spinnerService.hide();
    }

    private async sendUnallocateUser(username: string) {
        try {
            await this.allocationService.unallocateUser(username);
            this.usersUnallocated = true;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to unallocate user.`, error);
            this.errorResettingPassword = true;
            this.error = error;
        }
    }

    async unallocateAllAllocatedUsers() {
        this.spinnerService.show();
        this.displayPopup = true;
        this.unallocatingUsers = true;
        await this.sendUnallocateAllUsers();
        this.enableCloseButton = true;
        this.unallocatingUsers = false;
        this.getAllAllocations();
        this.spinnerService.hide();
    }

    private async sendUnallocateAllUsers() {
        try {
            await this.allocationService.unallocateAllAllocatedUsers();
            this.usersUnallocated = true;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to unallocate users.`, error);
            this.errorResettingPassword = true;
            this.error = error;
        }
    }

    timeInvalid() {
        if (this.daysTextfield.value + this.hoursTextfield.value + this.minutesTextfield.value <= 0) {
            return true;
        }
        return false;
    }

    daysInvalid() {
        if (this.daysTextfield.value < 0 || this.daysTextfield.value > 29) {
            return true;
        }
        return false;
    }

    hoursInvalid() {
        if (this.hoursTextfield.value < 0 || this.hoursTextfield.value > 23) {
            return true;
        }
        return false;
    }

    minutesInvalid() {
        if (this.minutesTextfield.value < 0 || this.minutesTextfield.value > 59) {
            return true;
        }
    }

    closeDialog() {
        this.displayPopup = false;
        this.displaySummary = false;
        this.enableCloseButton = false;
        this.errorRetrievingAllocations = false;
        this.errorAllocatingUser = false;
        this.errorResettingPassword = false;
        this.errorUnallocatingUser = false;
        this.error = undefined;
        this.usersUnallocated = false;
    }
}
