import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicSubcategoryFormControlComponent } from './dynamic-subcategory-form-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-subcategory-form-control',
  template: '<div>app-custom-subcategory-form-control</div>'
})
export class CustomSubcategoryFormControlComponent {
  @Input() subCategory;
}
describe('DynamicSubcategoryFormControlComponent', () => {
  let component: DynamicSubcategoryFormControlComponent;
  let fixture: ComponentFixture<DynamicSubcategoryFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ DynamicSubcategoryFormControlComponent,
        CustomSubcategoryFormControlComponent
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSubcategoryFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
