import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HearingFormDataService } from 'src/app/services/test-api/hearing-form-data-service';
import { HearingFormData } from 'src/app/services/test-api/models/hearing-form-data';
import { SummeriesService } from 'src/app/services/test-api/summeries-service';
import { PageUrls } from 'src/app/shared/page-url.constants';
import { Constants } from '../../common/constants';
import { TestType } from '../../services/clients/api-client';
import { Logger } from '../../services/logging/logger-base';
import { HearingBaseComponentDirective } from '../hearing-base/hearing-base-component';

@Component({
    selector: 'app-create-hearing',
    templateUrl: './create-hearing.component.html',
    styleUrls: ['./create-hearing.component.css']
})
export class CreateHearingComponent extends HearingBaseComponentDirective implements OnInit, OnDestroy {
    protected readonly loggerPrefix: string = '[Create Hearing(s)] -';
    testTypes: TestType[] = [Constants.TestTypes.Demo, Constants.TestTypes.ITHC, Constants.TestTypes.Manual];
    numbers: number[] = [1, 2, 3, 4];
    private defaultTestType: string = Constants.TestTypes.Manual;
    defaultQuestionnaireNotRequired = true;
    defaultAudioRecordingRequired = false;
    private defaultIndividuals = 1;
    private defaultRepresentatives = 0;
    private defaultObservers = 0;
    private defaultPanelMembers = 0;
    private defaultNumberOfHearings = 1;
    maxParticipants = 21;
    today = new Date();
    form: FormGroup;
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
    isStartHoursInPast: boolean;
    isStartMinutesInPast: boolean;
    bookingsSaving = false;
    bookingsSaved = true;
    tooltip: string;
    displayProgressPopup: boolean;

    constructor(
        private fb: FormBuilder,
        protected logger: Logger,
        private datePipe: DatePipe,
        protected router: Router,
        private hearingFormDataService: HearingFormDataService,
        private summeriesService: SummeriesService
    ) {
      super(router, logger);
      this.displayProgressPopup = false;
    }

    ngOnInit() {
      this.resetData();
      this.initForm();
      this.buttonAction = 'Book & Confirm';
      this.form.valueChanges.subscribe(() => {});
    }

    ngOnDestroy(): void {
        this.$subscriptions.forEach(subscription => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    private resetData(){
      this.hearingFormDataService.resetHearingFormData();
      this.summeriesService.resetSummaries();
    }

    displayConfirmationDialog() {
      this.bookingsSaving = true;
      this.form.markAsPristine();
      this.setHearingFormData();
      this.router.navigate([PageUrls.Progress]);
      //this.displayProgressPopup = true;
    }

    private setHearingFormData(){
      var data = new HearingFormData();
      data.audioRecordingRequired = this.audioRecordingRequiredCheckBox.value;
      const hearingDate = new Date(this.form.value.hearingDate);
      hearingDate.setHours(this.form.value.hearingStartTimeHour, this.form.value.hearingStartTimeMinute);
      data.hearingDate = hearingDate;
      data.hearingStartTimeHour = this.form.value.hearingStartTimeHour;
      data.hearingStartTimeMinute = this.form.value.hearingStartTimeMinute;
      data.individuals = this.individuals.value
      data.numberOfHearings = this.quantity.value;
      data.observers = this.observers.value;
      data.panelMembers = this.panelMembers.value;
      data.questionnaireNotRequired = this.questionnaireNotRequiredCheckBox.value;
      data.representatives = this.representatives.value;
      data.scheduledDateTime = hearingDate;
      data.testType = this.testType.value;
      this.hearingFormDataService.setHearingFormData(data);
      this.logger.debug(`${this.loggerPrefix} Hearing form data:`, { payload: data });
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
            (this.hearingDate.dirty || this.hearingDate.touched)
        );
    }

    get hearingStartTimeHourInvalid() {
        return (
            this.hearingStartTimeHour.invalid &&
            (this.hearingStartTimeHour.dirty || this.hearingStartTimeHour.touched)
        );
    }

    get individualsInvalid() {
        return (
            (this.individuals.invalid || this.individuals.value > this.maxParticipants || this.individuals.value < 0) &&
            (this.individuals.dirty || this.individuals.touched)
        );
    }

    get representativesInvalid() {
        return (
            (this.representatives.invalid || this.representatives.value > this.maxParticipants || this.representatives.value < 0) &&
            (this.representatives.dirty || this.representatives.touched)
        );
    }

    get observersInvalid() {
        return (
            (this.observers.invalid || this.observers.value > this.maxParticipants || this.observers.value < 0) &&
            (this.observers.dirty || this.observers.touched)
        );
    }

    get panelMembersInvalid() {
        return (
            (this.panelMembers.invalid || this.panelMembers.value > this.maxParticipants || this.panelMembers.value < 0) &&
            (this.panelMembers.dirty || this.panelMembers.touched)
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
            (this.hearingStartTimeMinute.dirty || this.hearingStartTimeMinute.touched)
        );
    }

    resetPastTimeOnBlur() {
        this.isStartHoursInPast = false;
        this.isStartMinutesInPast = false;
    }

    reset() {
        window.location.reload();
    }
}
