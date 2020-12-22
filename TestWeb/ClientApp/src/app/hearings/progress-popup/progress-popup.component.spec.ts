import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressPopupComponent } from './progress-popup.component';

describe('ProgressPopupComponent', () => {
  let component: ProgressPopupComponent;
  let fixture: ComponentFixture<ProgressPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
