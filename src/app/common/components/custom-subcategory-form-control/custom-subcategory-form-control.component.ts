// custom-subcategory-form-control component,which describe the functionality for creating the form control of DynmicSubcategoryModel.
import { Component, OnInit, Input } from '@angular/core';
/**
 * Comoponent which is used to create the custom form control for dynamic-subcategrymodel.
 */
@Component({
  selector: 'app-custom-subcategory-form-control',
  templateUrl: './custom-subcategory-form-control.component.html',
  styleUrls: ['./custom-subcategory-form-control.component.css']
})
export class CustomSubcategoryFormControlComponent implements OnInit {
  /**
   * Variable which is used to define the subCategory from the parent component.
   * @type {any}
   */
  @Input() subCategory;
  /**
  * Constructor which is used to inject the required services.
  */
  constructor() { }
  /**
   * Component onInit life cycle hook.
   */
  ngOnInit() {
  }
}
