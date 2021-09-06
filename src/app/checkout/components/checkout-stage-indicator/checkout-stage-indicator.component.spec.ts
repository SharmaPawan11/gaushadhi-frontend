import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutStageIndicatorComponent } from './checkout-stage-indicator.component';

describe('CheckoutStageIndicatorComponent', () => {
  let component: CheckoutStageIndicatorComponent;
  let fixture: ComponentFixture<CheckoutStageIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutStageIndicatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutStageIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
