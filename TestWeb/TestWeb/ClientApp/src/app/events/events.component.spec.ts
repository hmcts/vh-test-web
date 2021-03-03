import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Logger } from '../services/logging/logger-base';
import { SharedModule } from '../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventsComponent } from './events.component';
import { EventsService } from '../services/test-api/event-service';
import { EventType } from '../services/clients/api-client';
import { TestApiServiceTestData } from '../testing/mocks/testapiservice-test-data';
import { ConferenceService } from '../services/test-api/conference-service';
import { FormControl } from '@angular/forms';

describe('EventsComponent', () => {
    let component: EventsComponent;
    let fixture: ComponentFixture<EventsComponent>;
    const testData = new TestApiServiceTestData();
    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const eventsServiceSpy = jasmine.createSpyObj<EventsService>('EventsService', ['createHearingEvent', 'createParticipantEvent']);
    const conferenceServiceSpy = jasmine.createSpyObj<ConferenceService>('ConferenceService', [
        'getConferenceByHearingRefId',
        'getConferencesForToday'
    ]);
    const error = { error: 'not found!' };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: Logger, useValue: loggerSpy },
                { provide: EventsService, useValue: eventsServiceSpy },
                { provide: ConferenceService, useValue: conferenceServiceSpy }
            ],
            declarations: [EventsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EventsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a hearing event', async () => {
        eventsServiceSpy.createHearingEvent.and.returnValue(Promise.resolve());
        component.ngOnInit();
        component.conference = testData.getConferenceResponse();
        const eventType = EventType.Start;
        const judgeId = testData.getJudgeId(component.conference.participants);
        component.hearingEventTypeDropdown.setValue(eventType);
        fixture.detectChanges();
        component.sendHearingEvent();
        expect(eventsServiceSpy.createHearingEvent).toHaveBeenCalledWith(component.conference.id, eventType, judgeId);
    });

    it('should throw an error if call to test api to send hearing event fails', async () => {
        eventsServiceSpy.createHearingEvent.and.throwError(new Error());
        const conferencesResponse = testData.getConferencesResponse();
        component.conferences = conferencesResponse;
        component.conference = conferencesResponse[0];
        component.caseNamesDropdown.setValue(conferencesResponse[0].case_name);
        await component.sendHearingEvent();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should create a partcipant event', async () => {
        const conference = testData.getConferenceResponse();
        eventsServiceSpy.createParticipantEvent.and.returnValue(Promise.resolve());
        conferenceServiceSpy.getConferenceByHearingRefId.and.returnValue(Promise.resolve(conference));
        component.ngOnInit();
        component.conference = conference;
        const eventType = EventType.Joined;
        const transferFrom = 'WaitingRoom';
        const transferTo = 'WaitingRoom';
        const participantRoomId = '123';
        const judgeId = testData.getJudgeId(component.conference.participants);
        fixture.detectChanges();
        component.form.addControl(`participant-event-type-dropdown-${judgeId}`, new FormControl(eventType));
        component.form.get(`participant-event-type-dropdown-${judgeId}`).setValue(eventType);
        component.form.addControl(`participant-room-id-textfield-${judgeId}`, new FormControl());
        component.form.get(`participant-room-id-textfield-${judgeId}`).setValue(participantRoomId);
        component.form.addControl(`participant-transfer-from-textfield-${judgeId}`, new FormControl(transferFrom));
        component.form.get(`participant-transfer-from-textfield-${judgeId}`).setValue(transferFrom);
        component.form.addControl(`participant-transfer-to-textfield-${judgeId}`, new FormControl(transferTo));
        component.form.get(`participant-transfer-to-textfield-${judgeId}`).setValue(transferTo);
        await component.sendParticipantEvent(judgeId);
        expect(eventsServiceSpy.createParticipantEvent).toHaveBeenCalledWith(
            component.conference.id,
            judgeId,
            participantRoomId,
            eventType,
            transferFrom,
            transferTo
        );
    });

    it('should throw an error if call to test api to participant send event fails', async () => {
        eventsServiceSpy.createParticipantEvent.and.callFake(() => Promise.reject(error));
        const participant_id = '123';
        await expectAsync(component.sendParticipantEvent(participant_id)).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should get all case names', () => {
        const conferencesResponse = testData.getConferencesResponse();
        conferenceServiceSpy.getConferencesForToday.and.returnValue(Promise.resolve(conferencesResponse));
        component.ngOnInit();
        component.refreshCaseNames();
        expect(conferenceServiceSpy.getConferencesForToday).toHaveBeenCalled();
    });

    it('should throw an error if call to test api to get conferences fails', async () => {
        conferenceServiceSpy.getConferencesForToday.and.callFake(() => Promise.reject(error));
        await expectAsync(component.getConferences()).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should select a case', () => {
        const conferencesResponse = testData.getConferencesResponse();
        component.conferences = conferencesResponse;
        component.conference = conferencesResponse[0];
        component.caseNamesDropdown.setValue(conferencesResponse[0].case_name);
        component.selectCase();
        expect(component.selectCase).toBeTruthy();
    });

    it('should determine if case name is selected', () => {
        component.caseNamesDropdown.setValue('Please select');
        expect(component.caseNameSelected()).toBeFalsy();
        component.caseNamesDropdown.setValue('Case Name');
        expect(component.caseNameSelected()).toBeTruthy();
    });

    it('should determine if a hearing event has been selected', () => {
        component.hearingEventTypeDropdown.setValue(EventType.None);
        expect(component.hearingEventDropdownHasValue()).toBeFalsy();
        component.hearingEventTypeDropdown.setValue(EventType.Close);
        expect(component.hearingEventDropdownHasValue()).toBeTruthy();
    });

    it('should determine if a participant event has been selected', () => {
        const participant_id = '123';
        component.form.addControl(`participant-event-type-dropdown-${participant_id}`, new FormControl(EventType.None));
        expect(component.participantDropdownHasValue(participant_id)).toBeFalsy();
        component.form.get(`participant-event-type-dropdown-${participant_id}`).setValue(EventType.ParticipantJoining);
        expect(component.participantDropdownHasValue(participant_id)).toBeTruthy();
    });

    it('should determine if a participant events that would trigger participant room id to appear have been selected', () => {
        const participant_id = '123';
        component.form.addControl(`participant-event-type-dropdown-${participant_id}`, new FormControl(EventType.None));
        expect(component.roomIdEventsSelected(participant_id)).toBeFalsy();
        component.form.get(`participant-event-type-dropdown-${participant_id}`).setValue(EventType.Disconnected);
        expect(component.roomIdEventsSelected(participant_id)).toBeTruthy();
        component.form.get(`participant-event-type-dropdown-${participant_id}`).setValue(EventType.Joined);
        expect(component.roomIdEventsSelected(participant_id)).toBeTruthy();
        component.form.get(`participant-event-type-dropdown-${participant_id}`).setValue(EventType.Transfer);
        expect(component.roomIdEventsSelected(participant_id)).toBeTruthy();
        component.form.get(`participant-event-type-dropdown-${participant_id}`).setValue(EventType.MediaPermissionDenied);
        expect(component.roomIdEventsSelected(participant_id)).toBeFalsy();
    });

    it('should determine if a participant transfer has been selected', () => {
        const participant_id = '123';
        component.form.addControl(`participant-event-type-dropdown-${participant_id}`, new FormControl(EventType.VhoCall));
        expect(component.transferSelected(participant_id)).toBeFalsy();
        component.form.get(`participant-event-type-dropdown-${participant_id}`).setValue(EventType.Transfer);
        expect(component.transferSelected(participant_id)).toBeTruthy();
    });

    it('should close the dialog', () => {
        component.closeDialog();
        expect(component.closeDialog).toBeTruthy();
    });

    it('should determine if transfer from has a value', () => {
        const judgeId = '123';
        let room = 'WaitingRoom';
        component.form.addControl(`participant-transfer-from-textfield-${judgeId}`, new FormControl(room));
        component.form.get(`participant-transfer-from-textfield-${judgeId}`).setValue(room);
        expect(component.transferFromInvalid(judgeId)).toBeFalsy();
        room = '';
        component.form.get(`participant-transfer-from-textfield-${judgeId}`).setValue(room);
        expect(component.transferFromInvalid(judgeId)).toBeTruthy();
    });

    it('should determine if transfer to has a value', () => {
        const judgeId = '123';
        let room = 'WaitingRoom';
        component.form.addControl(`participant-transfer-to-textfield-${judgeId}`, new FormControl(room));
        component.form.get(`participant-transfer-to-textfield-${judgeId}`).setValue(room);
        expect(component.transferToInvalid(judgeId)).toBeFalsy();
        room = '';
        component.form.get(`participant-transfer-to-textfield-${judgeId}`).setValue(room);
        expect(component.transferToInvalid(judgeId)).toBeTruthy();
    });

    it('should determine if transfer field have values and are selected', () => {
        const judgeId = '123';
        const empty_string = '';
        const room = 'WaitingRoom';
        const not_transfer = EventType.Joined;
        const transfer = EventType.Transfer;

        component.form.addControl(`participant-event-type-dropdown-${judgeId}`, new FormControl(not_transfer));
        expect(component.transferValuesSetIfSelected(judgeId)).toBeTruthy();
        component.form.get(`participant-event-type-dropdown-${judgeId}`).setValue(transfer);
        component.form.addControl(`participant-transfer-from-textfield-${judgeId}`, new FormControl(empty_string));
        component.form.addControl(`participant-transfer-to-textfield-${judgeId}`, new FormControl(empty_string));
        expect(component.transferValuesSetIfSelected(judgeId)).toBeFalsy();
        component.form.get(`participant-transfer-from-textfield-${judgeId}`).setValue(room);
        component.form.get(`participant-transfer-to-textfield-${judgeId}`).setValue(room);
        expect(component.transferValuesSetIfSelected(judgeId)).toBeTruthy();
    });
});
