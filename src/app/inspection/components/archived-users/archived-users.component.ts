// ArchivedUser component is for displaying the list of archived users.
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserStore } from '../../../user/store/user/user.store';
import { UserService } from '../../../user/services/users.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { User } from '../../../user/model/user.model';
import { AuthService } from '../../../auth/services/auth.service';
import { MatomoService } from '../../../common/services/matomo.service';
/**
* Component which is used to display the list of archived users and archived reports.
*/
@Component({
  selector: 'app-archived-users',
  templateUrl: './archived-users.component.html',
  styleUrls: ['./archived-users.component.css']
})
export class ArchivedUsersComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to decide whether the userdetails available or not.
   * @type {subscription}
   */
  responseReceived: boolean;
  /**
   * Variable which is used to define the list of archived users lsit.
   * @type {any[]}
   */
  archivedUsers: User[];
  /**
   * Variable which is used to subscribe and unsubscribe the client list.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
  * Variable which is used to refers the archivedUserTable.
  */
  @ViewChild('archivedUserRef') archivedUserTableRef;
  /**
   * Variable which is used to show the filter bar.
   * @type {Boolean}
   */
  showFilter: Boolean;
  /**
  * Variable which is used to define the user's name and role list.
  * @type {any[]}
  */
  userData = {};
  /**
   * Variable which is used to sort table columns in ascending descending order.
   */
  cols = [
    { field: 'userName', header: 'userName' },
    { field: 'userRole.name', header: 'userRole.name' }
  ];
  restoreUser: any;
  /**
   *Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'ARCHIVED USERS';
  /**
  * Component constructor used to inject the required services.
  * @param userStore To get the list of users from the user store.
  * @param userService To get the user role details.
  * @param sortService To sort the archived users.
  * @param matomoService to perform metric operation on this component.
  */
  constructor(private userStore: UserStore,
    private userService: UserService,
    private sortService: SortingService,
    private authService: AuthService,
    private matomoService: MatomoService) {
  }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.messages = this.authService.errorMessages;
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    // Subscription for getting the userlist information from the database.
    this.subscriptionObject['userList'] = this.userStore.users.subscribe((users) => {
      this.archivedUsers = [];
      this.responseReceived = false;
      if (users) {
        this.responseReceived = true;
        this.userData['userNameList'] = users.filter((user) => {
          return (user && user.active === 0);
        }).map((item) => {
          item['userName'] = item.firstName + ' ' + item.lastName;
          this.archivedUsers.push(item);
          return ({ label: item['userName'], value: item['userName'] });
        });
        if (this.restoreUser) {
          this.userData['userNameList'].push({ label: this.restoreUser['userName'], value: this.restoreUser['userName'] });
        }
        if (this.archivedUsers && this.archivedUsers.length > 0) {
          this.sortService.sortReport(this.archivedUsers, 'ModifiedDate');
        }
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['userRole'] = this.userService.getRole().subscribe((response) => {
      if (response['userRole']) {
        const userRole = response['userRole'];
        if (userRole) {
          this.userData['userRoleList'] = userRole.filter((item) => {
            return (item && item.id !== 2);
          }).map((item) => {
            return ({ label: item.name, value: item.name });
          });
        }
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to decide whether to
   * show or hide the filter option.
   */
  onShowFilter() {
    this.sortService.filterDetails = [
      {
        'header': 'User Name', 'type': 'select', 'placeholder': 'Search User',
        'options': this.userData['userNameList'], 'column': 'userName'
      },
      {
        'header': 'User Role', 'type': 'select', 'placeholder': 'Search by Role',
        'options': this.userData['userRoleList'], 'column': 'userRole.name'
      },
      {
        'header': 'Archived Date', 'type': 'calendarRange', 'placeholder': 'Search Date Range',
        'column': 'modified'
      }
    ];
    this.showFilter = !this.showFilter;
  }
  /**
   * Method which is used to update the filtered table details.
   * @param event The value that holds the filtered records.
   */
  getFilteredTable(event) {
    this.archivedUserTableRef = event;
  }
  /**
   * Method which is used to restore the selected inactive user back to the active user list.
   * @param restoreUser Paramater which is used to define the selected user for restore.
   * @return {void}
   */
  onRestoreUser(restoreUser) {
    this.restoreUser = restoreUser;
    if (restoreUser && restoreUser.id !== null && restoreUser.id !== undefined) {
      this.userStore.changeUserStatus(restoreUser.id, 1);
    }
  }
  /**
    * Method Which is used search reports in global.
    * @param event {any} To get the values entered in the search box.
    */
  UserGlobalSearch(event) {
    this.archivedUserTableRef.filter(event, 'global', 'contains');
  }
  /**
  * Component OnDestroy life cycle hook
  * All the subscriptions are unsubscribed here.
  * @return {void}
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
