import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Logger } from '../services/logging/logger-base';
import { AllocationService } from '../services/test-api/allocation-service';
import { DeleteService } from '../services/test-api/delete-service';
import { HearingService } from '../services/test-api/hearing-service';
import { SharedModule } from '../shared/shared.module';
import { TestApiServiceTestData } from '../testing/mocks/testapiservice-test-data';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeComponent } from './home.component';
import { AllocatedUserModel } from '../common/models/allocated.user.model';
import { HearingResponse, UpdateUserResponse } from '../services/clients/api-client';
import { ResetService } from '../services/test-api/reset-service';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const allocationServiceSpy = jasmine.createSpyObj<AllocationService>('AllocationService', [
        'getAllAllocationsByUsername',
        'unallocateUser'
    ]);
    const hearingsServiceSpy = jasmine.createSpyObj<HearingService>('HearingService', ['GetAllHearings']);
    const deleteServiceSpy = jasmine.createSpyObj<DeleteService>('DeleteService', ['deleteHearing']);
    const resetServiceSpy = jasmine.createSpyObj<ResetService>('ResetService', ['resetPassword']);
    const testData = new TestApiServiceTestData();
    const username = 'username@email.com';
    const allocatedUserModel = new AllocatedUserModel();
    allocatedUserModel.allocated_by = 'user@email.com';
    allocatedUserModel.expires_at = new Date();
    allocatedUserModel.id = '123';
    allocatedUserModel.username = username;
    const error = { error: 'not found!' };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomeComponent]
        }).compileComponents();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: Logger, useValue: loggerSpy },
                { provide: AllocationService, useValue: allocationServiceSpy },
                { provide: HearingService, useValue: hearingsServiceSpy },
                { provide: ResetService, useValue: resetServiceSpy },
                { provide: DeleteService, useValue: deleteServiceSpy }
            ],
            declarations: [HomeComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should throw an error if call to test api to get all hearings fails', async () => {
        hearingsServiceSpy.GetAllHearings.and.callFake(() => Promise.reject(error));
        await expectAsync(component.getAllHearings()).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should throw an error if call to test api to get all allocations fails', async () => {
        allocationServiceSpy.getAllAllocationsByUsername.and.callFake(() => Promise.reject(error));
        await expectAsync(component.getAllAllocations()).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should throw an error if call to test api to delete a hearing fails', async () => {
        deleteServiceSpy.deleteHearing.and.callFake(() => Promise.reject(error));
        const caseName = '123';
        await expectAsync(component.deleteHearing(caseName)).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should throw an error if call to test api to reset passwords fails', async () => {
        resetServiceSpy.resetPassword.and.callFake(() => Promise.reject(error));
        await expectAsync(component.resetPassword(username)).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should throw an error if call to test api to unallocate a user fails', async () => {
        allocationServiceSpy.unallocateUser.and.callFake(() => Promise.reject(error));
        await expectAsync(component.unallocateUser(username)).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should reset password', async () => {
        const updateUserResponse = new UpdateUserResponse();
        updateUserResponse.new_password = 'password';
        resetServiceSpy.resetPassword.and.returnValue(Promise.resolve(updateUserResponse));
        await component.resetPassword(username);
        expect(resetServiceSpy.resetPassword).toHaveBeenCalledWith(username);
    });

    it('should display hearings if they exist', () => {
        const hearings: HearingResponse[] = [];
        component.hearings = hearings;
        expect(component.hearingsToDisplay()).toBeFalsy();
        const hearing = testData.getHearingDetails();
        hearings.push(hearing);
        component.hearings = hearings;
        expect(component.hearingsToDisplay()).toBeTruthy();
    });

    it('should display allocations if they exist', () => {
        const allocations = [];
        component.allocations = allocations;
        expect(component.allocationsToDisplay()).toBeFalsy();
        allocations.push(allocatedUserModel);
        component.allocations = allocations;
        fixture.detectChanges();
        expect(component.allocationsToDisplay()).toBeTruthy();
    });

    it('should close the dialog', () => {
        component.closeDialog();
        expect(component.closeDialog).toBeTruthy();
    });
});
