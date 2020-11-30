import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from '../common/constants';
import { AllocateUsersModel } from '../common/models/allocate.users.model';
import { ConfirmHearingModel } from '../common/models/confirm.hearing.model';
import { HearingModel } from '../common/models/hearing.model';
import { UserModel } from '../common/models/user.model';
import { MapAllocatedResponseToUsers } from '../services/api/mappers/map-allocated-users-details-response-to-users-model';
import { HearingDetailsResponse, UserDetailsResponse, UserType } from '../services/clients/api-client';
import { ErrorService } from '../services/error.service';
import { Logger } from '../services/logging/logger-base';
import { TestApiService } from '../services/test-api-service';
import { PageUrls } from '../shared/page-url.constants';

@Component({
  selector: 'app-create-hearing',
  templateUrl: './create-hearing.component.html',
  styleUrls: ['./create-hearing.component.css']
})
export class CreateHearingComponent implements OnInit, OnDestroy {
  private hearingModel: HearingModel;
  private allocateUsersModel: AllocateUsersModel;
  private confirmModel: ConfirmHearingModel;
  private allocatedUsers: UserModel[];
  private hearingResponse: HearingDetailsResponse;
  private readonly loggerPrefix: string = '[Create Hearing(s)] -';
  private hasSaved = false;
  private failedSubmission: boolean;
  testTypes: string[] = [Constants.TestTypes.Demo, Constants.TestTypes.Manual];
  numbers: number[] = [1, 2, 3, 4, 5];
  private defaultTestType: string = Constants.TestTypes.Manual;
  defaultQuestionnaireNotRequired = true;
  defaultAudioRecordingRequired = false;
  private defaultIndividuals = 1;
  private defaultRepresentatives = 1;
  private defaultObservers = 0;
  private defaultPanelMembers = 0;
  private defaultNumberOfHearings = 1;
  today = new Date();
  form: FormGroup;
  buttonAction: string;
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
  confirmResponse: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private logger: Logger,
    private testApiService: TestApiService,
    private errorService: ErrorService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.createNewHearingModel();
    this.initForm();
    this.buttonAction = 'Book';
    this.form.valueChanges.subscribe(() => {
    });
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
        this.individuals.invalid &&
        (this.individuals.dirty || this.individuals.touched || this.failedSubmission)
    );
  }

  get representativesInvalid() {
    return (
        this.representatives.invalid &&
        (this.representatives.dirty || this.representatives.touched || this.failedSubmission)
    );
  }

  get observersInvalid() {
    return (
        this.observers.invalid &&
        (this.observers.dirty || this.observers.touched || this.failedSubmission)
    );
  }

  get panelMembersInvalid() {
    return (
        this.panelMembers.invalid &&
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
    // reset flag if the date was changed
    this.isStartHoursInPast = false;
    this.isStartMinutesInPast = false;
  }

  private updateHearingRequest() {
    this.hearingModel.test_type = this.testTypeDropdown.value;

    const hearingDate = new Date(this.form.value.hearingDate);
    hearingDate.setHours(this.form.value.hearingStartTimeHour, this.form.value.hearingStartTimeMinute);
    this.hearingModel.scheduled_date_time = hearingDate;
    this.logger.debug(`${this.loggerPrefix} Scheduled date is ${hearingDate}`);

    this.hearingModel.questionnaire_not_required = this.questionnaireNotRequiredCheckBox.value;
    this.hearingModel.audio_recording_required = this.audioRecordingRequiredCheckBox.value;
  }

  saveBooking() {
    if (this.form.valid) {
      this.bookingsSaving = true;
      this.logger.debug(`${this.loggerPrefix} Creating booking.`);
      this.updateHearingRequest();
      this.logger.debug(`${this.loggerPrefix} Test type is ${this.testType.value}`);
      this.logger.debug(`${this.loggerPrefix} Questionnaire not required is ${this.questionnaireNotRequired.value}`);
      this.logger.debug(`${this.loggerPrefix} Audio recording required is ${this.audioRecordingRequired.value}`);
      this.logger.debug(`${this.loggerPrefix} Individuals required is ${this.individuals.value}`);
      this.logger.debug(`${this.loggerPrefix} Representatives required is ${this.representatives.value}`);
      this.logger.debug(`${this.loggerPrefix} Observers required is ${this.observers.value}`);
      this.logger.debug(`${this.loggerPrefix} Panel Members required is ${this.panelMembers.value}`);
      this.logger.debug(`${this.loggerPrefix} Number of hearings required is ${this.quantity.value}`);
      this.failedSubmission = false;
      this.form.markAsPristine();
      this.createAllocateUsersModels();
      this.sendAllocationRequest();
      this.addUsersToHearingModel();
      this.sendHearingRequest();
      this.createConfirmModel();
      this.sendConfirmRequest();
      this.hasSaved = true;
       // this.router.navigate([PageUrls.Summary]);
      this.logger.debug(`${this.loggerPrefix} Booking created.`);
    } else {
        this.logger.debug(`${this.loggerPrefix} Failed to create booking. Form is not valid.`);
        this.failedSubmission = true;
    }
  }

  private createAllocateUsersModels() {
    this.allocateUsersModel = new AllocateUsersModel();
    this.allocateUsersModel.test_type = this.testType.value;
    this.addUserTypesToModel(1, UserType.Judge);
    this.addUserTypesToModel(1, UserType.VideoHearingsOfficer);
    this.addUserTypesToModel(this.individuals.value, UserType.Individual);
    this.addUserTypesToModel(this.representatives.value, UserType.Representative);
    this.addUserTypesToModel(this.observers.value, UserType.Observer);
    this.addUserTypesToModel(this.panelMembers.value, UserType.PanelMember);
  }

  private addUserTypesToModel(quantity: number, userType: UserType) {
    if (quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        this.logger.debug(`${this.loggerPrefix} Allocating ${userType} number ${i + 1}`);
        this.allocateUsersModel.usertypes.push(userType);
      }
    }
  }

  private async sendAllocationRequest() {
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
    this.logger.debug(`${this.loggerPrefix} Adding ${this.allocatedUsers.length} allocated users to the hearing model`);
    this.hearingModel.users = this.allocatedUsers;
  }

  private async sendHearingRequest() {
    try {
      this.hearingResponse = await this.testApiService.createHearing(this.hearingModel);
    } catch (error) {
      this.logger.error(`${this.loggerPrefix} Failed to create hearing.`, error, { payload: this.hearingModel });
    }
  }

  private createConfirmModel() {
    let updatedBy = null;
    this.allocatedUsers.forEach(user => {
      if (user.user_type === UserType.VideoHearingsOfficer){
        updatedBy = user.username;
      }
    });

    this.confirmModel = new ConfirmHearingModel(updatedBy);
  }

  private async sendConfirmRequest() {
    try {
      this.confirmResponse = await this.testApiService.confirmHearing(this.hearingResponse.id, this.confirmModel);
    } catch (error) {
      this.logger.error(`${this.loggerPrefix} Failed to confirm hearing.`, error, { payload: this.hearingModel });
    }
  }
}
