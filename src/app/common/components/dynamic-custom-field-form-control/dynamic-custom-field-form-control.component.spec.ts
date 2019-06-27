import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicCustomFieldFormControlComponent } from './dynamic-custom-field-form-control.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-field-form-control',
  template: 'app-custom-field-form-control'
})

class CustomFieldFormControlComponent {
  @Input() editId: number;
  @Input() question: any;
}
describe('DynamicCustomFieldFormControlComponent', () => {
  let component: DynamicCustomFieldFormControlComponent;
  let fixture: ComponentFixture<DynamicCustomFieldFormControlComponent>;
  
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
      ReactiveFormsModule],
      declarations: [ DynamicCustomFieldFormControlComponent, 
        CustomFieldFormControlComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCustomFieldFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
