import {HostListener} from '@angular/core';

/**
 * Abstract class method which is used to check whether the changes are saved when reload the page.
 */
export abstract class FormCanDeactivate {

/**
 * abstract function,It can be implemented in component.
 * @return {boolean}
 */
  abstract  canDeactivate(): boolean;

  /**
   *  When beforeunload event is fire then implement this function.
   *  @param event {Event} which is used to define the DOM event.
   */
  @HostListener('window:beforeunload') onBeforeUnload(event: Event) {
    // To execute the canDeactivate method in the component which implements this abstarct function
    if (!this.canDeactivate()) {
      return false;
    }
  }
}
