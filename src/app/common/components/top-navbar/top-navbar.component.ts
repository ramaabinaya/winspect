// TopNavbar Component which is used to display the top navbar details.
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { User } from '../../../user/model/user.model';
import * as _ from 'lodash';
/**
 * window variable is used to define the window instance and to access the window related methods.
 * @type {any}
 */
declare let window: any;
/**
 * window variable to access the cordova plugin related functionalities.
 * @type {any}
 */
declare let cordova: any;
/**
 * Component which is used to display the topNavbar in mobile view.
 */
@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css'],
  providers: [MessageService]
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to define the headerDetails in mobile view top navbar from the parent component.
   */
  @Input() headerDetails;
  /**
   * Variable which is used to define type of sorting from the parent component.
   */
  @Input() sortingDetails;
  /**
   * Variable which is used to define the selected value from the parent component.
   */
  @Input() selectedValue;
  /**
   * Variable which is used to define the headerTab value from the parent component.
   */
  @Input() headerTab;
  /**
    * Variable which is used to emit the clicked value to the parant component.
    * @type {any}
    */
  @Output() leftheaderClicked = new EventEmitter<any>();
  /**
   * Variable which is used to emit the clicked value to the parant component.
   * @type {any}
   */
  @Output() rightheaderClicked = new EventEmitter<any>();
  /**
   * Variable which is used to emit the clear the entered value to the parant component.
   * @type {any}
   */
  @Output() clear = new EventEmitter<any>();
  /**
   * Variable which is used to emit the keyUp event to the parant component.
   * @type {any}
   */
  @Output() keyValues = new EventEmitter<any>();
  /**
   * Variable which is used to emit the sorting method to the parant component.
   * @type {any}
   */
  @Output() sorting = new EventEmitter<any>();
  /**
   * Variable which is used to emit the tabAction method to the parant component.
   */
  @Output() tabAction = new EventEmitter<boolean>();
  /**
  * Variable which is used to decide whether the network is connected or not.
  * @type {boolean}
  */
  disconnected: boolean;
  /**
   * Variable which is used to subscribe and unsubscribe the network status,
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to define the current user.
   */
  user: User;
  /**
   * Variable which is used to define the currently selected headerTab.
   */
  firstTab = true;
  /**
   * Constructor which is used to inject the required services.
   * @param offlineStorage To create offline database.
   * @param authService To authenticate the user with the given login credentials.
   */
  constructor(private offlineStorage: OfflineStorageService,
    private authService: AuthService) { }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['user'] = this.authService.user.subscribe((user) => {
      this.user = user;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (window.cordova) {
      this.subscriptionObject['network'] = this.offlineStorage.networkDisconnected.subscribe((value: boolean) => {
        this.disconnected = value;
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
      const navMenu = this.headerDetails ? this.headerDetails.navMenu : null;
      this.authService.currentActiveMenu.emit(navMenu);
    }
  }
  /**
   * Method which is used to emit the button clicken event to the parent component
   * @param event {any} To define the event value.
   */
  leftHeaderClicked(event) {
    this.leftheaderClicked.emit();
  }
  /**
   * Method which is used to emit the button clicken event to the parent component
   * @param event {any} To define the event value.
   */
  rightHeaderClicked(event) {
    this.rightheaderClicked.emit();
  }
  /**
   * Method which is used to emit when the enter text is clear to the parent component
   * @param event {any} To define the event value.
   */
  onClear(event) {
    this.selectedValue = '';
    this.clear.emit();
  }
  /**
   * Method which is used to emited when the text is entered into the text box to the parent component
   * @param event {any} To define the event value.
   */
  onKeyUp(event) {
    this.keyValues.emit(this.selectedValue);
  }
  /**
   * Method which is used to emit the button clicken event to the parent component.
   * @param event {any} To define the event value.
   * @param value To define the selected value.
   * @param myDrop To define the dropdown list.
   */
  sortingReport(event, value, myDrop) {
    this.sorting.emit(value);
    event.stopPropagation();
  }
  /**
   * Method which is used to emit the first tab action
   */
  tabOptionEmit(event) {
    this.firstTab = event;
    this.tabAction.emit(!event);
  }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnDestroy() {
    if (this.subscriptionObject) {
      for (const subscriptionProperty in this.subscriptionObject) {
        if (this.subscriptionObject[subscriptionProperty]) {
          this.subscriptionObject[subscriptionProperty].unsubscribe();
        }
      }
    }
  }
}
