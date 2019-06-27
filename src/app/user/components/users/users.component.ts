// Component which is used to display all the user details.
import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { UserStore } from '../../store/user/user.store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SortingService } from '../../../shared/services/sorting.service';
import { UserService } from '../../services/users.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { AuthService } from '../../../auth/services/auth.service';
import { mergeMap } from 'rxjs/operators';
import { MatomoCategories } from '../../../common/enum/categories';
import { MatomoActions } from '../../../common/enum/actions';
/**
 * Component which is used to display all the user details.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to define the users list.
   * @type {User[]}
   */
  users: User[] = null;
  /**
  * Variable which is used to display the screen in admin mobile view.
  */
  mobileView: boolean;
  /**
   * Variable which is used to define the formgroup.
   * @type {FormGroup}
   */
  editForm: FormGroup;
  /**
   * Variable which is used to refers the usertTable in the users.
   */
  @ViewChild('userListRef') userTableRef;
  /**
  * Variable which is used to define the column field name in primeng table.
  * @type {any[]}
  */
  column = [
    { field: 'user.name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'userRole.name', header: 'Role' },
    { field: 'Actions', header: 'Actions' },
  ];
  /**
   * Variable which is used to store the subscription and unsubscribe the stored subscriptions.
   */
  subscriptionObject = {};
  /**
   * Variable which is used to store the assignInspectionUser details to refer it locally.
   */
  filteredReport = null;
  /**
   * Variable which is used to store the user name.
   */
  userName: string;
  /**
   * Variable which is used to check whether the userlist exist or not.
   */
  resultNotExist: boolean;
  /**
   * Variable which is used to check whether the list is active users or archived users.
   */
  archivedUsersView: boolean;
  /**
   * Variable which is used to define the archived users.
   */
  archivedUsers = [];
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'headerTab': true, 'navMenu': 'Users',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': true
  };
  /**
   * Variable which is used to display content on the tab header
   */
  headerTab = {
    'tab1': 'Users', 'tab2': 'Archived'
  };
  /**
   * Variable which is used to define type of sorting.
   */
  sortingDetails = [
    { 'label': 'Email', 'value': 'Email' },
    { 'label': 'Role', 'value': 'UserRoleName' },
    { 'label': 'User Name', 'value': 'UserName' }
  ];
  /**
   * Variable which is used to define the already exist user when edit the user.
   */
  alreadyUserExist: boolean;
  /**
   * Variable which is used to display modal dialog box.
   */
  modalReference = null;
  /**
   * Variable which is used to show the filter bar.
   * @type {Boolean}
   */
  showFilter: boolean;
  /**
   * Variable which is used to define the currently selected row index.
   */
  bottomSheetIndex: number;
  /**
   * Variable which is used to define the bottom menu action.
   */
  bottomSheetDetails = [];
  /**
  * Variable which is used to define the edit template.
  */
  @ViewChild('edit') editModal;
  /**
   * Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'USERS';
  /**
   * Variable which is used to define the dialog box details.
   */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: []
  };
  display: boolean;
  userRoleList;
  /**
   * Variable which is used to define the current row selected for the bottom sheet action implementation.
   */
  currentActionRow;
  /**
   * Component constructor to inject the required services.
   * @param userStore To get and update the user details on the store.
   * @param userService To get the userRole Details.
   * @param sortService To sortService the users.
   * @param router To navigate the user to the desired component.
   * @param offlineStorageService To create tables and get synchorization completed percentage.
   * @param matomoService to perform metric operation on this component.
   * @param modalService To made the dialog box display.
   * @param authService To get current user details.
   */
  constructor(private userStore: UserStore,
    private userService: UserService,
    private sortService: SortingService,
    private router: Router,
    private offlineStorageService: OfflineStorageService,
    private matomoService: MatomoService,
    private modalService: NgbModal,
    private authService: AuthService) {
  }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    let userRoleList = [];
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-user';
        this.navbarDetails.rightIcon = 'assets/symbol-defs.svg#icon-adduser';
        this.navbarDetails.placeholder = 'Search UserName';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      this.dialogBoxDetails.header = this.messages ? this.messages.HEADER_CONFIRMATION : [];
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['users'] = this.userStore.users.pipe(mergeMap((users) => {
      this.archivedUsers = [];
      if (users) {
        const usersCopy = users.filter((item: any) => {
          return (item && item.userRole && item.userRole.name !== 'Admin');
        }).filter((item: any) => {
          const username = item.firstName + ' ' + item.lastName;
          item.user = {
            name: username
          };
          if (item.active === 0) {
            this.archivedUsers.push(item);
          }
          return (item.active === 1);
        });
        if (usersCopy) {
          this.users = usersCopy;
          const userNameList = usersCopy.filter((item: any) => {
            return (item && item.userRole && item.userRole.name !== 'Admin');
          }).map((item: any) => {
            return ({ label: item.user.name, value: item.user.name });
          });
          this.sortService.filterDetails = [
            {
              'header': 'User Name', 'options': userNameList,
              'type': 'select', 'placeholder': 'Search User', 'column': 'user.name',
            },
          ];
          this.sortService.sortReport(this.users, 'ModifiedDate');
        }
        if (this.archivedUsersView) {
          if (!this.userName) {
            this.filteredReport = this.archivedUsers;
            this.sortService.sortReport(this.filteredReport, 'ModifiedDate');
          } else {
            this.searchValue(this.userName);
          }
        }
        if (!this.archivedUsersView) {
          if (!this.userName) {
            this.filteredReport = this.users;
          } else {
            this.searchValue(this.userName);
          }
        }
      }
      const usercopy = _.cloneDeep(this.users);
      if (this.currentActionRow) {
        usercopy.push(this.currentActionRow);
        setTimeout(() => {
          this.sortService.filterDetailsChanged.emit(true);
        }, 100);
      }

      return this.userService.getRole();
    })).subscribe((response) => {
      if (response['userRole']) {
        const userRole = response['userRole'];
        userRoleList = userRole.filter((item) => (item && item.id !== 2))
          .map((item) => {
            return ({ label: item.name, value: item.name });
          });
        this.sortService.filterDetails.push({
          'header': 'User Role', 'type': 'select', 'options': userRoleList, 'placeholder': 'Search by Role',
          'column': 'userRole.name'
        });
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to open the filter component.
   */
  addMetric() {
    const buttonName = 'Add New User';
    this.matomoService.addEvent(MatomoCategories.Page, MatomoActions.Click, buttonName);
  }
  /**
   * Method which is used to open the filter component.
   */
  showFilters() {
    this.showFilter = true;
  }
  /**
   * Method which is used to update the filtered table details.
   * @param event The value that holds the filtered records.
   */
  getFilteredTable(event) {
    this.userTableRef = event;
  }
  /**
  * Method which is used to navigate to the desired routes.
  * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
  */
  onNavigate(key: string) {
    if (key === 'L') {
      this.router.navigate(['/app/inspection/notification']);
    } else if (key === 'R') {
      this.router.navigate(['/app/adduser']);
    }
  }
  /**
   * Method which is used to update the user information on the store.
   * @return {void}
   */
  onEditAccount() {
    this.alreadyUserExist = false;
    if (this.users) {
      this.users.find((item) => {
        if (item.email === this.editForm.value.email) {
          return this.alreadyUserExist = true;
        }
      });
    }
    if (this.users && this.currentActionRow.id && !this.alreadyUserExist && this.editForm && this.editForm.value
      && this.currentActionRow || (this.currentActionRow.email === this.editForm.value.email)) {
      if (this.modalReference) {
        this.modalReference.close();
      }
      this.userStore.editUser(this.currentActionRow.id, this.editForm.value);
    }
  }
  /**
   * Method which is used to clear the search input.
   */
  onClear() {
    this.userName = undefined;
    this.resultNotExist = false;
    if (this.archivedUsersView) {
      this.filteredReport = this.archivedUsers;
    }
    if (!this.archivedUsersView) {
      this.filteredReport = this.users;
    }
  }
  /**
   * Method which is used to sort the completed reports table.
   * @param key Variable which is used to select the sortService column of the table.
   */
  sortReport(key) {
    this.sortService.sortReport(this.filteredReport, key);
  }
  /**
   * Method which is used to select the wind farm name.
   * @param event {any} To get the values entered in the search box.
   */
  searchValue(event) {
    this.userName = event;
    this.filteredReport = [];
    this.resultNotExist = false;
    if (this.userName === undefined) {
      if (this.archivedUsersView) {
        this.filteredReport = this.archivedUsers;
      }
      if (!this.archivedUsersView) {
        this.filteredReport = this.users;
      }
    } else {
      if (this.archivedUsersView) {
        this.filteredReport = this.archivedUsers.filter((user) => {
          const username = user.firstName + ' ' + user.lastName;
          return (username && username.toLowerCase().indexOf(this.userName.toLowerCase()) !== -1);
        });
      } else {
        this.filteredReport = this.users.filter((user) => {
          const username = user.firstName + ' ' + user.lastName;
          return (username && username.toLowerCase().indexOf(this.userName.toLowerCase()) !== -1);
        });
      }
      if (this.filteredReport.length === 0) {
        this.resultNotExist = true;
      }
    }
  }
  /**
   * Method which is used to display a model for archiving the users.
   * @param user Which is define the currently selected user.
   */
  openArchiveModal(user) {
    this.currentActionRow = user;
    this.dialogBoxDetails.content = this.messages.ARCHIVE_USER;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'Archive' }, { label: 'No' });
    this.display = true;
  }
  /**
   * Method which is used to display a model for edit the users
   * @param i {number} To define the selected user index.
   * @param edit local reference variable.
   */
  openModalEdit(i: number, edit?) {
    this.alreadyUserExist = false;
    if (this.users) {
      this.users.find((item) => {
        if (item && item.id === i) {
          this.currentActionRow = item;
          return true;
        }
      });
      if (this.currentActionRow) {
        this.editForm = new FormGroup({
          'email': new FormControl(this.currentActionRow.email, Validators.required),
          'firstName': new FormControl(this.currentActionRow.firstName, Validators.required),
          'lastName': new FormControl(this.currentActionRow.lastName, Validators.required)
        });
      }
    }
    this.modalReference = this.modalService.open(edit, { centered: true });
  }
  /**
   * Method which is used to display a model for restoring the users.
   * @param @param user Which is define the currently selected user.
   */
  openRestoreModal(user) {
    this.currentActionRow = user;
    this.dialogBoxDetails.content = this.messages.RESTORE_USER;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'Restore' }, { label: 'No' });
    this.display = true;
  }
  /**
   * Method which is used to archive the users.
   */
  onArchive() {
    event.stopPropagation();
    if (this.currentActionRow.id !== null && this.currentActionRow.id !== undefined) {
      this.userStore.changeUserStatus(this.currentActionRow.id, 0);
    }
  }
  /**
   * Method which is used to restore the selected user back to the active users from the inactive state.
   * @param id {number} Paramater which is used to define the selected userId.
   * @return {void}
   */
  onRestoreUser(id: number) {
    if (this.archivedUsers && id) {
      this.archivedUsers.find((item) => {
        if (item && item.id === id) {
          this.userStore.changeUserStatus(id, 1);
          return true;
        }
      });
    }
  }
  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   */
  filterGlobal(event) {
    if (this.userTableRef) {
      this.userTableRef.filter(event, 'global', 'contains');
    }
  }
  /**
    * Method which is used to display a model for open a bottom sheet
    * @param id table index value.
    */
  openBottomSheet(id) {
    this.bottomSheetIndex = id;
    this.bottomSheetDetails = ['Archive', 'Edit'];
  }
  /**
   * Method which is used to display a model for close a bottom sheet
   * @param event local reference variable.
   */
  closeBottomSheet(event) {
    this.bottomSheetIndex = event;
  }
  /**
   * Method which is used to select the which action is triggered
   * @param event event {any} To define the event value.
   * @param user Which is define the currently selected row.
   */
  bottomSheetMenuAction(event, user) {
    if (event === 'Archive') {
      this.openArchiveModal(user);
    } else if (event === 'Edit') {
      this.openModalEdit(user.id, this.editModal);
    }
  }
  /**
   * Method which is used to navigate the user based on the header tab clicked in
   * the top-navbar.
   * @param event the event that triggered from the top navbar while clicking the tabs.
   */
  tabAction(event) {
    this.userName = undefined;
    this.filteredReport = [];
    this.resultNotExist = false;
    if (event === true) {
      this.filteredReport = this.archivedUsers;
      this.archivedUsersView = true;
    } else if (event === false) {
      this.filteredReport = this.users;
      this.archivedUsersView = false;
    }
  }
  /**
   * Method which is used to define which action is triggered.
   * @param event event {any} To define the event value.
   */
  dialogBoxAction(event) {
    this.display = false;
    if (event === 'Archive') {
      this.onArchive();
    } else if (event === 'Restore') {
      this.onRestoreUser(this.currentActionRow.id);
    }
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.display = event;
    this.dialogBoxDetails.action = [];
  }
  /**
   * Component OnDestroy life cycle hook.
   * And unsubscribe all the subscriptions in the component.
   */
  ngOnDestroy() {
    this.sortService.selectedDetails = [];
    if (this.subscriptionObject) {
      for (const subscriptionProperty in this.subscriptionObject) {
        if (this.subscriptionObject[subscriptionProperty]) {
          this.subscriptionObject[subscriptionProperty].unsubscribe();
        }
      }
    }
  }
}
