// Directive class which is used to change the DOM styles and classes.
import { Directive, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
/**
 * Directive class which is used to change the DOM styles and classes.
 */
@Directive({
  selector: '[appCollapsed]'
})
export class CollapsedDirective {
   /**
   * Variable which is used to emit the button clicked event to the parant component.
   * @type {any}
   */
  @Output() appCollapsedChange = new EventEmitter<boolean>();
  /**
   * Constructor which is used to inject the required service.
   * @param _el To get native element.
   */
  constructor(private _el: ElementRef) {
  }
  /**
   *  When click event is fire then implement this function.
   */
  @HostListener('click') collapsedShow() {
    // To check parent element has show class
    if (this._el.nativeElement.parentElement.querySelector('.collapse').classList.contains('show')) {
      // To remove class('show') from the parent element
      this._el.nativeElement.parentElement.querySelector('.collapse').classList.remove('show');
      this.appCollapsedChange.next(false);
      if (this._el.nativeElement.querySelector('.card-link')) {
        this._el.nativeElement.querySelector('.card-link').classList.remove('collapsed');
      }
    } else {
      // To add class('show') for the parent element
      this._el.nativeElement.parentElement.querySelector('.collapse').classList.add('show');
      this.appCollapsedChange.next(true);
      if (this._el.nativeElement.querySelector('.card-link')) {
        this._el.nativeElement.querySelector('.card-link').classList.add('collapsed');
      }
    }
  }
}
