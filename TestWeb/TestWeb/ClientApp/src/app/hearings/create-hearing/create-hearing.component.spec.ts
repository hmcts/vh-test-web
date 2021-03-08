import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Logger } from 'src/app/services/logging/logger-base';
import { CreateService } from 'src/app/services/test-api/create-service';
import { Summary } from 'src/app/services/test-api/models/summary';
import Dictionary from 'src/app/shared/helpers/dictionary';
import { PageUrls } from 'src/app/shared/page-url.constants';
import { SharedModule } from 'src/app/shared/shared.module';
import { TestData } from 'src/app/testing/mocks/test-data';
import { CreateHearingComponent } from './create-hearing.component';

describe('CreateHearingComponent', () => {
    let component: CreateHearingComponent;
    let fixture: ComponentFixture<CreateHearingComponent>;

    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const createServiceSpy = jasmine.createSpyObj<CreateService>('CreateService', ['createHearings']);
    const testData = new TestData();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: Logger, useValue: loggerSpy },
                { provide: CreateService, useValue: createServiceSpy },
                DatePipe
            ],
            declarations: [CreateHearingComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateHearingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        component.ngOnDestroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should populate data and call create hearing', () => {
        component.ngOnInit();
        component.displayConfirmationDialog();

        const hearingFormData = testData.createHearingFormData();
        component.createHearings(hearingFormData);

        expect(component.bookingsSaving).toBe(true);
        expect(createServiceSpy.createHearings).toHaveBeenCalledWith(hearingFormData);
    });

    it('should create a hearing', () => {
        const summaries: Summary[] = [];
        const summary = testData.getSummary();
        summaries.push(summary);
        createServiceSpy.createHearings.and.returnValue(Promise.resolve(summaries));

        component.ngOnInit();

        const hearingFormData = testData.createHearingFormData();
        component.createHearings(hearingFormData);

        expect(createServiceSpy.createHearings).toHaveBeenCalledWith(hearingFormData);
    });

    it('should navigate to summary page', () => {
        component.continue();
        expect(routerSpy.navigate).toHaveBeenCalledWith([PageUrls.Summary]);
    });

    it('should navigate to create hearing page', () => {
        component.goBackToHearings();
        expect(routerSpy.navigate).toHaveBeenCalledWith([PageUrls.CreateHearings]);
    });

    it('should unsubscribe all subcriptions on destroy', () => {
        component.ngOnDestroy();
        expect(component.$subscriptions[0].closed).toBe(true);
    });

    it('should ignore custom name if not set', () => {
        component.ngOnInit();
        const hearingFormData = testData.createHearingFormData();
        hearingFormData.customCaseNamePrefix = null;
        component.createHearings(hearingFormData);
        expect(createServiceSpy.createHearings).toHaveBeenCalledWith(hearingFormData);
    });

    it('should permit custom name if set', async () => {
        const summary: Summary[] = [];
        createServiceSpy.createHearings.and.returnValue(Promise.resolve(summary));
        component.ngOnInit();
        const hearingFormData = testData.createHearingFormData();
        component.customCaseNamePrefix.setValue(hearingFormData.customCaseNamePrefix);
        fixture.detectChanges();
        await component.displayConfirmationDialog();
        expect(component.customCaseNamePrefix.value).toBe(hearingFormData.customCaseNamePrefix);
    });

    it('should declare if start hour is in the past', () => {
        component.hearingDate.setValue(new Date().setDate(new Date().getDate() + 1));
        component.hearingStartTimeHour.setValue('24');
        component.hearingStartTimeMinute.setValue('60');
        component.startHoursInPast();
        expect(component.isStartHoursInPast).toBeFalsy();

        component.hearingDate.setValue(new Date().setDate(new Date().getDate()));
        component.hearingStartTimeHour.setValue('-1');
        component.hearingStartTimeMinute.setValue('-1');
        component.startHoursInPast();
        expect(component.isStartHoursInPast).toBeTruthy();
    });

    it('should declare if start minute is in the past', () => {
        component.hearingDate.setValue(new Date().setDate(new Date().getDate() + 1));
        component.hearingStartTimeHour.setValue('24');
        component.hearingStartTimeMinute.setValue('60');
        component.startMinutesInPast();
        expect(component.isStartMinutesInPast).toBeFalsy();

        component.hearingDate.setValue(new Date().setDate(new Date().getDate()));
        component.hearingStartTimeHour.setValue(new Date().getHours());
        component.hearingStartTimeMinute.setValue('-1');
        component.startMinutesInPast();
        expect(component.isStartMinutesInPast).toBeTruthy();
    });

    it('should display summaries if they exist', () => {
        component.summeries = [];
        expect(component.summeriesToDisplay()).toBeFalsy();
        const conference = testData.getConference();
        const passwords = new Dictionary<string>();
        const summary = new Summary(conference, passwords);
        component.summeries.push(summary);
        expect(component.summeriesToDisplay()).toBeTruthy();
    });

    it('should display errors if they exist', () => {
        component.errors = [];
        expect(component.errorsToDisplay()).toBeFalsy();
        component.errors.push('new error');
        expect(component.errorsToDisplay()).toBeTruthy();
    });

    it('should register if there are multiple hearings', () => {
        component.errors = [];
        expect(component.multipleHearings()).toBeFalsy();
        component.quantityDropdown.setValue('2');
        expect(component.multipleHearings()).toBeTruthy();
    });

    it('should reset oast time on blur', () => {
        component.isStartHoursInPast = true;
        component.isStartMinutesInPast = true;
        component.resetPastTimeOnBlur();
        expect(component.isStartHoursInPast).toBeFalsy();
        expect(component.isStartMinutesInPast).toBeFalsy();
    });
});
