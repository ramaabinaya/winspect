
// Dynamic-custom-timepicker component, Which is used to embed our custom-timepicker-control's component view.
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
  DynamicFormControlComponent, DynamicFormLayout, DynamicFormControlEvent,
  DynamicFormControlCustomEvent, DynamicFormLayoutService, DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicCustomTimepickerModel } from '../../models/dynamic-timepicker.model';
import { CustomTimepickerControlComponent } from '../custom-timepicker-control/custom-timepicker-control.component';
/**
 * Component which is used to display custom form control for dynamic custom timepicker control.
 */
@Component({
  selector: 'app-dynamic-custom-timepicker-control',
  templateUrl: './dynamic-custom-timepicker-control.component.html',
  styleUrls: ['./dynamic-custom-timepicker-control.component.css']
})
// Component which is used to display the custom-timepicker control for dynamic form model.
export class DynamicCustomTimepickerControlComponent extends DynamicFormControlComponent {
  /**
   * Variable which is used to define the bind id from the parent component.
   * @type {boolean}
   */
  @Input() bindId = true;
  /**
  * Variable which is used to define the form group from the parent component.
  * @type {FormGroup}
  */
  @Input() group: FormGroup;
  /**
   * Variable which is used to define form layout from the parent component.
   * @type {DynamicFormLayout}
   */
  @Input() layout: DynamicFormLayout;
  /**
   * Variable which is used to define form model from the parent component.
   * @type {DynamicImageModel}
   */
  @Input() model: DynamicCustomTimepickerModel;
  /**
   * Variable which is used to emit the blur event to the parant component.
   * @type {any}
   */
  @Output() blur: EventEmitter<any> = new EventEmitter();
  /**
  * Variable which is used to emit the changed value to the parant component.
  * @type {DynamicFormControlEvent}
  */
  @Output() change: EventEmitter<DynamicFormControlEvent> = new EventEmitter();
  /**
   * Variable which is used to emit the custom event to the parant component.
   * @type {DynamicFormControlCustomEvent}
   */
  @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();
  /**
   * Variable which is used to emit the focus event to the parant component.
   * @type {any}
   */
  @Output() focus: EventEmitter<any> = new EventEmitter();
  /**
  * Variable which is used to define the CustomFormControlComponent of the template.
  */
  @ViewChild(CustomTimepickerControlComponent) customTimepickerControlComponent: CustomTimepickerControlComponent;
  /**
   * Constructor which is used to inject the required services.
   * @param layoutService To use dynamic form layout service.
   * @param validationService To use dynamic form validation service.
   */
  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService) {
    super(layoutService, validationService);
  }
}
