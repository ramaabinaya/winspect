// Component which is used to configure or reset the user password.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { filter, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
/**
 * Component which is used to configure or reset the user password.
 */
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit, OnDestroy {
  /**
  * Variable which is used to define the changePasswordForm.
  * @type {FormGroup}
  */
  changePasswordForm: FormGroup;
  /**
  * Variable which is used to define the configurePasswordForm.
  * @type {FormGroup}
  */
  configurePasswordForm: FormGroup;
  /**
   * Variable which is used to display the error message.
   * @type {string}
   */
  errorMsg: string;
  /**
   * Variable which is used to display a Success message dialog box when value is true.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to store the token of the current user logged In.
   */
  token;
  /**
   * Variable which is used to define the password is text format or not.
   */
  show: {
    showOldPassword: boolean,
    showNewPassword: boolean,
    showConfirmPassword: boolean
  } = {
      showOldPassword: null,
      showNewPassword: null,
      showConfirmPassword: null
    };
  /**
   * Variable which is used to display configure password form or not.
   *  @type {boolean}
   */
  configurePasswordView: boolean;
  /**
* Variable which is used to store the subscription and unsubscribe the stored subscriptions.
* @type {subscription}
*/
  subscriptionObject = {};
  /**
   * Variable which is used to display the screen in admin mobile view.
   */
  mobileView: boolean;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Profile',
    'rightIcon': '', 'rightheader': ''
  };
  /**
   * Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to define the dialog box details.
   */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: [{ label: 'Okay' }]
  };
  /**
  * Component constructor used to inject the required services.
  * @param userService To get the user details.
  * @param route To get the current activated route and route params.
  * @param router To navigate to other route.
  * @param offlineStorageService To find the app running in devices or not.
  * @param authService To get current user details.
  */
  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private offlineStorageService: OfflineStorageService,
    private authService: AuthService) { }
  /**
  * Component OnInit life cycle hook
  */
  ngOnInit() {
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Change Password';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-chevron-left';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['params'] = this.route.params.pipe(filter((params) => {
      this.token = params['token'];
      this.changePasswordForm = new FormGroup({
        'oldpassword': new FormControl(null, [Validators.required, Validators.minLength(8)]),
        'newpassword': new FormControl(null, [Validators.required, Validators.minLength(8)]),
        'confirmpassword': new FormControl(null, [Validators.required, Validators.minLength(8)])
      });
      return this.token;
    }), mergeMap(() => {
      return this.userService.checkToken(this.token);
    })).subscribe((res) => {
      if (res['response'] && res['response'] === 'success') {
        this.configurePasswordView = true;
        this.configurePasswordForm = new FormGroup({
          'newpassword': new FormControl(null, [Validators.required, Validators.minLength(8)]),
          'confirmpassword': new FormControl(null, [Validators.required, Validators.minLength(8)])
        });
      } else {
        this.configurePasswordView = false;
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to change the current password of the user.
   */
  changePassword() {
    this.errorMsg = '';
    if (this.changePasswordForm) {
      if (this.changePasswordForm.value.newpassword === this.changePasswordForm.value.confirmpassword) {
        const passwordData = {
          password: this.changePasswordForm.value.oldpassword,
          newPassword: this.changePasswordForm.value.newpassword
        };
        this.subscriptionObject['changePassword'] = this.userService.onChangePassword(passwordData).subscribe((res) => {
          if (res['user']) {
            this.dialogBoxDetails.content = this.messages.CHANGE_PASSWORD_SUCCESS;
            this.display = true;
          }
        }, (err) => {
          if (err.error && err.error.error) {
            this.dialogBoxDetails.content = this.messages.INAVLID_PASSWORD;
            this.display = true;
          }
        });
        this.changePasswordForm.reset();
      } else {
        this.errorMsg = this.messages.PASSWORD_MISMATCH;
      }
    }
  }
  /**
   * Method which is used to create or edit the users password field.
   */
  configurePassword() {
    if (this.configurePasswordForm) {
      if (this.configurePasswordForm.value.newpassword === this.configurePasswordForm.value.confirmpassword) {
        const passwordData = {
          token: this.token,
          password: this.configurePasswordForm.value.newpassword,
        };
        this.subscriptionObject['configurePassword'] = this.userService.configurePassword(passwordData).subscribe((res) => {
          if (res['user']) {
            this.dialogBoxDetails.content = this.messages.CONFIGURED_PASSWORD_SUCCESS;
            this.display = true;
          }
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error: ', err.error.error);
          }
        });
        this.configurePasswordForm.reset();
      } else {
        this.errorMsg = this.messages.PASSWORD_MISMATCH;
      }
    }
  }
  /**
   * Method which is used to clear the change password form or configure password form.
   */
  resetForm() {
    this.router.navigate(['app/profile']);
  }
  /**
   * Method which is used to define whether to display the password in text format or not.
   * @param property hold the current form of the password.
   */
  changeInputType(property: string) {
    if (this.show) {
      this.show[property] = !this.show[property];
    }
  }
  /**
    * Method which is used to navigate to the desired routes.
    */
  onNavigate() {
    this.router.navigate(['app/inspection/notification']);
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.display = event;
  }
  /**
   * Component OnDestroy life cycle hook
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
