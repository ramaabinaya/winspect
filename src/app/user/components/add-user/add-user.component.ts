// Component which is used to add a new user account.
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { UserStore } from '../../store/user/user.store';
import { AuthService } from '../../../auth/services/auth.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { FormCanDeactivate } from '../../../common/services/formCanDeactivate-guard.service';
import { UserService } from '../../services/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomAsyncValidatorService } from '../../../shared/services/customAsyncValidator.service';
import { MatomoCategories } from '../../../common/enum/categories';
import { MatomoActions } from '../../../common/enum/actions';
/**
 * Component which is used to add a new user account.
 */
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserComponent extends FormCanDeactivate implements OnInit, OnDestroy {
  /**
   * Variable which is used to display a Success message dialog box when value is true.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to get the current user information.
   * @type {User}
   */
  user: User;
  /**
   * Variable which is used to display the screen in admin mobile view.
   */
  mobileView: boolean;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Users',
    'rightIcon': '', 'rightheader': ''
  };
  /**
   * Variable which is used to define the addUserForm.
   * @type {FormGroup}
   */
  userForm: FormGroup;
  /**
   * Variable which is used to define the user roles.
   */
  userRole = [];
  /**
   * Variable which is used to define the windfarm list.
   */
  windFarms = [];
  /**
  * Variable which is used to store the subscription and unsubscribe the stored subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to define client role.
   */
  clientRole: boolean;
  /**
   * Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'ADD USER';
  /**
   * Variable which is used to define the dialog box details.
   */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: [{ label: 'Okay' }]
  };
  /**
   * Component constructor to inject the required services
   * @param authService To create the authentication for new user
   * @param router To navigate the user to the desired component.
   * @param offlineStorage To create offline database.
   * @param modalService To made the dialog box display.
   * @param userStore To update the new user details on the store.
   * @param userService To get user informations from the database.
   */
  constructor(private authService: AuthService,
    private router: Router,
    private offlineStorageService: OfflineStorageService,
    private matomoService: MatomoService,
    private userStore: UserStore,
    private userService: UserService) {
    super();
  }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    // To get current user details
    this.subscriptionObject['user'] = this.authService.user.subscribe((user) => {
      this.user = user;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      this.dialogBoxDetails.header = this.messages ? this.messages.HEADER_MESSAGE : null;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Add User';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-chevron-left';
        this.navbarDetails.rightIcon = 'assets/symbol-defs.svg#icon-users';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['getRole'] = this.userService.getRole().subscribe((response) => {
      this.userRole = response['userRole'];
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['getAllClient'] = this.userService.getAllClient().subscribe((response) => {
      this.windFarms = response['client'];
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.userForm = new FormGroup({
      'email': new FormControl(null, [Validators.email, Validators.required],
        CustomAsyncValidatorService.asyncEmailValidation(this.userService)),
      'firstname': new FormControl(null, [Validators.required]),
      'lastname': new FormControl(null, [Validators.required]),
      'role': new FormControl(null, [Validators.required])
    });
  }
  /**
  * Method which is used to navigate to the desired routes.
  * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
  */
  onNavigate(key: string) {
    if (key === 'L') {
      this.router.navigate(['app/users']);
    } else if (key === 'R') {
      this.router.navigate(['/app/groups']);
    }
  }
  selectRole() {
    if (this.userForm.value.role && this.userForm.value.role.name === 'Client') {
      this.userForm.addControl('client', new FormControl(null, [Validators.required]));
      this.clientRole = true;
    } else if ((this.userForm.value.role && this.userForm.controls['client']) &&
      (this.userForm.value.role.name === 'Admin' || this.userForm.value.role.name === 'Technician')) {
      this.clientRole = false;
      this.userForm.removeControl('client');
    }
  }
  /**
   * Method which is used to create new user account with the given details.
   * And update the server based on given role.
   * @param form {any} To get the user entered form details.
   * @return {void}
   */
  addUser() {
    const buttonName = 'Add User';
    this.matomoService.addEvent(MatomoCategories.Form, MatomoActions.Submit, buttonName);
    if (this.userForm !== undefined && this.userForm !== null) {
      const userData = {
        customerId: this.user.customerId,
        firstName: this.userForm.value.firstname,
        lastName: this.userForm.value.lastname,
        email: this.userForm.value.email,
        userRoleId: this.userForm.value.role.id
      };
      if (this.userForm.value.role.name === 'Client') {
        if (this.userForm.value && this.userForm.value.client && this.userForm.value.client.id) {
          userData['clientId'] = this.userForm.value.client.id;
        }
      }
      this.subscriptionObject['addUser'] = this.userService.addUser(userData).subscribe((user) => {
        if (user && user['user']) {
          this.userStore.createUser(user['user'], this.userForm.value.role.name);
          // tslint:disable-next-line:quotemark
          this.dialogBoxDetails.content = this.messages.USER_SUCCESS;
          this.display = true;
          this.userForm.reset();
        }
      }, (err) => {
        this.dialogBoxDetails.content = this.messages.USER_FAILURE;
        this.display = true;
      });
    }
  }
  /**
   * Method which is used to log.
   * @param event local reference variable.
   */
  manageAllUser() {
    const buttonName = 'Manage All Users';
    this.matomoService.addEvent(MatomoCategories.Form, MatomoActions.Click, buttonName);
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
  /**
   * Method which is used to alert the user when they navigates to the page
   * without saving the current page data's.
   */
  canDeactivate(): boolean {
    return this.userForm && !this.userForm.dirty;
  }
}
