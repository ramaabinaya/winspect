// Directive class which is used to change the DOM styles and classes.
import { HostListener, Directive } from '@angular/core';
import { OfflineStorageService } from '../services/offlineStorage.service';
/**
 * Directive class which is used to change the DOM styles and classes.
 */
@Directive({
  selector: '[appDynamicInput]'
})
export class DynamicInputControlDirective {
  /**
 * Constructor which is used to inject the required service.
 * @param offlineStorageService To used for assigning the focusMode value.
 */
  constructor(private offlineStorageService: OfflineStorageService) {
  }
  /**
   * Method which is used to hide the navbar while focus on input control.
   */
  @HostListener('focus') hide() {
    this.offlineStorageService.focusMode.next(true);
  }

  @HostListener('blur') show() {
    this.offlineStorageService.focusMode.next('RedBottomTray');
  }

}
