// TechViewReports Component is used to display the list of reports that created by the technician.
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { SiteService } from '../../../common/services/site.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { SortingService } from '../../../shared/services/sorting.service';
import { filter, mergeMap } from 'rxjs/operators';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { ReportService } from '../../../shared/services/report.service';
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
 * Component which is used to display the logged in technician reports list
 */
@Component({
  selector: 'app-tech-view-reports',
  templateUrl: './tech-view-reports.component.html',
  styleUrls: ['./tech-view-reports.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TechViewReportsComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to store the subscription and unsubscribe the store subscriptions.
   * @type {subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to decide whether the network available or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which is used to check there are reports available for display.
   * @type {boolean}
   */
  reportExist: boolean;
  /**
   * Variable which is used to get the currently available assignInspectionUser details.
   * @type {any[]}
   */
  assignInspectionUsers = [];
  /**
   * Variable which is used to decide whether to display the form view component or not.
   * @type {boolean}
   */
  mobileView = false;
  /**
   * Variable which is used to store the assignInspectionUser details to refer it locally.
   */
  filteredReport = [];
  /**
   * Variable which is used to refers the reportTable in the template.
   */
  @ViewChild('reportTableRef') reportTableRef;
  /**
   * Variable which is used to list status list for dropdown.
   */
  status = [
    { name: 'In progress', value: 'In progress' },
    { name: 'Completed', value: 'Completed' }
  ];
  /**
   * Variable which is used to display search results exists or not.
   */
  resultNotExist: boolean;
  /**
   * Variable which is used to define the word to be entered to search.
   */
  selectedValue: string;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'headerTab': true, 'navMenu': 'Reports',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': true
  };
  headerTab = {
    'tab1': 'Reports', 'tab2': 'Archived'
  };
  /**
   * Variable which is used to define type of sorting.
   */
  sortingDetails = [
    { 'label': 'Client Name', 'value': 'ClientName' },
    { 'label': 'Date', 'value': 'ReportModifiedDate' },
    { 'label': 'Report Name', 'value': 'ReportName' }
  ];
  /**
   * Variable which is used to sort table columns in ascending descending order.
   */
  cols = [
    { field: 'report.id', header: 'report.id' },
    { field: 'report.windturbineId', header: 'report.windturbineId' },
    { field: 'report.name', header: 'report.name' },
    { field: 'inspectionStatus.name', header: 'inspectionStatus.name' }
  ];
  /**
   * Variable which is used to refer the archive modal dialog box.
   */
  @ViewChild('onArchive') archiveModal;
  /**
   * Variable which is used to define the currently selected row index.
   */
  bottomSheetIndex: number;
  /**
   * Variable which is used to define the bottom menu action.
   */
  bottomSheetDetails = [];
  /**
   * Variable which is used to hold the current report id.
   */
  currentReportId: number;
  /**
   * Variable which is used to define the currently displayed report is archived or not.
   */
  archivedReportView: boolean;
  /**
   * Variable which is used to store the archived report list.
   */
  archivedReportList = [];
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
    action: []
  };
  /**
   *  Variable which is used to display a dialog box when value is true.
   */
  display: boolean;
  /**
   * Component constructor to inject the required services.
   * @param router To navigate the user to the desired routes.
   * @param reportStore To get the report details from the store.
   * @param offlineStorage To get the report details from the local database in offline.
   * @param siteService To get the sitelocation details from the database.
   * @param authService To get the current logged in user information
   * @param sortService To sortService the technician report.
   * @param inspectionStore To get the inspectionHeader details from the database.
   */
  constructor(private router: Router,
    private reportStore: ReportStore,
    private offlineStorage: OfflineStorageService,
    private reportService: ReportService,
    private authService: AuthService,
    private sortService: SortingService,
    private inspectionStore: InspectionStore,
  ) { }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Reports';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-user';
        this.navbarDetails.rightheader = 'Sync';
        this.navbarDetails.placeholder = 'Client Name';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      if (this.messages) {
        this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    let user;
    this.subscriptionObject['user'] = this.authService.user.pipe(filter((userCopy) => {
      console.log('userCopy', userCopy);
      if (userCopy) {
        user = userCopy;
      }
      return !this.disconnected && user;
    }), mergeMap(() => {
      let data;
      if (!this.mobileView) {
        data = { active: 1, status: ['In progress', 'Completed'] };
      } else {
        data = { active: undefined, status: ['In progress', 'Completed'] };
      }
      this.reportExist = false;

      return this.reportService.getallreports(data);

    })).subscribe((assignedInspections) => {
      console.log('assignedInspections', assignedInspections);
      this.reportExist = true;
      if (this.mobileView) {
        assignedInspections.forEach((assignedInspection) => {
          if (assignedInspection && assignedInspection.report) {
            if (assignedInspection.report.active === 1) {
              this.assignInspectionUsers.push(assignedInspection);
              assignedInspection.report.reportNumber = +assignedInspection.report.name.substring(7);
            } else if (assignedInspection.report.active === 0) {
              this.archivedReportList.push(assignedInspection);
            }
          }
        });
      } else {
        this.assignInspectionUsers = assignedInspections;
        if (this.assignInspectionUsers && this.assignInspectionUsers.length > 0) {
          this.assignInspectionUsers.sort(function (a, b) {
            const value = +new Date(b.modified) - +new Date(a.modified);
            return value;
          });
        }
      }
      if (this.archivedReportView && this.mobileView) {
        if (!this.selectedValue) {
          this.filteredReport = this.archivedReportList;
        } else {
          this.searchValue(this.selectedValue);
        }
      }
      if (!this.archivedReportView && this.mobileView) {
        if (!this.selectedValue) {
          this.filteredReport = this.assignInspectionUsers;
        } else {
          this.searchValue(this.selectedValue);
        }
      }
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
      if (this.disconnected) {
        this.navbarDetails.headerTab = false;
        const userId = user ? user.id : null;
        this.offlineStorage.getAssignInspectionUsers(userId)
          .then((assignedInspections) => {
            this.assignInspectionUsers = [];
            for (let i = 0; i < assignedInspections.rows.length; i++) {
              if (assignedInspections.rows.item(i).name !== 'Assigned') {
                this.offlineStorage.getReportsByInspectionId(assignedInspections.rows.item(i).id).then((report) => {
                  for (let reportId = 0; reportId < report.rows.length; reportId++) {
                    if (report.rows.item(reportId).active === 1) {
                      this.reportExist = true;
                      assignedInspections.rows.item(i).inspectionStatus = { name: assignedInspections.rows.item(i).name };
                      assignedInspections.rows.item(i).report = report.rows.item(reportId);
                      this.assignInspectionUsers.push(assignedInspections.rows.item(i));
                    }
                  }
                  // To sort the reportlist in the most recent modified order.
                  if (assignedInspections.rows.length - 1 === i) {
                    this.sortService.sortReport(assignedInspections, 'ReportModifiedDate');
                  }
                }).catch((e) => { console.log('failed to get report list data', e.message); });
              } else if (assignedInspections.rows.length - 1 === i) {
                this.sortService.sortReport(assignedInspections, 'ReportModifiedDate');
              }
            }
            this.filteredReport = this.assignInspectionUsers;
          })
          .catch((e) => { console.log('failed to get assignedInspections list data', e.message); });
      }
    }
    this.sortService.filterDetails = [
      {
        'header': 'Report Id', 'type': 'number', 'placeholder': 'Enter Report Id',
        'column': 'report.id'
      },
      {
        'header': 'Inspection Status', 'options': this.status, 'label': 'name',
        'type': 'select', 'placeholder': 'Search Status', 'column': 'inspectionStatus.name'
      },
      {
        'header': 'Date Submitted', 'type': 'calendarRange', 'placeholder': 'Search DateRange',
        'column': 'report.modified'
      },
    ];
  }
  /**
   * Method which is used to update the filtered table details.
   * @param event The value that holds the filtered records.
   */
  getFilteredTable(event) {
    this.reportTableRef = event;
  }
  /**
   * Method which is used to navigate to the desired routes.
   */
  onNavigate() {
    this.router.navigate(['/app/inspection/notification']);
  }
  /**
   * Method which is used to navigate to the report view of the selected report.
   * @param {number} index {number} To define the selected report index
   * @return {void}
   */
  selectedReport(index: number) {
    this.router.navigate(['app/inspection', index, 'report', 0]);
  }
  /**
   * Method which is used to select a report
   * @param index local reference of the report id.
   */
  onSelected(index: number) {
    if (this.assignInspectionUsers && this.assignInspectionUsers[index] && this.assignInspectionUsers[index].report) {
      const inspectionHeaderId = this.assignInspectionUsers[index].inspectionHeaderId;
      const statusId = this.assignInspectionUsers[index].inspectionStatusId;
      const reportId = this.assignInspectionUsers[index].report.id;
      if (this.disconnected) {
        this.offlineStorage.changeAssignedInspectionStatus(reportId, statusId, 'U');
      }
      this.router.navigate(['app/inspection/', inspectionHeaderId, reportId, 'editinspection']);
    }
  }
  /**
  * Method which is used to export the particular report.
  * @param id To define the index of the selected report.
  */
  export(id: number) {
    this.router.navigate(['app/inspection/', id, 'report', 0]);
  }
  /**
   * Method which is used to sort the completed reports table.
   * @param key Variable which is used to select the sortService column of the table.
   */
  sortReport(key) {
    let reports;
    if (this.mobileView) {
      reports = this.filteredReport;
    } else if (!this.mobileView) {
      reports = this.assignInspectionUsers;
    }
    this.sortService.sortReport(reports, key);
    reports = [];
  }
  /**
   * Method which is used to clear the search input.
   */
  onClear() {
    this.selectedValue = undefined;
    this.resultNotExist = false;
    if (this.archivedReportView) {
      this.filteredReport = this.archivedReportList;
    }
    if (!this.archivedReportView) {
      this.filteredReport = this.assignInspectionUsers;
    }
  }
  /**
   * Method which is used to change the status of the report to inactive.
   */
  onArchives() {
    event.stopPropagation();
    const data = { reportId: this.currentReportId, active: 0 };
    this.reportService.changeReportStatus(data).subscribe((val) => {
      if (val) {
        this.assignInspectionUsers.find((inspection, index) => {
          if (inspection && inspection.report && inspection.report.id === this.currentReportId) {
            this.assignInspectionUsers.splice(index, 1);
            this.archivedReportList.push(inspection);
            return true;
          }
        });
      }
    }, (err) => {
      console.log('Error Occurred while Archieve', err);
    });
  }
  /**
   * Method which is used to select the wind farm name.
   * @param event {any} To get the values entered in the search box.
   */
  searchValue(event) {
    this.selectedValue = event;
    this.filteredReport = [];
    this.resultNotExist = false;
    if (this.selectedValue === undefined) {
      this.filteredReport = this.assignInspectionUsers;
      if (this.archivedReportView) {
        this.filteredReport = this.archivedReportList;
      }
      if (!this.archivedReportView) {
        this.filteredReport = this.assignInspectionUsers;
      }
    } else {
      if (this.archivedReportView && this.archivedReportList.length > 0) {
        this.filteredReport = this.archivedReportList.filter((user) => {
          return (user.windfarm.name && user.windfarm.name.toLowerCase().indexOf(this.selectedValue.toLowerCase()) !== -1);
        });
      } else {
        if (this.assignInspectionUsers && this.assignInspectionUsers.length > 0) {
          this.filteredReport = this.assignInspectionUsers.filter((user) => {
            return (user.windfarm.name && user.windfarm.name.toLowerCase().indexOf(this.selectedValue.toLowerCase()) !== -1);
          });
        }
      }
    }
    if (this.filteredReport.length === 0) {
      this.resultNotExist = true;
    }
  }
  /**
   * Method which is used to create database tables in device when sync button pressed.
   */
  createsqlitedb() {
    if (window && window.cordova) {
      console.log('Cordova Is Available!');
      this.offlineStorage.createTables();
    } else {
      console.log('Cordova Not Available!');
    }
  }
  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   */
  filterGlobal(event) {
    if (this.reportTableRef && this.reportTableRef.filter) {
      this.reportTableRef.filter(event, 'global', 'contains');
    }
  }
  /**
   * Method which is used to display a model for open a bottom sheet
   * @param id to refer the index value.
   * @param report Which is define the currently selected row.
   */
  openBottomSheet(id, report) {
    this.bottomSheetIndex = id;
    if (this.disconnected) {
      if (report.inspectionStatus.name === 'In progress') {
        this.bottomSheetDetails = ['Edit', 'Preview'];
      } else {
        this.bottomSheetDetails = ['Preview'];
      }
    } else if (!this.disconnected) {
      if (report.inspectionStatus.name === 'In progress') {
        this.bottomSheetDetails = ['Archive', 'Edit', 'Preview'];
      } else {
        this.bottomSheetDetails = ['Archive', 'Preview'];
      }
    }
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
   * @param id to refer the index value.
   * @param reports Which is define the currently selected row.
   */
  bottomSheetMenuAction(event, id, reports) {
    if (reports && reports.report && reports.report.id) {
      this.currentReportId = reports.report.id;
    }
    if (event === 'Archive') {
      this.dialogBoxDetails.action = [];
      this.dialogBoxDetails.content = this.messages.ARCHIVE_REPORT;
      this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onArchives' }, { label: 'No' });
      this.display = true;
    } else if (event === 'Edit') {
      this.onSelected(id);
    } else if (event === 'Preview') {
      this.export(this.currentReportId);
    }
  }

  /**
  * Method which is used to define which action is triggered.
  * @param event event {any} To define the event value.
  */
  dialogBoxAction(event) {
    this[event]();
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.display = event;
  }
  /**
   * Method which is used to navigate the user to the
   * selected page based on the tab click in the top navbar.
   * @param event the event that triggered from the top navbar while clicking the tabs.
   */
  tabAction(event) {
    this.selectedValue = undefined;
    this.filteredReport = [];
    this.resultNotExist = false;
    this.archivedReportView = event;
    if (event === true) {
      this.filteredReport = this.archivedReportList;
    } else if (event === false) {
      this.filteredReport = this.assignInspectionUsers;
    }
  }
  /**
   * Method which is used to display the confirmation model dialog for restore the selected report.
   * @param reportId To define the index of the selected report.
   */
  openConfirmationDialog(reportId: number) {
    this.currentReportId = reportId;
    this.dialogBoxDetails.action = [];
    this.dialogBoxDetails.content = this.messages.RESTORE_REPORT;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onRestoreClicked' }, { label: 'No' });
    this.display = true;
  }
  /**
   * Method which is used to restore the selected report back to the reportlist.
   * @return {void}
   */
  onRestoreClicked() {
    event.stopPropagation();
    this.reportStore.changeReportStatus(this.currentReportId, 1);
  }
  /**
   * Component OnDestroy life cycle hook.
   * And unsubscribe all the subscriptions done in the component.
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
