import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConferenceResponse, EventType, UserRole } from 'src/app/services/clients/api-client';
import { Logger } from 'src/app/services/logging/logger-base';
import { ConferenceService } from '../services/test-api/conference-service';
import { EventsService } from '../services/test-api/event-service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
    form: FormGroup;
    protected readonly loggerPrefix: string = '[Events] -';
    caseNames: string[] = ['Please select'];
    hearingEventTypes: string[] = [
        EventType.None,
        EventType.Close,
        EventType.CountdownFinished,
        EventType.Pause,
        EventType.Start,
        EventType.Suspend
    ];
    participantEventTypes: string[] = [
        EventType.None,
        EventType.ConnectingToConference,
        EventType.ConnectingToEventHub,
        EventType.Consultation,
        EventType.Disconnected,
        EventType.EndpointDisconnected,
        EventType.EndpointJoined,
        EventType.EndpointTransfer,
        EventType.Help,
        EventType.Joined,
        EventType.Leave,
        EventType.MediaPermissionDenied,
        EventType.ParticipantJoining,
        EventType.ParticipantNotSignedIn,
        EventType.SelectingMedia,
        EventType.SelfTestFailed,
        EventType.Transfer,
        EventType.VhoCall
    ];
    private pleaseSelectCaseName = 'Please select';
    private defaultEventType = EventType.None;
    private defaultTransferFromRoomType = 'WaitingRoom';
    private defaultTransferToRoomType = 'WaitingRoom';
    hearingEventTypeDropdown: FormControl;
    participantEventTypeDropdown: FormControl;
    caseNamesDropdown: FormControl;
    enableFetchingCaseNamesText = true;
    errorRetrievingConferences = false;
    errorSendingEvent = false;
    enableCaseNameDropdown = false;
    enableHearingEventTypesDropdown = false;
    enableParticipantEventTypesDropdown = false;
    enableRefreshConferenceDetailsButton = false;
    displayPopup = false;
    enableCloseButton = false;
    displayConferenceDetails = false;
    error: string;
    conferences: ConferenceResponse[] = [];
    conference: ConferenceResponse;

    constructor(
        private fb: FormBuilder,
        private logger: Logger,
        private conferenceService: ConferenceService,
        private eventsService: EventsService,
        private spinnerService: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.spinnerService.hide();
        this.getCaseNames();
        this.initForm();
    }

    private initForm() {
        this.caseNamesDropdown = new FormControl(this.pleaseSelectCaseName);
        this.hearingEventTypeDropdown = new FormControl(this.defaultEventType);
        this.form = this.fb.group({
            caseNamesDropdown: this.caseNamesDropdown,
            hearingEventTypeDropdown: this.hearingEventTypeDropdown
        });
    }

    private async getCaseNames() {
        this.spinnerService.show();
        this.conferences = await this.getConferences();
        this.spinnerService.hide();

        if (this.conferences !== undefined) {
            this.logger.debug(`${this.loggerPrefix} CONFERENCES IS ${this.conferences}.`);
            for (const conference of this.conferences) {
                this.caseNames.push(conference.case_name);
            }
        }

        this.enableFetchingCaseNamesText = false;
        this.enableCaseNameDropdown = true;
    }

    async getConferences(): Promise<ConferenceResponse[]> {
        try {
            return await this.conferenceService.getConferencesForToday();
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to retrieve conferences.`, error);
            this.errorRetrievingConferences = true;
        }
    }

    refreshCaseNames() {
        this.enableFetchingCaseNamesText = true;
        this.enableCaseNameDropdown = false;
        this.enableHearingEventTypesDropdown = false;
        this.enableParticipantEventTypesDropdown = false;
        this.displayConferenceDetails = false;
        this.conference = undefined;
        this.caseNamesDropdown.setValue(this.pleaseSelectCaseName);
        this.caseNames = [];
        this.caseNames.push(this.pleaseSelectCaseName);
        this.getCaseNames();
    }

    selectCase() {
        this.enableHearingEventTypesDropdown = true;
        this.enableParticipantEventTypesDropdown = true;
        this.enableRefreshConferenceDetailsButton = true;
        if (this.conference !== undefined) {
            this.removeParticipantEventDropdownsFromForm();
        }
        this.conference = this.getSelectedConference();
        this.addParticipantEventDropdownsToForm();
        this.displayConferenceDetails = true;
    }

    caseNameSelected() {
        if (this.caseNamesDropdown.value !== this.pleaseSelectCaseName) {
            return true;
        }
        return false;
    }

    private getSelectedConference(): ConferenceResponse {
        if (this.conferences.length > 0) {
            for (const conference of this.conferences) {
                if (conference.case_name === this.caseNamesDropdown.value) {
                    this.logger.debug(`${this.loggerPrefix} Case Name selected ${conference.case_name}
              with hearing ref id ${conference.hearing_ref_id}`);
                    return conference;
                }
            }
        }
    }

    async sendHearingEvent(): Promise<void> {
        this.spinnerService.show();
        const judgeId = this.getJudgeParticipantId();
        const eventType = this.hearingEventTypeDropdown.value;
        await this.sendHearingEventToApi(judgeId, eventType);
        this.spinnerService.hide();
        await this.refreshConferenceDetails();
    }

    async sendHearingEventToApi(judgeId: string, eventType: EventType): Promise<void> {
        try {
            return await this.eventsService.createHearingEvent(this.conference.id, eventType, judgeId);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to send event.`, error);
            this.errorSendingEvent = true;
            this.error = error;
            this.displayPopup = true;
            this.enableCloseButton = true;
        }
    }

    async sendParticipantEvent(participant_id: string) {
        this.spinnerService.show();
        await this.sendParticipantEventToApi(participant_id);
        this.spinnerService.hide();
        await this.refreshConferenceDetails();
    }

    async sendParticipantEventToApi(participant_id: string): Promise<void> {
        try {
            let transferFrom = 'WaitingRoom';
            let transferTo = 'WaitingRoom';
            if (this.transferSelected) {
                transferFrom = this.getTransferFromValue(participant_id);
                transferTo = this.getTransferToValue(participant_id);
            }
            let participantRoomId = '';
            if (this.roomIdEventsSelected) {
                participantRoomId = this.getParticipantRoomIdValue(participant_id);
            }

            const eventType = this.getParticipantDropdownValue(participant_id);
            return await this.eventsService.createParticipantEvent(
                this.conference.id,
                participant_id,
                participantRoomId,
                eventType,
                transferFrom,
                transferTo
            );
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to send event.`, error);
            this.errorSendingEvent = true;
            this.error = error;
            this.displayPopup = true;
            this.enableCloseButton = true;
        }
    }

    async refreshConferenceDetails() {
        this.enableRefreshConferenceDetailsButton = false;
        this.spinnerService.show();
        this.conference = await this.getConferenceDetails();
        this.spinnerService.hide();
        this.enableRefreshConferenceDetailsButton = true;
    }

    private async getConferenceDetails() {
        try {
            return await this.conferenceService.getConferenceByHearingRefId(this.conference.hearing_ref_id);
        } catch (error) {
            this.logger.error(`${this.loggerPrefix} Failed to retrieve conference.`, error);
            this.errorRetrievingConferences = true;
            this.error = error;
            this.displayPopup = true;
            this.enableCloseButton = true;
        }
    }

    private addParticipantEventDropdownsToForm() {
        for (const participant of this.conference.participants) {
            this.form.addControl(`participant-event-type-dropdown-${participant.id}`, new FormControl(this.defaultEventType));
            this.form.addControl(`participant-room-id-textfield-${participant.id}`, new FormControl());
            this.form.addControl(
                `participant-transfer-from-textfield-${participant.id}`,
                new FormControl(this.defaultTransferFromRoomType)
            );
            this.form.addControl(`participant-transfer-to-textfield-${participant.id}`, new FormControl(this.defaultTransferToRoomType));
        }
    }

    private removeParticipantEventDropdownsFromForm() {
        for (const participant of this.conference.participants) {
            this.form.removeControl(`participant-event-type-dropdown-${participant.id}`);
            this.form.removeControl(`participant-room-id-textfield-${participant.id}`);
            this.form.removeControl(`participant-transfer-from-textfield-${participant.id}`);
            this.form.removeControl(`participant-transfer-to-textfield-${participant.id}`);
        }
    }

    hearingEventDropdownHasValue() {
        if (this.hearingEventTypeDropdown.value === EventType.None) {
            return false;
        }
        return true;
    }

    participantDropdownHasValue(participant_id: string) {
        const value = this.getParticipantDropdownValue(participant_id);
        if (value === EventType.None) {
            return false;
        }
        return true;
    }

    transferSelected(participant_id: string) {
        if (this.getParticipantDropdownValue(participant_id) === EventType.Transfer) {
            return true;
        }
        return false;
    }

    roomIdEventsSelected(participant_id: string) {
        if (
            this.getParticipantDropdownValue(participant_id) === EventType.Joined ||
            this.getParticipantDropdownValue(participant_id) === EventType.Disconnected ||
            this.getParticipantDropdownValue(participant_id) === EventType.Transfer
        ) {
            return true;
        }
        return false;
    }

    private getParticipantDropdownValue(participant_id: string) {
        return this.form.get(`participant-event-type-dropdown-${participant_id}`).value;
    }

    private getParticipantRoomIdValue(participant_id: string) {
        return this.form.get(`participant-room-id-textfield-${participant_id}`).value;
    }

    private getTransferFromValue(participant_id: string) {
        return this.form.get(`participant-transfer-from-textfield-${participant_id}`).value;
    }

    private getTransferToValue(participant_id: string) {
        return this.form.get(`participant-transfer-to-textfield-${participant_id}`).value;
    }

    private getJudgeParticipantId(): string {
        for (const participant of this.conference.participants) {
            if (participant.user_role === UserRole.Judge) {
                return participant.id;
            }
        }
    }

    transferFromInvalid(participant_id: string) {
        return this.getTransferFromValue(participant_id) === '';
    }

    transferToInvalid(participant_id: string) {
        return this.getTransferToValue(participant_id) === '';
    }

    transferValuesSetIfSelected(participant_id: string) {
        if (this.transferSelected(participant_id)) {
            if (this.transferFromInvalid(participant_id) || this.transferToInvalid(participant_id)) {
                return false;
            }
        }
        return true;
    }

    closeDialog() {
        this.displayPopup = false;
        this.enableCloseButton = false;
        this.errorSendingEvent = false;
        this.errorRetrievingConferences = false;
        this.error = undefined;
    }
}
