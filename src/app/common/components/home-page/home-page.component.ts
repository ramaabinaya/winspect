// Home-page component, which is used to display completed report list.
import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../user/model/user.model';
import { AuthService } from '../../../auth/services/auth.service';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { SortingService } from '../../../shared/services/sorting.service';
import * as _ from 'lodash';
import { mergeMap, filter } from 'rxjs/operators';
import { ReportService } from '../../../shared/services/report.service';
/**
 * Variable which is used to define the window screen.
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used to display the reports completed lists.
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomePageComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to subscribe and unsubscribe the user list.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to check whether the network is connencted or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which is used to get the list assigned Inspextions to the corresponding user.
   * @type {any[]}
   */
  assignInspectionUsers = [];
  /**
   * Variable which is used to define the current user information form the user login.
   * @type {User}
   */
  user: User;
  /**
  * variable which is used to define the userName list.
  * @type {any[]}
  */
  filterData = {
    userNameList: [], windFarmsList: [], inspectionList: []
  };
  /**
   * Variable which is used to show or hide filters.
   */
  showFilter = false;
  // /**
  // * Variable which is used to define the client's windfarm name list.
  // * @type {any[]}
  // */
  // windFarmsList = [];
  // /**
  // * Variable which is used to define the inspection list.
  // * @type {any[]}
  // */
  // inspectionList = [];
  /**
   * Variable which is used to refer the assignInspectionUsers completed reports table.
   */
  @ViewChild('assignInspectionUsersRef') assignInspectionUsersRef;
  /**
  * Variable which is used to display the screen in mobile view
  */
  mobileView: boolean;
  /**
   * Variable which is used to search the table column globally.
   */
  cols = [
    { field: 'report.id', header: 'report.id' },
    { field: 'inspectionHeader.name', header: 'inspectionHeader.name' },
    { field: 'user.name', header: 'user.name' },
    { field: 'windfarm.name', header: 'windfarm.name' }
  ];
  /**
   * Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to check whether the response is received or not
   */
  responseReceived: boolean;
  /**
   * Component constructor used to inject the required services and stores.
   * @param auth To get the current user information from the user login.
   * and from that technicians display the current technicians notifications and reports.
   * @param userStore To get userlist from the application store.
   * @param reportStore To get the reportdetails from the database.
   * @param siteService To get the windFarm details from the database.
   * @param offlineStorage To get the report details from the offline database.
   * @param inspectionStore To get the inspection details from the application database.
   * @param sortService To sort the completed reports table.
   * @param router To navigate the user to the desired component.
   * @param clientService To get the client details from the aws database.
   */
  constructor(private auth: AuthService,
    private reportService: ReportService,
    private offlineStorage: OfflineStorageService,
    private sortService: SortingService,
    private router: Router) {
  }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    // To get the current user.
    this.subscriptionObject['user'] = this.auth.user.pipe(filter((user) => {
      if (user) {
        this.user = user;
      }
      return this.user && !this.disconnected;
    }), mergeMap(() => {
      return this.reportService.getallreports({ active: 1, status: 'Completed' });
    })).subscribe((assignInspectionUsers) => {
      if (assignInspectionUsers) {
        this.filterData.userNameList = [];
        this.filterData.windFarmsList = [];
        this.filterData.inspectionList = [];
        this.assignInspectionUsers = assignInspectionUsers;
        this.sortByDate();
        this.responseReceived = true;
      }
      const filterDataCopy = {
        inspectionNames: [],
        userNames: [],
        windfarmNames: []
      };
      this.assignInspectionUsers.forEach((val) => {
        if (val) {
          if (val.inspectionHeader && val.inspectionHeader.name) {
            if (filterDataCopy.inspectionNames.indexOf(val.inspectionHeader.name) === -1) {
              filterDataCopy.inspectionNames.push(val.inspectionHeader.name);
              this.filterData.inspectionList.push({ label: val.inspectionHeader.name, value: val.inspectionHeader.name });
            }
          }
          if (val.user && val.user.firstName && val.user.lastName && this.user.role !== 'Technician') {
            val.user.name = val.user.firstName + ' ' + val.user.lastName;
            if (filterDataCopy.userNames.indexOf(val.user.name) === -1) {
              filterDataCopy.userNames.push(val.user.name);
              this.filterData.userNameList.push({ label: val.user.name, value: val.user.name });
            }
          }
          if (val.windfarm && val.windfarm.name && this.user.role !== 'Client') {
            if (filterDataCopy.windfarmNames.indexOf(val.windfarm.name) === -1) {
              filterDataCopy.windfarmNames.push(val.windfarm.name);
              this.filterData.windFarmsList.push({ label: val.windfarm.name, value: val.windfarm.name });
            }
          }
        }
        console.log('inspec', this.filterData.inspectionList, 'windfarm',
          this.filterData.windFarmsList, 'users', this.filterData.userNameList);
      });
      this.sortService.filterDetails = [{
        'header': 'Inspection Name', 'type': 'select', 'placeholder': 'Search Inspection',
        'options': this.filterData.inspectionList, 'column': 'inspectionHeader.name'
      }, {
        'header': 'Date Range', 'type': 'calendarRange', 'placeholder': 'Search DateRange',
        'column': 'report.modified'
      }];
      if (this.user && this.user.role === 'Admin') {
        this.sortService.filterDetails.push({
          'header': 'Technician Name', 'type': 'select', 'placeholder': 'Search Technician',
          'options': this.filterData.userNameList, 'column': 'user.name'
        },
          {
            'header': 'Client Name', 'type': 'select', 'placeholder': 'Search Client',
            'options': this.filterData.windFarmsList, 'column': 'windfarm.name'
          });
      } else if (this.user && this.user.role === 'Technician') {
        this.sortService.filterDetails.push({
          'header': 'Client Name', 'type': 'select', 'placeholder': 'Search Client',
          'options': this.filterData.windFarmsList, 'column': 'windfarm.name'
        });
      } else if (this.user && this.user.role === 'Client') {
        this.sortService.filterDetails.push({
          'header': 'Technician Name', 'type': 'select', 'placeholder': 'Search Technician',
          'options': this.filterData.userNameList, 'column': 'user.name'
        });
      }
    });
    this.messages = this.auth.errorMessages;
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (value && this.user && this.user.role === 'Technician') {
        this.router.navigate(['app/inspection/assignedinspection']);
      } else if (value) {
        this.router.navigate(['/app/inspection/reports']);
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // To get network status
    this.subscriptionObject['network'] = this.offlineStorage.networkDisconnected.subscribe((value: boolean) => {
      this.disconnected = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (window && window.cordova && this.disconnected) {
      // To get assignInspectionUsers list in offline mode
      this.offlineStorage.getAssignInspectionUsers(this.user.id)
        .then((assignedInspections) => {
          for (let i = 0; i < assignedInspections.rows.length; i++) {
            // To check the status of the report
            if (assignedInspections.rows.item(i).name === 'Completed') {
              // To get report details for the given assignInspectionUsers id
              this.offlineStorage.getReportsByInspectionId(assignedInspections.rows.item(i).id).then((report) => {
                for (let reportId = 0; reportId < report.rows.length; reportId++) {
                  this.responseReceived = true;
                  assignedInspections.rows.item(i).inspectionStatus = { name: assignedInspections.rows.item(i).name };
                  assignedInspections.rows.item(i).report = report.rows.item(reportId);
                  this.assignInspectionUsers.push(assignedInspections.rows.item(i));
                }
                // this.mapSiteName();
                this.sortByDate();
              }).catch((e) => { console.log('failed to get report list data', e.message); });
            }
            // this.assignInspectionUsersCopy = this.assignInspectionUsers;
          }
        })
        .catch((e) => { console.log('failed to get assignedInspections list data', e.message); });
    }
  }
  /**
  * Method which is used to sort the modifoied date in ascending order.
  */
  sortByDate() {
    if (this.assignInspectionUsers && this.assignInspectionUsers.length > 0) {
      this.assignInspectionUsers.sort(function (a, b) {
        const value = +new Date(b.modified) - +new Date(a.modified);
        return value;
      });
    }
  }
  /**
   * Method which is used to update the filtered table details.
   * @param event The value that holds the filtered records.
   */
  getFilteredTable(event) {
    this.assignInspectionUsersRef = event;
  }

  /**
   * Method which is used to navigate to the reportview of the selected report.
   * @param index {number} Parameter which is used to define the id of the selected report.
   * @returns {void}
   */
  onReportRowSelected(index: number) {
    this.router.navigate(['app/inspection', index, 'report', 0]);
  }
  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   */
  filterGlobal(event) {
    this.assignInspectionUsersRef.filter(event, 'global', 'contains');
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
