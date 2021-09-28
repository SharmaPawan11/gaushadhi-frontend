import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPagePopularItemsComponent } from './landing-page-popular-items.component';

describe('LandingPagePopularItemsComponent', () => {
  let component: LandingPagePopularItemsComponent;
  let fixture: ComponentFixture<LandingPagePopularItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPagePopularItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPagePopularItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
