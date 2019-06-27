import { DynamicFormValueControlModelConfig,
   DynamicFormValueControlModel,
   serializable,
   DynamicFormControlLayout } from '@ng-dynamic-forms/core';
/**
 * Variable which is used to define the form control type.
 * @type {string}
 */
export const DYNAMIC_FORM_CONTROL_TYPE_SUBCATEGORY = 'SUBCATEGORY';
/**
 * Class which is used to define the model configuration properties.
 */
export interface DynamicSubcategoryModelConfig extends DynamicFormValueControlModelConfig<string | number | Date | string[]> {
  /**
   * Variable which is used to define the subcategory value.
   * @type {string}
   */
  subcategoryName?: string;
}
/**
 * Class which is used to define the custom dynamic-subcategory-model properties.
 */
export class DynamicSubcategoryModel extends DynamicFormValueControlModel<string | number | Date | string[]> {
  /**
   * Variable which is used to define the subcategory value.
   * @type {string}
   */
  subcategoryName: string;
  /**
   * Variable which is used to define type of the model.
   * @type {string}
   */
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_SUBCATEGORY;
  /**
   * Constructor which is used to inject the required services.
   * @param config To use dynamic image model configuration.
   * @param layout To use dynamic control form layout.
   */
  constructor(config: DynamicSubcategoryModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.subcategoryName = config.subcategoryName;
  }
}
