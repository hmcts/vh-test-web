import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Logger } from 'src/app/services/logging/logger-base';
import { AllocationService } from 'src/app/services/test-api/allocation-service';
import { ResetService } from 'src/app/services/test-api/reset-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllocateUsersComponent } from './allocate-users.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AllocatedUserModel } from 'src/app/common/models/allocated.user.model';
import { TestData } from 'src/app/testing/mocks/test-data';
import { UserModel } from 'src/app/common/models/user.model';
import { Application, TestType, UpdateUserResponse, UserType } from 'src/app/services/clients/api-client';
import { AllocationFormData } from 'src/app/services/test-api/models/allocation-form-data';

describe('AllocateUsersComponent', () => {
    let component: AllocateUsersComponent;
    let fixture: ComponentFixture<AllocateUsersComponent>;
    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const allocationServiceSpy = jasmine.createSpyObj<AllocationService>('AllocationService', [
        'allocateSingleUser',
        'getAllAllocationsByUsername',
        'unallocateUser',
        'unallocateAllAllocatedUsers'
    ]);
    const resetServiceSpy = jasmine.createSpyObj<ResetService>('ResetService', ['resetPassword']);
    const testData = new TestData();
    const username = 'username@hmcts.net';
    const allocatedUserModel = new AllocatedUserModel();
    allocatedUserModel.allocated_by = 'user@hmcts.net';
    allocatedUserModel.expires_at = new Date();
    allocatedUserModel.id = '123';
    allocatedUserModel.username = username;
    const allocatedUsers = [];
    const error = { error: 'not found!' };
    const formData = new AllocationFormData();
    formData.application = Application.VideoWeb;
    formData.expiry_in_minutes = 1;
    formData.testType = TestType.Manual;
    formData.userType = UserType.Individual;
    formData.is_ejud = false;
    const new_password = { new_password: 'password' };
    const updateUserResponse = new UpdateUserResponse();
    updateUserResponse.init(new_password);
    updateUserResponse.new_password = 'password';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AllocateUsersComponent]
        }).compileComponents();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: Logger, useValue: loggerSpy },
                { provide: AllocationService, useValue: allocationServiceSpy },
                { provide: ResetService, useValue: resetServiceSpy }
            ],
            declarations: [AllocateUsersComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AllocateUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should populate data with previous allocations', () => {
        allocatedUsers.push(allocatedUserModel);
        allocationServiceSpy.getAllAllocationsByUsername.and.returnValue(Promise.resolve(allocatedUsers));
        component.ngOnInit();
        expect(allocationServiceSpy.getAllAllocationsByUsername).toHaveBeenCalled();
    });

    it('should throw an error if call to test api to get all allocations fails', async () => {
        allocationServiceSpy.getAllAllocationsByUsername.and.callFake(() => Promise.reject(error));
        await expectAsync(component.getAllAllocations()).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should allocate a user', async () => {
        allocationServiceSpy.getAllAllocationsByUsername.and.returnValue(Promise.resolve(allocatedUsers));
        const userModel: UserModel = testData.createUserModel();
        allocationServiceSpy.allocateSingleUser.and.returnValue(Promise.resolve(userModel));

        resetServiceSpy.resetPassword.and.returnValue(Promise.resolve(updateUserResponse));

        component.ngOnInit();
        await component.allocate();

        expect(allocationServiceSpy.allocateSingleUser).toHaveBeenCalledWith(formData);
    });

    it('should throw an error if call to test api to allocate a user fails', async () => {
        allocationServiceSpy.allocateSingleUser.and.callFake(() => Promise.reject(error));
        await expectAsync(component.allocate()).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should reset a users password', async () => {
        resetServiceSpy.resetPassword.and.returnValue(Promise.resolve(updateUserResponse));
        component.ngOnInit();
        await component.resetUserPassword(username);
        expect(resetServiceSpy.resetPassword).toHaveBeenCalledWith(username);
    });

    it('should throw an error if call to test api to reset a users password fails', async () => {
        resetServiceSpy.resetPassword.and.callFake(() => Promise.reject(error));
        await expectAsync(component.resetUserPassword(username)).toBeRejected(error.error);
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should unallocate a user', async () => {
        allocationServiceSpy.unallocateUser.and.returnValue(Promise.resolve());
        component.ngOnInit();
        await component.unallocateUser(username);
        expect(allocationServiceSpy.unallocateUser).toHaveBeenCalledWith(username);
    });

    it('should throw an error if call to test api to reset a users password fails', async () => {
        allocationServiceSpy.unallocateUser.and.callFake(() => Promise.reject(error));
        await expectAsync(component.unallocateUser(username)).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
    });

    it('should unallocate all users', async () => {
        allocationServiceSpy.unallocateAllAllocatedUsers.and.returnValue(Promise.resolve());
        component.ngOnInit();
        await component.unallocateAllAllocatedUsers();
        expect(allocationServiceSpy.unallocateAllAllocatedUsers).toHaveBeenCalled();
    });

    it('should throw an error if call to test api to unallocate all users fails', async () => {
        allocationServiceSpy.unallocateAllAllocatedUsers.and.callFake(() => Promise.reject(error));
        await expectAsync(component.unallocateAllAllocatedUsers()).toBeResolved();
        expect(loggerSpy.error).toHaveBeenCalled();
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

    it('should return true for zero hours and minutes', () => {
        component.daysTextfield.setValue(0);
        component.hoursTextfield.setValue(0);
        component.minutesTextfield.setValue(0);
        expect(component.timeInvalid()).toBeTruthy();
    });

    it('should return true for invalid days', () => {
        component.daysTextfield.setValue(-1);
        expect(component.daysInvalid()).toBeTruthy();
    });

    it('should return true for invalid hour', () => {
        component.hoursTextfield.setValue(-1);
        expect(component.hoursInvalid()).toBeTruthy();
    });

    it('should return true for invalid minute', () => {
        component.minutesTextfield.setValue(-1);
        expect(component.minutesInvalid()).toBeTruthy();
    });

    it('should close the dialog', () => {
        component.closeDialog();
        expect(component.closeDialog).toBeTruthy();
    });
});
