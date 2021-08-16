import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentMethodCardComponent } from './shipment-method-card.component';

describe('ShipmentMethodCardComponent', () => {
  let component: ShipmentMethodCardComponent;
  let fixture: ComponentFixture<ShipmentMethodCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentMethodCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentMethodCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
