import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Logger } from 'src/app/services/logging/logger-base';
import { AllocationService } from 'src/app/services/test-api/allocation-service';
import { ResetService } from 'src/app/services/test-api/reset-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllocateUsersComponent } from './allocate-users.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AllocateUsersComponent', () => {
    let component: AllocateUsersComponent;
    let fixture: ComponentFixture<AllocateUsersComponent>;
    const loggerSpy = jasmine.createSpyObj<Logger>('Logger', ['debug', 'info', 'warn', 'event', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const allocationServiceSpy = jasmine.createSpyObj<AllocationService>('AllocationService', ['allocateSingleUser', 'getAllAllocationsByUsername', 'unallocateUser']);
    const resetServiceSpy = jasmine.createSpyObj<ResetService>('ResetService', ['resetPassword']);

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
});
