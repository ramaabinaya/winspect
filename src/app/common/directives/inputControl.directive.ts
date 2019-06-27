// Directive class which is used to change the DOM styles and classes.
import { HostListener, Directive, Input } from '@angular/core';
import { OfflineStorageService } from '../services/offlineStorage.service';
/**
 * Directive class which is used to change the DOM styles and classes.
 */
@Directive({
  selector: '[appInput]'
})
export class InputControlDirective {
  @Input() navbarType;
  /**
 * Constructor which is used to inject the required service.
 * @param offlineStorageService To used for assigning the focusMode value.
 */
  constructor(private offlineStorageService: OfflineStorageService) {
  }
  /**
   * Method which is used to hide the navbar while focus on input control.
   */
  @HostListener('onFocus') hideNav() {
    this.offlineStorageService.focusMode.next(true);
  }
  /**
   * Method which is used to show the navbar while focus on input control.
   */
  @HostListener('onBlur') showNav() {
    this.offlineStorageService.focusMode.next(false);
  }
  /**
   * Method which is used to hide the navbar while focus on input control.
   */
  @HostListener('focus') hide() {
    this.offlineStorageService.focusMode.next(true);
  }
  /**
   * Method which is used to hide the navbar while blur on input control.
   */
  @HostListener('blur') show() {
    // tslint:disable-next-line:max-line-length
    if (this.navbarType === 'RedBottomTray' || this.navbarType === 'BottomInputlistContainer' || this.navbarType === 'EditSectionContainer') {
      this.offlineStorageService.focusMode.next(this.navbarType);
    } else {
      this.offlineStorageService.focusMode.next(false);
    }
  }
}
