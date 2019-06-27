// Dynamic-signature-form-control component, Which is used to embed our custom-signature-form-control's component view.
import { Component, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import {
  DynamicFormControlComponent, DynamicFormLayout, DynamicFormControlEvent,
  DynamicFormControlCustomEvent, DynamicFormLayoutService, DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { CustomSignatureFormControlComponent } from '../custom-signature-form-control/custom-signature-form-control.component';
import { DynamicCustomSignatureModel } from '../../models/dynamic-signature.model';
/**
 * Component which is used to display custom form control for dynamic signature form control.
 */
@Component({
  selector: 'app-dynamic-signature-form-control',
  templateUrl: './dynamic-signature-form-control.component.html',
  styleUrls: ['./dynamic-signature-form-control.component.css']
})
// Component which is used to display the custom-signature-form-control for dynamic form model.
export class DynamicSignatureFormControlComponent extends DynamicFormControlComponent {
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
  @Input() model: DynamicCustomSignatureModel;
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
  @ViewChild(CustomSignatureFormControlComponent) customSignatureFormControlComponent: CustomSignatureFormControlComponent;
  /**
   * Constructor which is used to inject the required services.
   * @param layoutService To use dynamic form layout service.
   * @param validationService To use dynamic form validation service.
   */
  constructor(protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService) {
    super(layoutService, validationService);
  }
  /**
   * Method which is used to emit the value and update the form model value.
   * @param event {any} To define the event value.
   */
  onChange(event: any) {
    this.change.emit(event);
    this.model.valueUpdates.next(event);
  }
}

