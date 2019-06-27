import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTimepickerControlComponent } from './custom-timepicker-control.component';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { DatePipe } from '@angular/common';

export class MockAmazingTimePickerService {
  open() {}
}
export class MockDatePipe {
  transform() {}
}
describe('CustomTimepickerControlComponent', () => {
  let component: CustomTimepickerControlComponent;
  let fixture: ComponentFixture<CustomTimepickerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTimepickerControlComponent ],
      providers: [
        { provide: AmazingTimePickerService, useClass: MockAmazingTimePickerService },
        { provide: DatePipe, useClass: MockDatePipe }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTimepickerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
