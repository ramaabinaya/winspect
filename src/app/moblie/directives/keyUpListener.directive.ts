import { Directive, HostListener, ElementRef, Input, EventEmitter, Output } from '@angular/core';
/**
 * Enum used to set the key code value to constant variable.
 */
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

/**
 * Directive class which is used to listen the keyup event.
 */
@Directive({
  selector: '[appKeyUpListener]'
})
export class KeyUpListenerDirective {

  /**
   * Constructor which is used to inject the required service.
   * @param _el To get native element.
   */
  constructor(private _el: ElementRef) {
  }
  /**
   * Variable which is used to get the selected image id from the binded variable.
   */
  @Input('appKeyUpListener') imageId: number;
  /**
   * Variable which is used to get count of the images.
   */
  @Input() count: number;
  /**
   * Variable which is used to emit the changes image index to the binded variable.
   */
  @Output() appKeyUpListenerChange = new EventEmitter<number>();

  /**
   *  When keyboard is pressed then implement this function.
   */
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW && this.count - 1 > this.imageId) {
      this.imageId = this.imageId + 1;
      this.appKeyUpListenerChange.next(this.imageId);
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW && this.imageId > 0) {
      this.imageId = this.imageId - 1;
      this.appKeyUpListenerChange.next(this.imageId);
    }
  }

}
