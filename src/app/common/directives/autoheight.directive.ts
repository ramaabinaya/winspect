// Directive class which is used to change the DOM styles and classes.
import { Directive, HostListener, ElementRef, Output, EventEmitter, OnInit, Renderer2 } from '@angular/core';
/**
 * Directive class which is used to change the DOM styles and classes.
 */
@Directive({
  selector: '[appAutoHeight]'
})
export class AutoHeightDirective implements OnInit {
  /**
   * Constructor which is used to inject the required service.
   * @param _el To get native element.
   */
  constructor(private _el: ElementRef,
    private render: Renderer2) {
  }
  ngOnInit() {
    this.render.listen('window', 'load', () => {
      const height = this._el.nativeElement.getBoundingClientRect().height;
      console.log('height', height);
      this._el.nativeElement.style.setProperty('--pageView', height);

    });
  }
}
