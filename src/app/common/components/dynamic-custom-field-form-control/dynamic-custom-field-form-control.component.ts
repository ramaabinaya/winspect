// Dynamic-custom-field-form-control component,Which is used to embed our custom-field-form-control's component view.
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormControlCustomEvent,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormControlEvent,
} from '@ng-dynamic-forms/core';
import { CustomFieldFormControlComponent } from '../custom-field-form-control/custom-field-form-control.component';
import { DynamicFieldModel } from '../../models/dynamic-field-model';
/**
 * Component which is used to display custom form control for dynamic fieldmodel.
 */
@Component({
  selector: 'app-dynamic-custom-field-form-control',
  templateUrl: './dynamic-custom-field-form-control.component.html'
})
export class DynamicCustomFieldFormControlComponent extends DynamicFormControlComponent {
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
   * @type {DynamicFieldModel}
   */
  @Input() model: DynamicFieldModel;
  /**
   * Variable which is used to emit the blur event to the parant component.
   * @type {any}
   */
  @Output() blur: EventEmitter<any> = new EventEmitter();
  /**
   * Variable which is used to emit the changed value to the parant component
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
   * Variable which is used to define the CustomFieldFormControlComponent of the template.
   */
  @ViewChild(CustomFieldFormControlComponent) customFormControlComponent: CustomFieldFormControlComponent;
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
