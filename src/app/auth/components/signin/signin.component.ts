/**
 * Signin component, which is used to authenticate the user and provide access to our application.
 */
import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { mergeMap, filter } from 'rxjs/operators';
/**
 * Variable which is used to define the window screen
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used to sign in the user into the application.
 */
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit, OnDestroy {
  /**
   * Refering the login form for accessing the template controls.
   */
  @ViewChild('f') loginForm: NgForm;
  /**
   * Variable which is used to define the password is text format or not.
   */
  show: boolean;
  /**
  * Variable which is used to store the subscription and unsubscribe the store     *subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to check whether a network is connected or not.
   *  @type {boolean}
   */
  disconnected = false;
  /**
   * Variable which is used to check whether an error occurred during user login.
   * @type {boolean}
   */
  error: boolean;
  /**
  * Variable which is used to display the errormessage to the user while login.
  * @type {string}
  */
  errorMsg: string;
  /**
   * Variables which is used to display forgot password view.
   */
  forgotPasswordView: boolean;
  /**
   * Variables which is used to define the forgot password form details.
   */
  @ViewChild('forgotForm') forgotPasswordForm: NgForm;
  /**
 * Variable which is used to display the message like error, success etc.,
 */
  messages: any;
  /**
   * Component constructor used to inject the required services.
   * @param authService To authenticate the user with the given login credentials.
   * @param offlineStorage To authenticate the user in offline mode.
   * @param router To navigate to other route.
   */
  constructor(private authService: AuthService,
    private offlineStorage: OfflineStorageService,
    private router: Router) {
    this.show = false;
  }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['messages'] = this.authService.errorMessages.pipe(filter((res) => {
      this.messages = res ? res : null;
      return this.messages;
    }), mergeMap(() => {
      return this.offlineStorage.networkDisconnected;
    })).subscribe((value) => {
      this.disconnected = value;
      if (this.disconnected) {
        this.errorMsg = this.messages ? this.messages.CHECK_CONNECTION : '';
        this.error = true;
      } else {
        this.error = false;
        this.errorMsg = undefined;
      }
    }, (err) => {
      if (err) {
        console.log('Error: ', err);
      }
    });
  }
  /**
   * Method which is used to login the user into the application.
   * @return {void}
   */
  onSignIn() {
    const auth = {
      'email': this.loginForm.value.loginemail,
      'password': this.loginForm.value.loginpassword,
    };
    // To check wheteher the network is connected or not
    if (auth && !this.disconnected) {
      let deviceName;
      let deviceUid;
      if (window && window.cordova) {
        deviceName = window.device.name;
        deviceUid = window.device.uuid;
      } else {
        deviceName = null;
        deviceUid = null;
      }
      const email = auth.email;
      const password = auth.password;
      // Login into the application when network is available
      this.subscriptionObject['signinUser'] = this.authService.signinUser(email, password, deviceName, deviceUid).subscribe((res) => {
        // If authentication is passed then navigate to home page
        this.router.navigate(['app/home']);
      }, (err) => {
        if (err.error && err.error.error) {
          this.errorMsg = err.error.error;
          this.error = true;
        }
      });
    } else if (window && window.cordova && auth && this.disconnected) {
      const password = auth.password;
      const email = auth.email;
      // Login into the application when network is not available and running on device
      this.offlineStorage.getCurrentUser(email, password)
        .then((user) => {
          if (user && user.rows.length > 0) {
            // If user row is return then navigate to home page
            for (let i = 0; i < user.rows.length; i++) {
              const userdetails = user.rows.item(i);
              // Store the token and user datails into local storage.
              localStorage.setItem('currentUserToken', JSON.stringify({ token: null, isAuthenticated: true }));
              this.router.navigate(['app/home']);
            }
          } else {
            this.error = true;
            this.errorMsg = this.messages.INVALID_CREDENTIAL;
          }
        }).catch((e) => {
          console.log('error in retrieving current user data!', e.message);
        });
    }
  }
  /**
   * Method which is used to display forgot password view.
   */
  forgot() {
    this.forgotPasswordView = true;
    this.error = undefined;
  }
  /**
   * Method which is used to reset the password.
   */
  forgotPassword() {
    let email;
    if (this.forgotPasswordForm && this.forgotPasswordForm.value) {
      email = this.forgotPasswordForm.value.email;
    }
    this.subscriptionObject['sendEmail'] = this.authService.sendEmail(email).subscribe((res) => {
      if (res['status']) {
        this.error = false;
        this.errorMsg = res['status'];
      }
    }, (err) => {
      console.log('err');
      if (err.error && err.error.error) {
        this.errorMsg = err.error.error;
        this.error = true;
      }
    });
  }
  /**
   * Component ondestroy life cycle hook.
   * All subscriptions are unsubscribe here.
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
