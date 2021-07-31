import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedProductsSliderComponent } from './featured-products-slider.component';

describe('FeaturedProductsSliderComponent', () => {
  let component: FeaturedProductsSliderComponent;
  let fixture: ComponentFixture<FeaturedProductsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeaturedProductsSliderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedProductsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
