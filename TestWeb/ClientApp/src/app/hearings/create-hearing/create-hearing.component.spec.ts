import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Logger } from 'src/app/services/logging/logger-base';
import { CreateService } from 'src/app/services/test-api/create-service';
import { Summary } from 'src/app/services/test-api/models/summary';
import { PageUrls } from 'src/app/shared/page-url.constants';
import { SharedModule } from 'src/app/shared/shared.module';
import { TestApiServiceTestData } from 'src/app/testing/mocks/testapiservice-test-data';
import { CreateHearingComponent } from './create-hearing.component';

describe('CreateHearingComponent', () => {
    let component: CreateHearingComponent;
    let fixture: ComponentFixture<CreateHearingComponent>;

    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const createServiceSpy = jasmine.createSpyObj<CreateService>('CreateService', ['createHearings']);
    const testData = new TestApiServiceTestData();

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
        const summary: Summary[] = [];
        createServiceSpy.createHearings.and.returnValue(Promise.resolve(summary));

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
});
