import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { FormCanDeactivate } from './formCanDeactivate-guard.service';
import { Observable ,  Observer } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

/**
 * Guard which is used to check whether the changes are saved when navigate to other page
 */
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<FormCanDeactivate> {

  /**
   * Serive constructor which defines the needed services to inject here.
   * @param confirmationService To get the confirmation dialog service.
   */
  constructor(private confirmationService: ConfirmationService) { }

   /**
   * Method which is used to dispaly dialog when navigate to another route without saving from data.
   * @param component To get the FormCanDeactivate component
   */
  canDeactivate(component: FormCanDeactivate): Observable<boolean> | boolean {

    // To check whether the component have unsaved changes
    if (!component.canDeactivate()) {
      // If component have unsaved changes then create observable to return the selected value
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          // message: 'You have unsaved changes. Are you sure you want to leave this page?',
          message: 'Are you sure you want to leave this page?',
          header: 'Confirmation',
          accept: () => {
           // If user accept to navigate to  the another route then return true
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            // If user reject the navigate to another route then return false
            observer.next(false);
            observer.complete();
          }
        });
      });
    } else {
      return true;
    }
  }
}
