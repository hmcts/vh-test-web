import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Logger } from 'src/app/services/logging/logger-base';
import { Summary } from 'src/app/services/test-api/models/summary';
import Dictionary from 'src/app/shared/helpers/dictionary';
import { PageUrls } from 'src/app/shared/page-url.constants';
import { TestApiServiceTestData } from 'src/app/testing/mocks/testapiservice-test-data';

import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
    let component: SummaryComponent;
    let fixture: ComponentFixture<SummaryComponent>;

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['error', 'debug', 'warn']);
    const clipboardServiceSpy = jasmine.createSpyObj<ClipboardService>('ClipboardService', ['copyFromContent']);
    clipboardServiceSpy.copyFromContent.and.returnValue(true);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: Logger, useValue: loggerSpy },
                { provide: ClipboardService, useValue: clipboardServiceSpy }
            ],
            declarations: [SummaryComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to create hearing page', () => {
        component.clickCreateHearings();
        expect(routerSpy.navigate).toHaveBeenCalledWith([PageUrls.CreateHearings]);
    });

    it('should reset tooltip value', () => {
        component.ngOnInit();
        expect(component.tooltip).toBe('Copy conference details to clipboard');
    });

    it('should return true for the last participant', () => {
        const totalParticipants = 5;
        let index = 4;
        let result = component.theLastParticipant(totalParticipants, index);
        expect(result).toBe(true);
        index = 3;
        result = component.theLastParticipant(totalParticipants, index);
        expect(result).toBe(false);
    });

    it('should copy the conference id to the clipboard', () => {
        const conference = new TestApiServiceTestData().getConference();
        const userPasswords = new Dictionary<string>();
        userPasswords.add('username@email.com', '12345');
        const summary = new Summary(conference, userPasswords);
        component.summeries.push(summary);

        component.copyHearing(0);
        expect(clipboardServiceSpy.copyFromContent).toHaveBeenCalledWith(summary.toText());
        expect(component.tooltip).toBe('Conference details copied to clipboard');
    });
});
