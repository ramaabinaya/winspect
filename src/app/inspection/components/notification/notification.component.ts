// Notifictaion component is for displaying the number of comments unread and user details.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { Router } from '@angular/router';
import { User } from '../../../user/model/user.model';
/**
 * Component which is used to display the number of comments unread and user details.
 */
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to define the current user details.
   */
  user: User;
  /**
   * Variable which is used to define the firstletter of the user firstname.
   */
  firstLetter: string;
  /**
   * Variable which is used to define the firstletter of the user lastname.
   */
  lastLetter: string;
  /**
   * Variable which is used to decide whether the network available or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
  * Variable which is used to store the subscription and unsubscribe the store subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to display the mobile view.
   */
  mobileView: boolean;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '',
    'rightIcon': '', 'rightheader': '', 'searchbox': false, 'navMenu': 'Profile',
  };
  /**
   * Component constructor which is used to inject the needed services.
   * @param authService To get current user details.
   * @param router To navigate to other route.
   * @param offlineStorageService To get network details.
   */
  constructor(private authService: AuthService,
    private router: Router,
    private offlineStorageService: OfflineStorageService) { }
  /**
   * Component OnInit lifecycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-user';
        this.navbarDetails.rightheader = 'Close';
        this.navbarDetails.header = 'Account Settings';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['networkDisconnected'] = this.offlineStorageService.networkDisconnected.subscribe((value) => {
      this.disconnected = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['user'] = this.authService.user.subscribe((user) => {
      this.user = user;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (this.user) {
      this.firstLetter = this.user.firstName.toUpperCase().substr(0, 1);
      this.lastLetter = this.user.lastName.toUpperCase().substr(0, 1);
    }
  }
  /**
  * Method which is used to navigate to the desired routes.
  * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
  */
  onNavigate(key: string) {
    if (key === 'R') {
      if (this.user && this.user.role !== 'Admin') {
        this.router.navigate(['/app/inspection/assignedinspection']);
      } else if (this.user && this.user.role === 'Admin') {
        this.router.navigate(['/app/inspection/reports']);
      }
    } else if (key === 'L') {
      this.router.navigate(['/app/inspection/notification']);
    }
  }
  /**
   * Component OnDestroy lifecycle hook.
   * And unsubscribe all the subscription done in the component.
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
