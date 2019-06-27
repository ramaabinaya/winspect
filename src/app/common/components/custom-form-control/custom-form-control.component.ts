// custom-form-control component,which describe the functionality for creating the form control of DynamicImageModel.
import { Component, forwardRef, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * Comoponent which is used to create the custom form control for dynamic-imagemodel.
 */
@Component({
  selector: 'app-custom-form-control',
  templateUrl: './custom-form-control.component.html',
  styleUrls: ['./custom-form-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomFormControlComponent),
      multi: true
    }
  ]
})
export class CustomFormControlComponent implements ControlValueAccessor {
  /**
   * Variable which is used to display the options when value is true.
   * @type {boolean}
   */
  showOptions: boolean;
   /**
   * Variable which is used to emit the selected option value to the parant component.
   * @type {any}
   */
  @Output() change: EventEmitter<any> = new EventEmitter();
  /**
   * Constructor which is used to inject the required services.
   */
  constructor() { }
  /**
   * Callback which is implemented when the view changed.And call from registerOnChange method.
   */
  propagateChange = (_: any) => { };
   /**
   * Method which is used to change a value from form model into the DOM view.
   * @param value {any} To define the form-model value.
   */
  writeValue(value: any) {}
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
  registerOnTouched() {}
  /**
   * Method which is used to emit the selected option value.
   * @param option {string} To define selected option.
   */
  onSelect(option: string) {
    this.change.emit(option);
    this.showOptions = false;
    // And call the callback function to say view has been changed.
    this.propagateChange(option);
  }
}

