import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Constants } from '../common/constants';
import { AllocateUsersModel } from '../common/models/allocate.users.model';
import { ConfirmHearingModel } from '../common/models/confirm.hearing.model';
import { UserData } from '../common/models/data/user-data';
import { HearingModel } from '../common/models/hearing.model';
import { UserModel } from '../common/models/user.model';
import { MapAllocatedResponseToUsers } from '../services/api/mappers/map-allocated-users-details-response-to-users-model';
import { ConferenceDetailsResponse, HearingDetailsResponse, TestType, UpdateUserResponse, UserType } from '../services/clients/api-client';
import { Logger } from '../services/logging/logger-base';
import { TestApiService } from '../services/test-api-service';
import Dictionary from '../shared/helpers/dictionary';
import { ConferenceSummary } from '../shared/models/hearings-summary';

@Component({
    selector: 'app-create-hearing',
    templateUrl: './create-hearing.component.html',
    styleUrls: ['./create-hearing.component.css']
})
export class CreateHearingComponent implements OnInit, OnDestroy {
    private hearingModel: HearingModel;
    private conferenceSummary: ConferenceSummary;
    private conferenceSummaries: ConferenceSummary[];
    private allocateUsersModel: AllocateUsersModel;
    private confirmModel: ConfirmHearingModel;
    private allocatedUsers: UserModel[];
    private hearingResponse: HearingDetailsResponse;
    private confirmResponse: ConferenceDetailsResponse;
    private resetResponse: UpdateUserResponse;
    private readonly loggerPrefix: string = '[Create Hearing(s)] -';
    private failedSubmission: boolean;
    testTypes: TestType[] = [Constants.TestTypes.Demo, Constants.TestTypes.ITHC, Constants.TestTypes.Manual];
    numbers: number[] = [1, 2, 3, 4, 5];
    private defaultTestType: string = Constants.TestTypes.Manual;
    defaultQuestionnaireNotRequired = true;
    defaultAudioRecordingRequired = false;
    private defaultIndividuals = 1;
    private defaultRepresentatives = 1;
    private defaultObservers = 0;
    private defaultPanelMembers = 0;
    private defaultNumberOfHearings = 1;
    maxParticipants = 21;
    today = new Date();
    form: FormGroup;
    summaryForm: FormGroup;
    buttonAction = 'Book & Confirm';
    $subscriptions: Subscription[] = [];
    testTypeDropdown: FormControl;
    questionnaireNotRequiredCheckBox: FormControl;
    audioRecordingRequiredCheckBox: FormControl;
    individualsTextfield: FormControl;
    representativesTextfield: FormControl;
    observersTextfield: FormControl;
    panelMembersTextfield: FormControl;
    quantityDropdown: FormControl;
    progressTextfield: FormControl;
    summaryTextfield: FormControl;
    progressOutput = '';
    summaryOutput = '';
    private userPasswords = new Dictionary<string>();
    isStartHoursInPast: boolean;
    isStartMinutesInPast: boolean;
    bookingsSaving = false;
    bookingsSaved = true;
    enableResetButton = false;
    enableCopyButton = false;
    tooltip: string;

    constructor(
        private fb: FormBuilder,
        private logger: Logger,
        private testApiService: TestApiService,
        private datePipe: DatePipe,
        private clipboardService: ClipboardService,
        private spinnerService: NgxSpinnerService
    ) {
        this.conferenceSummaries = [];
    }

    ngOnInit() {
        this.spinnerService.hide();
        this.createNewHearingModel();
        this.initForm();
        this.initSummaryForm();
        this.buttonAction = 'Book & Confirm';
        this.resetText();
        this.form.valueChanges.subscribe(() => {});
    }

