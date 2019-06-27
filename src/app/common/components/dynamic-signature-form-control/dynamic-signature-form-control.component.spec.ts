import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSignatureFormControlComponent } from './dynamic-signature-form-control.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { CustomSignatureFormControlComponent } from '../custom-signature-form-control/custom-signature-form-control.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-signature-form-control',
  template: '<div>app-custom-signature-form-control</div>'
  })
 
  class CustomSignatureFormControlComponent {
    @Input() id;
    @Input() editId: number;
    @Input() question: any;
  }

describe('DynamicSignatureFormControlComponent', () => {
  let component: DynamicSignatureFormControlComponent;
  let fixture: ComponentFixture<DynamicSignatureFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [ DynamicSignatureFormControlComponent, CustomSignatureFormControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSignatureFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
