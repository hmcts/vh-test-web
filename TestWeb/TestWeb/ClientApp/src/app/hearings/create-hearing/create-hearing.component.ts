import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CreateService } from 'src/app/services/test-api/create-service';
import { HearingFormData } from 'src/app/services/test-api/models/hearing-form-data';
import { Summary } from 'src/app/services/test-api/models/summary';
import { SummeriesService } from 'src/app/services/test-api/summeries-service';
import { PageUrls } from 'src/app/shared/page-url.constants';
import { Constants } from '../../common/constants';
import { TestType } from '../../services/clients/api-client';
import { Logger } from '../../services/logging/logger-base';

@Component({
    selector: 'app-create-hearing',
    templateUrl: './create-hearing.component.html',
    styleUrls: ['./create-hearing.component.css']
})
export class CreateHearingComponent implements OnInit, OnDestroy {
    protected readonly loggerPrefix: string = '[Create Hearing(s)] -';
    testTypes: TestType[] = [Constants.TestTypes.Demo, Constants.TestTypes.ITHC, Constants.TestTypes.Manual];
    numberOfHearingsOptions: number[] = [1, 2, 3, 4];
    numberOfEndpointsOptions: number[] = [0, 1, 2, 3, 4];
    private defaultTestType: string = Constants.TestTypes.Manual;
    defaultQuestionnaireNotRequired = true;
    defaultAudioRecordingRequired = false;
    defaultReuseUsers = true;
    private defaultIndividuals = 1;
    private defaultInterpreters = 0;
    private defaultRepresentatives = 0;
    private defaultObservers = 0;
    private defaultPanelMembers = 0;
    private defaultWitnesses = 0;
    private defaultNumberOfHearings = 1;
    private defaultNumberOfEndpoints = 0;
    maxParticipants = 21;
    today = new Date();
    form: FormGroup;
    buttonAction = 'Book & Confirm';
    $subscriptions: Subscription[] = [];
    testTypeDropdown: FormControl;
    customCaseNamePrefix: FormControl;
    questionnaireNotRequiredCheckBox: FormControl;
    audioRecordingRequiredCheckBox: FormControl;
    reuseUsersCheckBox: FormControl;
    individualsTextfield: FormControl;
    interpretersTextfield: FormControl;
    representativesTextfield: FormControl;
    observersTextfield: FormControl;
    panelMembersTextfield: FormControl;
    witnessesTextfield: FormControl;
    quantityDropdown: FormControl;
    endpointsDropdown: FormControl;
    isStartHoursInPast: boolean;
    isStartMinutesInPast: boolean;
    bookingsSaving = false;
    bookingsSaved = true;
    tooltip: string;
    displayProgressPopup: boolean;
    enableContinueButton = false;
    enableCloseButton = false;
    finishedCreatingHearings = false;
    errorsOccured = false;
    errors = [];
    caseNames = [];
    summeries: Summary[];

    constructor(
        private fb: FormBuilder,
        protected logger: Logger,
        private datePipe: DatePipe,
        protected router: Router,
        private summeriesService: SummeriesService,
        private createService: CreateService,
        private spinnerService: NgxSpinnerService
    ) {
        this.displayProgressPopup = false;
    }

    ngOnInit() {
        this.resetData();
        this.initForm();
        this.buttonAction = 'Book & Confirm';
        this.$subscriptions.push(this.form.valueChanges.subscribe(() => {}));
    }