    ngOnDestroy(): void {
        this.$subscriptions.forEach(subscription => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    private createNewHearingModel() {
        this.hearingModel = new HearingModel();
    }

    private initForm() {
        let hearingDateParsed = null;
        let startTimeHour = null;
        let startTimeMinute = null;

        const minutesAhead = 31;
        const date = this.addMinutes(new Date(), minutesAhead);
        hearingDateParsed = this.datePipe.transform(date, 'yyyy-MM-dd');
        startTimeHour = (date.getHours() < 10 ? '0' : '') + date.getHours();
        startTimeMinute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

        this.testTypeDropdown = new FormControl(this.defaultTestType);
        this.questionnaireNotRequiredCheckBox = new FormControl(this.defaultQuestionnaireNotRequired);
        this.audioRecordingRequiredCheckBox = new FormControl(this.defaultAudioRecordingRequired);
        this.individualsTextfield = new FormControl(this.defaultIndividuals);
        this.representativesTextfield = new FormControl(this.defaultRepresentatives);
        this.observersTextfield = new FormControl(this.defaultObservers);
        this.panelMembersTextfield = new FormControl(this.defaultPanelMembers);
        this.quantityDropdown = new FormControl(this.defaultNumberOfHearings);

        this.form = this.fb.group({
            testTypeDropdown: this.testTypeDropdown,
            hearingDate: [hearingDateParsed, Validators.required],
            hearingStartTimeHour: [startTimeHour, [Validators.required, Validators.min(0), Validators.max(23)]],
            hearingStartTimeMinute: [startTimeMinute, [Validators.required, Validators.min(0), Validators.max(59)]],
            questionnaireNotRequiredCheckBox: this.questionnaireNotRequiredCheckBox,
            audioRecordingRequiredCheckBox: this.audioRecordingRequiredCheckBox,
            individualsTextfield: this.individualsTextfield,
            representativesTextfield: this.representativesTextfield,
            observersTextfield: this.observersTextfield,
            panelMembersTextfield: this.panelMembersTextfield,
            quantityDropdown: this.quantityDropdown
        });
    }

    private initSummaryForm() {
        this.progressTextfield = new FormControl();
        this.summaryTextfield = new FormControl();
        this.summaryForm = this.fb.group({
            progressTextfield: this.progressTextfield,
            summaryTextfield: this.summaryTextfield
        });
    }

    private addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    get testType() {
        return this.form.get('testTypeDropdown');
    }

    get hearingDate() {
        return this.form.get('hearingDate');
    }

    get hearingStartTimeHour() {
        return this.form.get('hearingStartTimeHour');
    }

    get hearingStartTimeMinute() {
        return this.form.get('hearingStartTimeMinute');
    }

    get questionnaireNotRequired() {
        return this.form.get('questionnaireNotRequiredCheckBox');
    }

    get audioRecordingRequired() {
        return this.form.get('audioRecordingRequiredCheckBox');
    }

    get individuals() {
        return this.form.get('individualsTextfield');
    }

    get representatives() {
        return this.form.get('representativesTextfield');
    }

    get observers() {
        return this.form.get('observersTextfield');
    }

    get panelMembers() {
        return this.form.get('panelMembersTextfield');
    }

    get quantity() {
        return this.form.get('quantityDropdown');
    }

    get hearingDateInvalid() {
        const todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        return (
            (this.hearingDate.invalid || new Date(this.hearingDate.value) < todayDate) &&
            (this.hearingDate.dirty || this.hearingDate.touched || this.failedSubmission)
        );
    }

    get hearingStartTimeHourInvalid() {
        return (
            this.hearingStartTimeHour.invalid &&
            (this.hearingStartTimeHour.dirty || this.hearingStartTimeHour.touched || this.failedSubmission)
        );
    }

    get individualsInvalid() {
        return (
            (this.individuals.invalid || this.individuals.value > this.maxParticipants || this.individuals.value < 0) &&
            (this.individuals.dirty || this.individuals.touched || this.failedSubmission)
        );
    }

    get representativesInvalid() {
        return (
            (this.representatives.invalid || this.representatives.value > this.maxParticipants || this.representatives.value < 0) &&
            (this.representatives.dirty || this.representatives.touched || this.failedSubmission)
        );
    }

    get observersInvalid() {
        return (
            (this.observers.invalid || this.observers.value > this.maxParticipants || this.observers.value < 0) &&
            (this.observers.dirty || this.observers.touched || this.failedSubmission)
        );
    }

    get panelMembersInvalid() {
        return (
            (this.panelMembers.invalid || this.panelMembers.value > this.maxParticipants || this.panelMembers.value < 0) &&
            (this.panelMembers.dirty || this.panelMembers.touched || this.failedSubmission)
        );
    }

    startHoursInPast() {
        const todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        const realDate = new Date(new Date(this.hearingDate.value).setHours(0, 0, 0, 0));
        const todayHours = new Date().getHours();
        this.isStartMinutesInPast = false;
        this.isStartHoursInPast =
            realDate.toString() === todayDate.toString() &&
            this.hearingStartTimeHour.value < todayHours &&
            (this.hearingStartTimeHour.dirty || this.hearingStartTimeHour.touched);
    }

    startMinutesInPast() {
        const todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        const realDate = new Date(new Date(this.hearingDate.value).setHours(0, 0, 0, 0));
        const todayHours = new Date().getHours();
        const todayMinutes = new Date().getMinutes();
        this.isStartMinutesInPast =
            realDate.toString() === todayDate.toString() &&
            this.hearingStartTimeHour.value === todayHours &&
            this.hearingStartTimeMinute.value <= todayMinutes &&
            (this.hearingStartTimeMinute.dirty || this.hearingStartTimeMinute.touched);
    }

    get hearingStartTimeMinuteInvalid() {
        return (
            this.hearingStartTimeMinute.invalid &&
            (this.hearingStartTimeMinute.dirty || this.hearingStartTimeMinute.touched || this.failedSubmission)
        );
    }

    resetPastTimeOnBlur() {
        this.isStartHoursInPast = false;
        this.isStartMinutesInPast = false;
    }

    private populateHearingRequest() {
        this.hearingModel.test_type = this.testTypeDropdown.value;
        const hearingDate = new Date(this.form.value.hearingDate);
        hearingDate.setHours(this.form.value.hearingStartTimeHour, this.form.value.hearingStartTimeMinute);
        this.hearingModel.scheduled_date_time = hearingDate;
        this.logger.debug(`${this.loggerPrefix} Scheduled date: ${hearingDate}`);
        this.hearingModel.questionnaire_not_required = this.questionnaireNotRequiredCheckBox.value;
        this.hearingModel.audio_recording_required = this.audioRecordingRequiredCheckBox.value;
    }

    async saveBooking() {
        if (this.form.valid) {
            this.spinnerService.show();
            this.enableResetButton = true;
            this.bookingsSaving = true;
            this.populateHearingRequest();
            this.logger.debug(`${this.loggerPrefix} Test type: ${this.testType.value} Questionnaire not required:
      ${this.questionnaireNotRequired.value} Audio recording required: ${this.audioRecordingRequired.value}
      Individuals: ${this.individuals.value} Representatives: ${this.representatives.value} Observers:
      ${this.observers.value} Panel Members: ${this.panelMembers.value} Number of hearings: ${this.quantity.value}`);
            this.failedSubmission = false;
            this.form.markAsPristine();

            for (let index = 0; index < this.quantity.value; index++) {
                this.createAllocateUsersModels();
                this.progressOutput = this.progressOutput + `[Allocating] `;
                await this.sendAllocationRequest();
                this.progressOutput = this.progressOutput + `Complete. ${this.allocatedUsers.length} users allocated.\n`;
                this.addUsersToHearingModel();
                this.progressOutput = this.progressOutput + `[Creating hearing] `;
                await this.sendHearingRequest();
                this.progressOutput = this.progressOutput + `Complete. Conference ID: ${this.hearingResponse.id}\n`;
                this.createConfirmModel();
                this.progressOutput = this.progressOutput + `[Confirming hearing] `;
                await this.sendConfirmRequest();
                this.progressOutput = this.progressOutput + `Complete. Hearing ID: ${this.confirmResponse.id}\n`;
                this.progressOutput = this.progressOutput + `[Resetting user passwords] `;
                await this.resetPasswords();
                this.progressOutput = this.progressOutput + `Complete. ${this.userPasswords.size()} passwords reset.\n`;
                this.mapConferenceToSummary();
                this.outputConferenceToSummary();
                this.allocatedUsers.splice(0, this.allocatedUsers.length);
            }

            this.spinnerService.hide();
            this.bookingsSaved = true;
            this.enableCopyButton = true;
        } else {
            this.spinnerService.hide();
            this.logger.debug(`${this.loggerPrefix} Failed to create booking. Form is not valid.`);
            this.failedSubmission = true;
        }
    }

    private async resetPasswords() {
        for (const user of this.allocatedUsers) {
            await this.sendResetPasswordRequest(user.username);
            this.logger.debug(`${this.loggerPrefix} User ${user.username} password reset to ${this.resetResponse.new_password}`);
            this.userPasswords.add(user.username, this.resetResponse.new_password);
        }
    }

    private createAllocateUsersModels() {
        this.logger.debug(`${this.loggerPrefix} CREATING ALLOCATION MODEL`);
        this.allocateUsersModel = new AllocateUsersModel();
        this.allocateUsersModel.test_type = this.testType.value;
        this.addUserTypesToModel(1, UserType.Judge);
        this.addUserTypesToModel(this.individuals.value, UserType.Individual);
        this.addUserTypesToModel(this.representatives.value, UserType.Representative);
        this.addUserTypesToModel(this.observers.value, UserType.Observer);
        this.addUserTypesToModel(this.panelMembers.value, UserType.PanelMember);
        this.logger.debug(
            `${this.loggerPrefix} ${this.allocateUsersModel.usertypes.length} have been added the allocation request in total`
        );
    }

    private addUserTypesToModel(quantity: number, userType: UserType) {
        if (quantity > 0) {
            for (let i = 0; i < quantity; i++) {
                this.logger.debug(`${this.loggerPrefix} Added a ${userType} number ${i + 1} to the allocation request`);
                this.allocateUsersModel.usertypes.push(userType);
            }
        }
    }

    private async sendAllocationRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING ALLOCATION REQUEST`);
        try {
            const allocationDetailsResponse = await this.testApiService.allocateUsers(this.allocateUsersModel);
            this.logger.debug(`${this.loggerPrefix} ${allocationDetailsResponse.length} users allocated`);
            this.allocatedUsers = MapAllocatedResponseToUsers.map(allocationDetailsResponse);

            this.allocatedUsers.forEach(user => {
                this.logger.debug(`${this.loggerPrefix} Allocated ${user.user_type} with username ${user.username}`);
            });
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to allocate users.`, error, { payload: this.allocateUsersModel });
        }
    }

    private addUsersToHearingModel() {
        this.logger.debug(`${this.loggerPrefix} ADDING USERS TO HEARING REQUEST`);
        this.logger.debug(`${this.loggerPrefix} Adding ${this.allocatedUsers.length} allocated users to the hearing model`);
        this.hearingModel.users = this.allocatedUsers;
    }

    private async sendHearingRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING HEARING REQUEST`);
        try {
            this.hearingResponse = await this.testApiService.createHearing(this.hearingModel);
            this.logger.debug(`${this.loggerPrefix} HEARING CREATED.`);
            this.logger.debug(`${this.loggerPrefix} Hearing Response  ${this.hearingResponse}.`, { payload: this.hearingResponse });
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to create hearing.`, error, { payload: this.hearingModel });
        }
    }

    private createConfirmModel() {
        this.logger.debug(`${this.loggerPrefix} CREATING CONFIRM MODEL`);
        let updatedBy = null;
        this.allocatedUsers.forEach(user => {
            if (user.user_type === UserType.VideoHearingsOfficer) {
                updatedBy = user.username;
            }
        });

        if (updatedBy == null) {
            updatedBy = UserData.UpdatedBy;
        }

        this.confirmModel = new ConfirmHearingModel(updatedBy);
    }

    private async sendConfirmRequest() {
        this.logger.debug(`${this.loggerPrefix} SENDING CONFIRM REQUEST`);
        try {
            this.confirmResponse = await this.testApiService.confirmHearing(this.hearingResponse.id, this.confirmModel);
            this.logger.debug(`${this.loggerPrefix} CONFERENCE CREATED.`);
            this.logger.debug(`${this.loggerPrefix} Confirm Response  ${this.confirmResponse}.`, { payload: this.confirmResponse });
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to confirm hearing.`, error, { payload: this.hearingModel });
        }
    }

    private async sendResetPasswordRequest(username: string) {
        this.logger.debug(`${this.loggerPrefix} RESETTING USER WITH USERNAME ${username}`);
        try {
            this.resetResponse = await this.testApiService.resetUserPassword(username);
            this.logger.debug(`${this.loggerPrefix} PASSWORD RESET.`);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to reset password for ${username}.`, error, { payload: username });
        }
    }

    private async mapConferenceToSummary() {
        this.logger.debug(`${this.loggerPrefix} MAPPING CONFERENCE TO SUMMARY`);
        this.logger.debug(`${this.loggerPrefix} User passwords ready to convert: ${this.userPasswords.size()}`);
        this.conferenceSummary = new ConferenceSummary(this.confirmResponse, this.userPasswords);
        this.conferenceSummaries.push(this.conferenceSummary);
        this.logger.debug(`${this.loggerPrefix} Conference summary is ${this.conferenceSummary.asText()}.`);
    }

    private outputConferenceToSummary() {
        this.logger.debug(`${this.loggerPrefix} OUTPUTTING SUMMARIES`);
        this.summaryOutput = '';
        for (const summary of this.conferenceSummaries) {
            this.summaryOutput = this.summaryOutput + summary.asText();
        }
        this.summaryTextfield.setValue(this.summaryOutput);
    }

    copyHearing() {
        this.clipboardService.copyFromContent(this.summaryOutput);
        this.tooltip = 'Conference details copied to clipboard';
        this.logger.debug(`${this.loggerPrefix} Copied conference details to clipboard.`, { Summary: this.summaryOutput });
    }

    resetText() {
        this.tooltip = 'Copy conference details to clipboard';
    }

    reset() {
        window.location.reload();
    }
}
