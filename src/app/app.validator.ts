// Custom validator for the dynamicforms
import { AbstractControl, ValidationErrors } from '@angular/forms';
/**
 * function which defines the validator for checking the existence of space in the userId field.
 * @param control Which holds the formcontrol on which this validator is used.
 */
export function customvalidator(control: AbstractControl): ValidationErrors | null {
    const hasError = control.value ? (control.value as string).includes(' ') : false;
    return hasError ? {customvalidator: true} : null;
}
