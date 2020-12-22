import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteHearingComponent } from './delete-hearing.component';

describe('DeleteHearingComponent', () => {
    let component: DeleteHearingComponent;
    let fixture: ComponentFixture<DeleteHearingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeleteHearingComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteHearingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
