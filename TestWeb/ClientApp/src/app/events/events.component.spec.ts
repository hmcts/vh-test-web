import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Logger } from '../services/logging/logger-base';
import { ConferenceService } from '../services/test-api/conference-service';
import { CreateService } from '../services/test-api/create-service';
import { EventsService } from '../services/test-api/event-service';
import { SharedModule } from '../shared/shared.module';
import { TestApiServiceTestData } from '../testing/mocks/testapiservice-test-data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EventsComponent } from './events.component';
import { ConferenceResponse, EventType } from '../services/clients/api-client';

describe('EventsComponent', () => {
    let component: EventsComponent;
    let fixture: ComponentFixture<EventsComponent>;

    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const eventsServiceSpy = jasmine.createSpyObj<EventsService>('EventsService', ['createHearingEvent']);
    const conferenceServiceSpy = jasmine.createSpyObj<ConferenceService>('ConferenceService', ['getConferencesForToday']);
    const testData = new TestApiServiceTestData();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [SharedModule],
          providers: [
              { provide: Router, useValue: routerSpy },
              { provide: Logger, useValue: loggerSpy }
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

    it('should create a hearing event', () => {
      const conferences = [];
      const conference = testData.getConferenceResponse();
      conferences.push(conference);

      conferenceServiceSpy.getConferencesForToday.and.returnValue(Promise.resolve(conferences));
      eventsServiceSpy.createHearingEvent.and.returnValue(Promise.resolve());

      component.ngOnInit();

      const judgeId = '123';
      component.conference = conference;
      const eventType = EventType.Start;

      component.sendHearingEventToApi(judgeId, eventType);
      expect(eventsServiceSpy.createHearingEvent).toHaveBeenCalledWith(judgeId, eventType);
  });
});
