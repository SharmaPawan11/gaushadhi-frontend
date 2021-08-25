import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutShellComponent } from './checkout-shell.component';

describe('CheckoutShellComponent', () => {
  let component: CheckoutShellComponent;
  let fixture: ComponentFixture<CheckoutShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutShellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
