// custom-timepicker-control component, which describe the functionality for
// creating the timepicker control of DynamicFieldModel.
import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DatePipe } from '@angular/common';
/**
 * Variable which is used to define the window screen.
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used to create the custom time picker control for DynamicFieldModel.
 */
@Component({
  selector: 'app-custom-timepicker-control',
  templateUrl: './custom-timepicker-control.component.html',
  styleUrls: ['./custom-timepicker-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTimepickerControlComponent),
      multi: true
    }
  ]
})
export class CustomTimepickerControlComponent implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * Variable which is used to define the id of the time picker control.
   */
  @Input() id;
  /**
   * Variable which is used to get the selected Time.
   */
  selectedTime;
  /**
   * Variable which is used to define the TimePicker.
   */
  amazingTimePicker;
  /**
   * Variable which is used to subscribe or unsubscribe the time.
   */
  subscriptionObject = {};
  /**
 * Variable which is used to define the report id from the parent component,
 * @type {number}
 */
  @Input() editId: number;
  /**
   * Variable which is used to define the dynamic field name from the parent component.
   * @type {any}
   */
  @Input() question: any;
  /**
   * Variable which is used to define the time from the parent component.
   * @type {any}
   */
  @Input() editTime;
  /**
   * Variable which is used to decide whether to display the default timepicker or the custom
   * time picker.
   */
  timePicker: string;
  /**
   * Constructor which is used to inject the required services.
   * @param atp To access amazing time picker model.
   * @param datePipe To display date in date format.
   */
  constructor(private atp: AmazingTimePickerService,
    private datePipe: DatePipe) { }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.selectedTime = this.datePipe.transform(new Date(Date.now()), 'h:mm');
    if (window && window.cordova) {
      this.timePicker = 'default';
    } else {
      this.timePicker = 'custom';
    }
  }
  /**
   * Method which is used to open the time picker.
   * @param event triggered when the time picker is opened.
   */
  open(event) {
    this.amazingTimePicker = this.atp.open();
  }
  /**
   * Method which is used to get the time selected from the time picker
   * @param event triggered when time is selected from the amazing time picker.
   */
  getValue(event) {
    this.subscriptionObject['timepicker'] = this.amazingTimePicker.afterClose().subscribe(time => {
      this.selectedTime = time;
      this.propagateChange(time);
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to get the time selected from the default time picker.
   * @param event triggered when time is selected from the default time picker.
   */
  getTime(event) {
    this.selectedTime = event.target.value;
    this.propagateChange(event.target.value);
  }
  /**
   * Callback which is implemented when the view changed.And call from registerOnChange method.
   */
  propagateChange = (_: any) => {
  }
  /**
   * Method which is used to change a value from form model into the DOM view.
   * @param value {any} To define the form-model value.
   */
  writeValue(value: any) {
    if (value !== undefined && value !== null) {
      // this.value = value;
    }
  }
  /**
   * Method which is implemented when the view changed.And call the callback function.
   * @param fn {any} To define the callback function.
   */
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  /**
   * Method which is implemented when the control receives touch event.
   */
  registerOnTouched() {
    if (!this.editTime) {
      setTimeout(() => {
        this.propagateChange(this.selectedTime);
      }, 500);
    }
  }
  /**
   * Component ondestroy life cycle hook.
   * All subscriptions are unsubscribe here.
   */
  ngOnDestroy() {
    if (this.subscriptionObject) {
      for (const subscriptionProperty in this.subscriptionObject) {
        if (this.subscriptionObject[subscriptionProperty]) {
          this.subscriptionObject[subscriptionProperty].unsubscribe();
        }
      }
    }
  }
}
