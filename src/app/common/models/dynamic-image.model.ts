import {
  DynamicFormControlLayout,
  DynamicFormValueControlModelConfig,
  DynamicFormValueControlModel,
  serializable
} from '@ng-dynamic-forms/core';
import { EventEmitter, Output } from '@angular/core';
/**
 * Variable which is used to define the form control type.
 * @type {string}
 */
export const DYNAMIC_FORM_CONTROL_TYPE_IMAGE = 'IMAGE';
/**
 * Class which is used to define the model configuration properties.
 */
export interface DynamicImageModelConfig extends DynamicFormValueControlModelConfig<string | number | Date | string[]> {
  /**
   * Variable which is used to define the selected option value.
   * @type {string}
   */
  selectedOption?: string;
}
/**
 * Class which is used to define the custom dynamic-image model properties.
 */
export class DynamicImageModel extends DynamicFormValueControlModel<string | number | Date | string[]> {
  /**
   * Variable which is used to define the selected option value.
   * @type {string}
   */
  selectedOption: string;
  /**
   * Variable which is used to emit the changed value to the dynamic form control component.
   * @type {any}
   */
  @Output() change: EventEmitter<any> = new EventEmitter();
  /**
   * Variable which is used to define type of the model.
   * @type {string}
   */
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_IMAGE;
  /**
   * Constructor which is used to inject the required services.
   * @param config To use dynamic image model configuration.
   * @param layout To use dynamic control form layout.
   */
  constructor(config: DynamicImageModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
  }
}
