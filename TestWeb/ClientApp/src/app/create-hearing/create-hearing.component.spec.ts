import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHearingComponent } from './create-hearing.component';

describe('CreateHearingComponent', () => {
  let component: CreateHearingComponent;
  let fixture: ComponentFixture<CreateHearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateHearingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
