import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DynamicCustomTimepickerControlComponent } from './dynamic-custom-timepicker-control.component';
import { AccordionModule } from 'primeng/primeng';
import { CustomTimepickerControlComponent } from '../custom-timepicker-control/custom-timepicker-control.component';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { DatePipe } from '@angular/common';
import { Input, Component } from '@angular/core';

@Component({
  selector: 'app-custom-timepicker-control',
  template: '<div>app-custom-timepicker-control </div>'
})
export class CustomFieldFormControlComponent {
  // @Input() editId: number;
  // @Input() question: any;
}
class MockAmazingTimePickerService {
  open() {}
}

class MockDatePipe {
  transform: string;
}

describe('DynamicCustomTimepickerControlComponent', () => {
  let component: DynamicCustomTimepickerControlComponent;
  let fixture: ComponentFixture<DynamicCustomTimepickerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        AccordionModule,
        ReactiveFormsModule
      ],
      declarations: [ DynamicCustomTimepickerControlComponent,
        CustomTimepickerControlComponent ],
        providers: [
          { provide: AmazingTimePickerService, useClass: MockAmazingTimePickerService },
          { provide: DatePipe, useClass: MockDatePipe }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCustomTimepickerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