    ngOnDestroy(): void {
        this.$subscriptions.forEach(subscription => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    private resetData() {
        this.summeriesService.resetSummaries();
    }

    async displayConfirmationDialog() {
        this.bookingsSaving = true;
        this.form.markAsPristine();
        const data = this.setHearingFormData();
        this.displayProgressPopup = true;
        this.spinnerService.show();
        await this.createHearings(data);
        this.finishedCreatingHearings = true;
        this.spinnerService.hide();
    }

    async createHearings(hearingFormData: HearingFormData): Promise<void> {
        try {
            this.summeries = await this.createService.createHearings(hearingFormData);
            for (const summary of this.summeries) {
                const casename = summary.getCaseName();
                this.caseNames.push(casename);
            }
            this.enableContinueButton = true;
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to create hearings.`, error);
            this.errors.push(error);
            this.enableCloseButton = true;
        }
    }

    summeriesToDisplay(): boolean {
        if (this.summeries != null && this.summeries.length > 0) {
            return true;
        }
        return false;
    }

    errorsToDisplay(): boolean {
        if (this.errors != null && this.errors.length > 0) {
            this.errorsOccured = true;
            return true;
        }
        return false;
    }

    multipleHearings() {
        if (this.quantityDropdown.value > 1) {
            return true;
        }
        return false;
    }

    continue() {
        this.router.navigate([PageUrls.Summary]);
    }

    goBackToHearings() {
        this.router.navigate([PageUrls.CreateHearings]);
    }

    private setHearingFormData(): HearingFormData {
        const data = new HearingFormData();
        data.audioRecordingRequired = this.audioRecordingRequiredCheckBox.value;
        if (this.customCaseNamePrefix.value !== null) {
            const caseName: string = this.customCaseNamePrefix.value;
            data.customCaseNamePrefix = caseName.trim();
        }
        const hearingDate = new Date(this.form.value.hearingDate);
        hearingDate.setHours(this.form.value.hearingStartTimeHour, this.form.value.hearingStartTimeMinute);
        data.hearingDate = hearingDate;
        data.hearingStartTimeHour = this.form.value.hearingStartTimeHour;
        data.hearingStartTimeMinute = this.form.value.hearingStartTimeMinute;
        data.individuals = this.individualsTextfield.value;
        data.interpreters = this.interpretersTextfield.value;
        data.numberOfHearings = this.quantityDropdown.value;
        data.numberOfEndpoints = this.endpointsDropdown.value;
        data.observers = this.observersTextfield.value;
        data.panelMembers = this.panelMembersTextfield.value;
        data.questionnaireNotRequired = this.questionnaireNotRequiredCheckBox.value;
        data.representatives = this.representativesTextfield.value;
        data.reuseUsers = this.reuseUsersCheckBox.value;
        data.scheduledDateTime = hearingDate;
        data.testType = this.testTypeDropdown.value;
        data.witnesses = this.witnessesTextfield.value;
        this.logger.debug(`${this.loggerPrefix} Hearing form data:`, { payload: data });
        return data;
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

        this.customCaseNamePrefix = new FormControl();
        this.testTypeDropdown = new FormControl(this.defaultTestType);
        this.questionnaireNotRequiredCheckBox = new FormControl(this.defaultQuestionnaireNotRequired);
        this.audioRecordingRequiredCheckBox = new FormControl(this.defaultAudioRecordingRequired);
        this.individualsTextfield = new FormControl(this.defaultIndividuals);
        this.interpretersTextfield = new FormControl(this.defaultInterpreters);
        this.representativesTextfield = new FormControl(this.defaultRepresentatives);
        this.observersTextfield = new FormControl(this.defaultObservers);
        this.panelMembersTextfield = new FormControl(this.defaultPanelMembers);
        this.quantityDropdown = new FormControl(this.defaultNumberOfHearings);
        this.endpointsDropdown = new FormControl(this.defaultNumberOfEndpoints);
        this.reuseUsersCheckBox = new FormControl(this.defaultReuseUsers);
        this.witnessesTextfield = new FormControl(this.defaultWitnesses);

        this.form = this.fb.group({
            customCaseNamePrefix: this.customCaseNamePrefix,
            testTypeDropdown: this.testTypeDropdown,
            hearingDate: [hearingDateParsed, Validators.required],
            hearingStartTimeHour: [startTimeHour, [Validators.required, Validators.min(0), Validators.max(23)]],
            hearingStartTimeMinute: [startTimeMinute, [Validators.required, Validators.min(0), Validators.max(59)]],
            questionnaireNotRequiredCheckBox: this.questionnaireNotRequiredCheckBox,
            audioRecordingRequiredCheckBox: this.audioRecordingRequiredCheckBox,
            individualsTextfield: this.individualsTextfield,
            interpretersTextfield: this.interpretersTextfield,
            representativesTextfield: this.representativesTextfield,
            observersTextfield: this.observersTextfield,
            panelMembersTextfield: this.panelMembersTextfield,
            quantityDropdown: this.quantityDropdown,
            endpointsDropdown: this.endpointsDropdown,
            reuseUsersCheckBox: this.reuseUsersCheckBox,
            witnessesTextfield: this.witnessesTextfield
        });
    }

    private addMinutes(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes * 60000);
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

    get hearingDateInvalid() {
        const todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        return (
            (this.hearingDate.invalid || new Date(this.hearingDate.value) < todayDate) &&
            (this.hearingDate.dirty || this.hearingDate.touched)
        );
    }

    get hearingDateExceedsMax() {
        const hearingDate = new Date(this.hearingDate.value);
        const todaysDate = new Date();
        const maxDaysAllowed = 30;
        const maxDate = todaysDate.setDate(todaysDate.getDate() + maxDaysAllowed);
        return maxDate.valueOf() < hearingDate.valueOf();
    }

    get hearingStartTimeHourInvalid() {
        return this.hearingStartTimeHour.invalid && (this.hearingStartTimeHour.dirty || this.hearingStartTimeHour.touched);
    }

    get individualsInvalid() {
        return this.individualsTextfield.value > this.maxParticipants || this.individualsTextfield.value < 0;
    }

    get interpretersInvalid() {
        return this.interpretersTextfield.value > this.maxParticipants || this.interpretersTextfield.value.value < 0;
    }

    get representativesInvalid() {
        return this.representativesTextfield.value > this.maxParticipants || this.representativesTextfield.value < 0;
    }

    get observersInvalid() {
        return this.observersTextfield.value > this.maxParticipants || this.observersTextfield.value < 0;
    }

    get panelMembersInvalid() {
        return this.panelMembersTextfield.value > this.maxParticipants || this.panelMembersTextfield.value < 0;
    }

    get witnessesInvalid() {
        return this.witnessesTextfield.value > this.maxParticipants || this.witnessesTextfield.value < 0;
    }

    get noIndividualsOrReps() {
        return this.individualsTextfield.value + this.representativesTextfield.value === 0;
    }

    startHoursInPast() {
        const todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        const realDate = new Date(new Date(this.hearingDate.value).setHours(0, 0, 0, 0));
        const todayHours = new Date().getHours();
        this.isStartHoursInPast = realDate.toString() === todayDate.toString() && this.hearingStartTimeHour.value < todayHours;
    }

    startMinutesInPast() {
        const todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        const realDate = new Date(new Date(this.hearingDate.value).setHours(0, 0, 0, 0));
        const todayHours = new Date().getHours();
        const todayMinutes = new Date().getMinutes();
        this.isStartMinutesInPast =
            realDate.toString() === todayDate.toString() &&
            this.hearingStartTimeHour.value === todayHours &&
            this.hearingStartTimeMinute.value <= todayMinutes;
    }

    get hearingStartTimeMinuteInvalid() {
        return this.hearingStartTimeMinute.invalid && (this.hearingStartTimeMinute.dirty || this.hearingStartTimeMinute.touched);
    }

    disableBookButton() {
        return (
            this.hearingDateInvalid ||
            this.hearingDateExceedsMax ||
            this.hearingStartTimeHourInvalid ||
            this.hearingStartTimeMinuteInvalid ||
            this.individualsInvalid ||
            this.interpretersInvalid ||
            this.representativesInvalid ||
            this.observersInvalid ||
            this.panelMembersInvalid ||
            this.witnessesInvalid ||
            this.noIndividualsOrReps
        );
    }

    resetPastTimeOnBlur() {
        this.isStartHoursInPast = false;
        this.isStartMinutesInPast = false;
    }

    reset() {
        this.enableCloseButton = false;
        window.location.reload();
    }
}
