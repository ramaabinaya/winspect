import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSubcategoryFormControlComponent } from './custom-subcategory-form-control.component';

describe('CustomSubcategoryFormControlComponent', () => {
  let component: CustomSubcategoryFormControlComponent;
  let fixture: ComponentFixture<CustomSubcategoryFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSubcategoryFormControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSubcategoryFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
