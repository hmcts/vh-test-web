import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteModel } from 'src/app/common/models/delete-model';

import { DeletedResponse } from 'src/app/services/clients/api-client';
import { Logger } from 'src/app/services/logging/logger-base';
import { TestApiService } from 'src/app/services/test-api/test-api-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteHearingComponent } from './delete-hearing.component';

describe('DeleteHearingComponent', () => {
    let component: DeleteHearingComponent;
    let fixture: ComponentFixture<DeleteHearingComponent>;

    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const testApiServiceSpy = jasmine.createSpyObj<TestApiService>('TestApiService', ['deleteHearings']);

    const caseName = 'test case name';
    const deletedResponse = new DeletedResponse();
    const deleteModel = new DeleteModel();
    deleteModel.limit = 1000;
    deleteModel.case_name = caseName;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [
                { provide: Logger, useValue: loggerSpy },
                { provide: TestApiService, useValue: testApiServiceSpy }
            ],
            declarations: [DeleteHearingComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteHearingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        component.ngOnDestroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fail validation if case name is empty', () => {
        expect(component.caseNameTextfield.valid).toBeFalsy();
        expect(component.disableDeleteButton).toBe(true);
    });

    it('should pass validation if case name has test in name', () => {
        expect(component.caseNameTextfield.valid).toBeFalsy();
        component.caseNameTextfield.setValue('case name');
        fixture.detectChanges();
        expect(component.caseNameNotContainingTest).toBeTruthy();
        expect(component.disableDeleteButton).toBe(true);

        component.caseNameTextfield.setValue('test case name');
        fixture.detectChanges();
        expect(component.caseNameTextfield.valid).toBeTruthy();
        expect(component.caseNameNotContainingTest).toBeFalsy();
        expect(component.disableDeleteButton).toBe(false);
    });

    it('should fail validation if case name does not have test', () => {
        component.caseNameTextfield.setValue('case name');
        expect(component.caseNameNotContainingTest).toBeTruthy();
        expect(component.disableDeleteButton).toBe(true);
    });

    it('should sanitize text for case name', () => {
        component.caseNameTextfield.setValue('<script>text</script>');
        component.caseNameOnBlur();
        fixture.detectChanges();
        expect(component.caseNameTextfield.value).toBe('text');
    });

    it('should delete a hearing', async () => {
        deletedResponse.number_of_deleted_hearings = 1;
        testApiServiceSpy.deleteHearings.and.returnValue(Promise.resolve(deletedResponse));
        // testApiServiceSpy.deleteHearings.and.callFake((deleteModel: DeleteModel) => Promise.resolve(deletedResponse));
        component.ngOnInit();
        component.caseNameTextfield.setValue(caseName);
        fixture.detectChanges();

        component.deleteHearings();
        // expect(testApiServiceSpy.deleteHearings).toHaveBeenCalled();
        expect(testApiServiceSpy.deleteHearings).toHaveBeenCalledWith(deleteModel);
        // expect(component.resultsOutput).toBe(`1 hearing(s) deleted matching case name '${caseName}'.`);
    });

    it('should not delete a hearing if case name is not found', async () => {
        deletedResponse.number_of_deleted_hearings = 0;
        testApiServiceSpy.deleteHearings.and.returnValue(Promise.resolve(deletedResponse));
        // testApiServiceSpy.deleteHearings.and.callFake((deleteModel: DeleteModel) => Promise.resolve(deletedResponse));
        component.ngOnInit();
        component.caseNameTextfield.setValue(caseName);
        fixture.detectChanges();

        component.deleteHearings();
        console.log(component);
        // expect(testApiServiceSpy.deleteHearings).toHaveBeenCalled();
        expect(testApiServiceSpy.deleteHearings).toHaveBeenCalledWith(deleteModel);
        // expect(component.resultsOutput).toBe(`No matching hearings could be found with case name '${caseName}'.`);
    });
});
