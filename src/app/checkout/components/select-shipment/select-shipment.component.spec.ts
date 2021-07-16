import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectShipmentComponent } from './select-shipment.component';

describe('SelectShipmentComponent', () => {
  let component: SelectShipmentComponent;
  let fixture: ComponentFixture<SelectShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectShipmentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
