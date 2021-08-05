import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextWithToggleComponent } from './text-with-toggle.component';

describe('TextWithToggleComponent', () => {
  let component: TextWithToggleComponent;
  let fixture: ComponentFixture<TextWithToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextWithToggleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextWithToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
