import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPriceBreakdownComponent } from './order-price-breakdown.component';

describe('OrderPriceBreakdownComponent', () => {
  let component: OrderPriceBreakdownComponent;
  let fixture: ComponentFixture<OrderPriceBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderPriceBreakdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPriceBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
