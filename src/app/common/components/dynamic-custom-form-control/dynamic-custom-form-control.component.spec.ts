import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicCustomFormControlComponent } from './dynamic-custom-form-control.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-form-control',
  template: 'app-custom-form-control'
})
export class CustomFormControlComponent {}
describe('DynamicCustomFormControlComponent', () => {
  let component: DynamicCustomFormControlComponent;
  let fixture: ComponentFixture<DynamicCustomFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ DynamicCustomFormControlComponent,
        CustomFormControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCustomFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
