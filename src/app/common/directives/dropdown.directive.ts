import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';
/**
 * Directive class which is used to change the DOM styles and classes.
 */
@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  /**
   * Constructor which is used to inject the required service.
   * @param _el To get native element.
   */
  constructor(private _el: ElementRef) {
  }
  /**
   * You can set the property for the host element.
   * @type {boolean}
   */
  @HostBinding('class.show') isOpen = false;
  /**
   *  When click event is fire then implement this function.
   */
  @HostListener('click') toggleShow() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // To add class('show') for the host element
      this._el.nativeElement.querySelector('.dropdown-menu').classList.add('show');
    } else {
      // To remove class('show') from the host element
      this._el.nativeElement.querySelector('.dropdown-menu').classList.remove('show');
    }
  }
  /**
   *  When document click event is fire then implement this function.
   *  @param event {Event} which is used to define the DOM event.
   */
  @HostListener('document:click', ['$event.target']) close(targetElement) {
    const inside: boolean = this._el.nativeElement.contains(targetElement);
    if (!inside) {
      this.isOpen = false;
      // To remove class('show') from the host element
      this._el.nativeElement.querySelector('.dropdown-menu').classList.remove('show');
    }
  }
}
