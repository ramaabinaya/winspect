import {
  DynamicFormControlLayout,
  DynamicFormValueControlModelConfig,
  DynamicFormValueControlModel,
  serializable,
} from '@ng-dynamic-forms/core';
/**
 * Variable which is used to define the form control type.
 * @type {string}
 */
export const DYNAMIC_FORM_CONTROL_TYPE_FIELD = 'FIELD';
/**
 * Class which is used to define the model configuration properties.
 */
export interface DynamicFieldModelConfig extends DynamicFormValueControlModelConfig<number> {
  /**
   * Variable which is used to define the report id.
   * @type {number}
   */
  editId?: number;
  /**
   * Variable which is used to define the dynamic field name.
   * @type {any}
   */
  question?: any;
}
/**
 * Class which is used to define the custom dynamic-field model properties.
 */
export class DynamicFieldModel extends DynamicFormValueControlModel<number> {
  /**
   * Variable which is used to define the report id.
   * @type {number}
   */
  editId: number | null;
  /**
   * Variable which is used to define the dynamic field name.
   * @type {any}
   */
  question: any;
   /**
   * Variable which is used to define type of the model.
   * @type {string}
   */
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_FIELD;
  /**
   * Constructor which is used to inject the required services.
   * @param config To use dynamic field model configuration.
   * @param layout To use dynamic control form layout.
   */
  constructor(config: DynamicFieldModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.editId = config.editId;
    this.question = config.question;
  }
}
