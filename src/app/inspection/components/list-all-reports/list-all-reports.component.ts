import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../shared/services/report.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { AuthService } from '../../../auth/services/auth.service';

/**
 * Component which is used to display all report list created by technicians.
 */
@Component({
  selector: 'app-list-all-reports',
  templateUrl: './list-all-reports.component.html',
  styleUrls: ['./list-all-reports.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListAllReportsComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to store the subscription and unsubscribe the store subscriptions.
   * @type {subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to define the reportlist created by all technicians.
   * @type {any}
   */
  assignInspectionUsers = [];
  /**
   * Variable which is used to check whether reports are available or not.
   * @type {boolean}
   */
  reportExist: boolean;
  /**
   * Variable which is used to refer the Users reports table.
   */
  @ViewChild('assignInspectionUsersRef') assignInspectionUsersTableRef;
  /**
   * Variable which is used to display the filter sidebar.
   * @type {Boolean}
   */
  showFilter = false;
  /**
  * Variable which is used to display the admin mobile view.
  */
  mobileView: boolean;
  /**
  * Variable which is used to store the number report is archived.
  */
  archivedReportList = [];
  /**
  * Variable which is used to store the assignInspectionUser details to refer it locally.
  */
  filteredReport = null;
  /**
  * Variable which is used to store user search value.
  */
  selectedValue: string;
  /**
  * Variable which is used to display search results exists or not.
  */
  resultNotExist: boolean;
  /**
  * Variable which is used to display the contents of the top nav bar.
  */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'headerTab': true, 'navMenu': 'Reports',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': true
  };
  /**
 * Variable which is used to display the contents of the tab header.
 */
  headerTab = {
    'tab1': 'Reports', 'tab2': 'Archived'
  };
  /**
   * Variable which is used to decide whether to  display the archived list
   * or an active list as a current page
   */
  archivedReportView: boolean;
  /**
   * Variable which is used to define type of sorting.
   */
  sortingDetails = [
    { 'label': 'Client Name', 'value': 'ClientName' },
    { 'label': 'Date', 'value': 'ReportModifiedDate' },
    { 'label': 'User Name', 'value': 'UserName' }
  ];
  /**
  * Variable which is used to sort tabel columns in ascending/descending order.
  */
  cols = [
    { field: 'report.id', header: 'report.id' },
    { field: 'inspectionHeader.name', header: 'inspectionHeader.name' },
    { field: 'user.name', header: 'user.name' },
    { field: 'windfarm.name', header: 'windfarm.name' },
    { field: 'inspectionStatus.name', header: 'inspectionStatus.name' }
  ];
  /**
   * Variable which is used to define the archive reportId.
   */
  archiveReportId: number;
  /**
   * Variable which is used to define the currently selected row index.
   */
  bottomSheetIndex: number;
  /**
   * Variable which is used to define the bottom menu action.
   */
  bottomSheetDetails = [];
  /**
   * Variable which is used to define the current row selected for the bottom sheet action implementation.
   */
  currentActionRow;
  /**
   * Variable which is used to refer the archive modal dialog box.
   */
  @ViewChild('archiveModal') archiveModal;
  /**
   * Variable which is used to refer the change status modal dialog box.
   */
  @ViewChild('status') statusModal;
  /**
   *Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'LIST REPORTS';
  /**
   * Variable which is used to define the dialog box details.
   */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: []
  };
  /**
   * Variable which is used to display a dialog box when value is true.
   */
  display: boolean;
  /**
  * Variable which is used to check whether the response is received or not
  */
  responseReceived: boolean;
  /**
   * Variable which is used to define the filter data which is loaded in the drop down.
   */
  filteredData = {
    inspectionList: [],
    userNameList: [],
    windFarmsList: [],
    status: []
  };
  /**
   * Component constructor to inject the required services
   * @param reportService To get the report details from the database.
   * @param siteService To get the windFarm details from the database.
   * @param router To navigate to desired route
   * @param offlineStorageService To create tables and get synchorization completed percentage.
   * @param matomoService to perform metric operation on this component.
   * @param sortService To sort the assigned inpection report.
   */
  constructor(private reportService: ReportService,
    private router: Router,
    private offlineStorageService: OfflineStorageService,
    private matomoService: MatomoService,
    private sortService: SortingService,
    private authService: AuthService) {
  }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Reports';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-user';
        this.navbarDetails.placeholder = 'Client Name';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    let data;
    if (this.mobileView) {
      data = { active: undefined, status: ['Completed', 'In progress'] };
    } else {
      data = { active: 1, status: ['Completed', 'In progress'] };
    }
    // this.responseReceived = false;
    // tslint:disable-next-line:max-line-length
    this.subscriptionObject['getAllReports'] = this.reportService.getallreports(data).subscribe((assignInspectionUsers) => {
      if (assignInspectionUsers) {
        this.responseReceived = true;
        console.log('assigninpsection user', assignInspectionUsers);
        this.filteredData.userNameList = [];
        this.filteredData.windFarmsList = [];
        this.filteredData.inspectionList = [];

        if (this.mobileView) {
          assignInspectionUsers.forEach((item) => {
            if (item && item.report) {
              if (item.report.active === 1) {
                console.log('report push');
                this.assignInspectionUsers.push(item);
              } else if (item.report.active === 0) {
                console.log('archive report push');
                this.archivedReportList.push(item);
              }
            }
          });
          console.log('reports', this.assignInspectionUsers);
          console.log('archive', this.archivedReportList);
        } else {
          this.assignInspectionUsers = assignInspectionUsers;
        }

      }
      const filterDataCopy = {
        inspectionNames: [],
        userNames: [],
        windfarmNames: [],
        status: []
      };
      this.assignInspectionUsers.forEach((val, index) => {
        if (val) {
          if (val.inspectionHeader && val.inspectionHeader.name && !this.mobileView) {
            if (filterDataCopy.inspectionNames.indexOf(val.inspectionHeader.name) === -1) {
              filterDataCopy.inspectionNames.push(val.inspectionHeader.name);
              this.filteredData.inspectionList.push({ label: val.inspectionHeader.name, value: val.inspectionHeader.name });
            }
          }

          if (val.user && val.user.firstName && val.user.lastName) {
            val.user.name = val.user.firstName + ' ' + val.user.lastName;
            if (filterDataCopy.userNames.indexOf(val.user.name) === -1) {
              filterDataCopy.userNames.push(val.user.name);
              this.filteredData.userNameList.push({ label: val.user.name, value: val.user.name });
            }
            // this.techsort();
          }
          if (val.windfarm && val.windfarm.name) {
            if (filterDataCopy.windfarmNames.indexOf(val.windfarm.name) === -1) {
              filterDataCopy.windfarmNames.push(val.windfarm.name);
              this.filteredData.windFarmsList.push({ label: val.windfarm.name, value: val.windfarm.name });
            }
          }
          if (val.inspectionStatus && val.inspectionStatus.name) {
            if (filterDataCopy.status.indexOf(val.inspectionStatus.name) === -1) {
              filterDataCopy.status.push(val.inspectionStatus.name);
              this.filteredData.status.push({
                label: val.inspectionStatus.name,
                value: val.inspectionStatus.name, id: val.inspectionStatusId
              });
            }
          }
        }
      });
      this.mapSiteName();
      this.sortService.filterDetails = [
        {
          'header': 'Technician Name', 'type': 'select', 'placeholder': 'Search Technician',
          'options': this.filteredData.userNameList, 'column': 'user.name'
        },
        {
          'header': 'Inspection Name', 'type': 'select', 'placeholder': 'Search Inspection',
          'options': this.filteredData.inspectionList, 'column': 'inspectionHeader.name'
        },
        {
          'header': 'Client Name', 'type': 'select', 'placeholder': 'Search Client',
          'options': this.filteredData.windFarmsList, 'column': 'windfarm.name'
        },
        {
          'header': 'Status', 'type': 'select', 'placeholder': 'Search Status',
          'options': this.filteredData.status, 'column': 'inspectionStatus.name'
        }
      ];
      if (this.mobileView && this.assignInspectionUsers && this.archivedReportList) {
        this.archivedReportList.forEach((val, index) => {
          if (val.user && val.user.firstName && val.user.lastName) {
            val.user.name = val.user.firstName + ' ' + val.user.lastName;
            if (filterDataCopy.userNames.indexOf(val.user.name) === -1) {
              filterDataCopy.userNames.push(val.user.name);
              this.filteredData.userNameList.push({ label: val.user.name, value: val.user.name });
            }
            // this.techsort();
          }
        });

        this.reportExist = true;
        this.mapSiteName();
        if (!this.archivedReportView) {
          if (!this.selectedValue) {
            this.filteredReport = this.assignInspectionUsers;
          } else {
            this.searchValue(this.selectedValue);
          }
        } else if (this.archivedReportView) {
          if (!this.selectedValue) {
            this.filteredReport = this.archivedReportList;
          } else {
            this.searchValue(this.selectedValue);
          }
        }
      }

    });
  }
  /**
  * Method which is used to map the sitename and sort the array with recent on top
  */
  mapSiteName() {
    // To sort the assignInspectionUsers with date
    if (this.assignInspectionUsers && this.assignInspectionUsers.length > 0) {
      this.assignInspectionUsers.sort(function (a, b) {
        if (a.report && b.report) {
          const value = +new Date(b.report.modified) - +new Date(a.report.modified);
          return value;
        } else if (a.report) {
          return -1;
        } else if (b.report) {
          return 1;
        }
      });
    }
    if (this.archivedReportList && this.archivedReportList.length > 0) {
      this.archivedReportList.sort(function (a, b) {
        if (a.report && b.report) {
          const value = +new Date(b.report.modified) - +new Date(a.report.modified);
          return value;
        } else if (a.report) {
          return -1;
        } else if (b.report) {
          return 1;
        }
      });
    }
  }
  /**
   * Method which is used to update the filtered table details.
   * @param event The value that holds the filtered records.
   */
  getFilteredTable(event) {
    this.assignInspectionUsersTableRef = event;
  }
  /**
   * Method which is used to navigate to the individual reportview of the selected report.
   * @param index {number} To define the index of the selected report.
   * @return {void}
   */
  onRowSelected(index: number) {
    this.router.navigate(['app/inspection', index, 'report', 0]);
  }
  /**
   * Method which is used to edit the status of the particular report from 'Completed to InProgress' by clicking the edit icon.
   * @param reportId {number} Define the id of the selected report.
   * @param event {Event} event that triggered when clicking the edit icon.
   * @return {void}
   */
  onChangeStatus(reportId?: number, event?: Event) {
    let id;
    if (this.mobileView && this.currentActionRow) {
      id = this.currentActionRow.report ? this.currentActionRow.report.id : null;
    } else {
      id = reportId;
      event.stopPropagation();
    }
    let status;
    // tslint:disable-next-line:max-line-length
    if (this.assignInspectionUsers) {
      this.assignInspectionUsers.forEach((value) => {
        if (value && value.report && value.report.id === id) {
          const inspectionStatus = value.inspectionStatus.name;
          if (this.filteredData.status) {
            this.filteredData.status.filter((item) => {
              if (item && item.value === 'In progress' && inspectionStatus === 'Completed') {
                status = item;
              } else if (item && item.value === 'Completed' && inspectionStatus === 'In progress') {
                status = item;
              }
            });
          }
        }
      });
      // Changed report status, updated in the database.
      if (status) {
        this.reportService.changeAssignedInspectionStatus(id, status.id).subscribe((res) => {
          if (res) {
            this.assignInspectionUsers.find((item) => {
              if (item && item.report && item.report.id === id) {
                item.inspectionStatus.name = res.inspectionStatus.name;
                return true;
              }
            });
            if (this.mobileView) {
              this.filteredReport.find((item) => {
                if (item && item.report && item.report.id === id) {
                  item.inspectionStatus.name = res.inspectionStatus.name;
                  return true;
                }
              });
            }
          }
        });
      }
    }
  }
  /**
   * Method which is used to sort the Technician name in alphabetical order.
   */
  techsort() {
    this.filteredData.userNameList.sort(function (a, b) {
      const value = a.label.localeCompare(b.label);
      return value;
    });
  }
  /**
  * Method which is used to export the particular report.
  * @param id To define the index of the selected report.
  */
  export(id: number) {
    this.router.navigate(['app/inspection/', id, 'report', 0]);
  }
  /**
   * Method which is used to archive the particular report.
   */
  onArchive() {
    const archiveDetails = {
      reportId: this.archiveReportId,
      active: 0
    };
    this.reportService.changeReportStatus(archiveDetails).subscribe((res) => {
      if (res) {
        this.assignInspectionUsers.find((item, index) => {
          if (item && item.report && item.report.id === archiveDetails.reportId) {
            item.report.active = archiveDetails.active;
            this.assignInspectionUsers.splice(index, 1);
            this.archivedReportList.push(item);
            return true;
          }
        });
        if (this.archivedReportView && this.mobileView) {
          this.filteredReport = this.archivedReportList;
        } else {
          this.filteredReport = this.assignInspectionUsers;
        }
      }
    });
  }
  /**
  * Method which is used to display a model for archive the report.
  * @param archiveModal local reference variable.
  * @param reportId To define the index of the selected report for Archive.
  * @param event {Event} event that triggered when clicking the archive icon.
  */
  openArchiveModal(reportId, event) {
    this.dialogBoxDetails.action = [];
    this.archiveReportId = reportId;
    if (this.mobileView === false) {
      event.stopPropagation();
    }
    this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
    this.dialogBoxDetails.content = this.messages.ARCHIVE_REPORT;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onArchive' }, { label: 'No' });
    this.display = true;
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
      if (!this.archivedReportView) {
        this.filteredReport = this.assignInspectionUsers;
      } else if (this.archivedReportView) {
        this.filteredReport = this.archivedReportList;
      }
    } else {
      const assignInspection = this.archivedReportView ? this.archivedReportList : this.assignInspectionUsers;
      this.filteredReport = assignInspection.filter((user) => {
        const site = user.windfarm.name;
        return (site && site.toLowerCase().indexOf(this.selectedValue.toLowerCase()) !== -1);
      });
      if (this.filteredReport.length === 0) {
        this.resultNotExist = true;
      }
    }
  }
  /**
  * Method which is used to clear the search input.
  */
  onClear() {
    this.selectedValue = undefined;
    this.resultNotExist = false;
    this.filteredReport = this.archivedReportView ? this.archivedReportList : this.assignInspectionUsers;
  }
  /**
   * Method which is used to sort the completed reports table.
   * @param key Variable which is used to select the sortService column of the table.
   */
  sortReport(key) {
    this.sortService.sortReport(this.filteredReport, key);
  }
  /**
   * Method which is used to edit the particular report.
   * @param InspectionHeaderId {number} Paramter which define the inspection header id of the selected report.
   * @param reportId {number} Define the id of the selected report.
   * @param event {Event} event that triggered when clicking the edit icon.
   * @return {void}
   */
  onEditReport(InspectionHeaderId: number, reportId: number, event: any) {
    if (this.mobileView === false) {
      event.stopPropagation();
    }
    this.router.navigate(['app/inspection', InspectionHeaderId, reportId, 'editinspection']);
  }
  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   */
  filterGlobal(event) {
    this.assignInspectionUsersTableRef.filter(event, 'global', 'contains');
  }
  /**
     * Method which is used to display a model for open a bottom sheet
     * @param bottom local reference variable.
     */
  openBottomSheet(id, reports) {
    if (!this.archivedReportView) {
      this.bottomSheetIndex = id;
      if (reports.report.active === 1 && reports.inspectionStatusId === 2) {
        this.bottomSheetDetails = [
          'Archive', 'Change Status', 'Edit', 'Preview'];
      } else {
        this.bottomSheetDetails = [
          'Archive', 'Change Status', 'Preview'];
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
   * @param reports Which is define the currently selected row.
   */
  bottomSheetMenuAction(event, reports) {
    this.currentActionRow = reports;
    if (event === 'Archive') {
      this.openArchiveModal(reports.report.id, event);
    } else if (event === 'Change Status') {
      this.dialogBoxDetails.action = [];
      this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
      this.dialogBoxDetails.content = this.messages.CHANGE_STATUS;
      this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onChangeStatus' }, { label: 'No' });
      this.display = true;
    } else if (event === 'Edit') {
      this.onEditReport(reports.inspectionHeaderId, reports.report.id, event);
    } else if (event === 'Preview') {
      this.export(this.currentActionRow.report.id);
    }
  }
  /**
  * Method which is used to close the dialog box.
  * @param event local reference variable.
  */
  dialogBoxClose(event) {
    this.display = event;
  }
  /**
   * Method which is used to define which action is triggered.
   * @param event event {any} To define the event value.
   */
  dialogBoxAction(event) {
    this[event]();
  }
  /**
   * Component OnDestroy life cycle hook
   * And unsubscribe all the subscription in the component.
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
  /**
   * Method which is used to navigate to the desired routes.
   * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
   */
  onNavigate(key: string) {
    if (key === 'R') {
      this.router.navigate(['/app/inspection/archived_report']);
    } else if (key === 'L') {
      this.router.navigate(['/app/inspection/notification']);
    }
  }
  /**
   * Method which is used to navigate the user based on the header tab clicked in
   * the top-navbar.
   * @param event the event that triggered from the top navbar while clicking the tabs.
   */
  tabAction(event) {
    this.selectedValue = undefined;
    this.filteredReport = [];
    this.archivedReportView = event;
    this.resultNotExist = false;
    if (event === true) {
      this.filteredReport = this.archivedReportList;
    } else if (event === false) {
      this.filteredReport = this.assignInspectionUsers;
    }
  }
  /**
 * Method which is used to display the confirmation model dialog for restore the selected report.
 * @param undo lacal reference variable.
 */
  openConfirmationDialog(reportId: number) {
    this.currentActionRow = reportId;
    this.dialogBoxDetails.action = [];
    this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
    this.dialogBoxDetails.content = this.messages.RESTORE_REPORT;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onRestoreClicked' }, { label: 'No' });
    this.display = true;
  }
  /**
 * Method which is used to restore the selected report back to the reportlist.
 * @param reportId  {number} Parameter which defines the selected reportId for restore.
 * @param event {Event} Parameter which defines the event that triggers when the restore icon is being clicked.
 * @return {void}
 */
  onRestoreClicked(reportId?: number, event?: Event) {
    if (this.mobileView === false) {
      event.stopPropagation();
    } else {
      reportId = this.currentActionRow;
    }
    const archiveDetails = {
      reportId: reportId,
      active: 1
    };
    this.reportService.changeReportStatus(archiveDetails).subscribe((res) => {
      if (res) {
        this.archivedReportList.find((item, index) => {
          if (item && item.report && item.report.id === archiveDetails.reportId) {
            item.report.active = archiveDetails.active;
            this.archivedReportList.splice(index, 1);
            this.assignInspectionUsers.push(item);
            return true;
          }
        });
        if (this.archivedReportView) {
          this.filteredReport = this.archivedReportList;
        } else {
          this.filteredReport = this.assignInspectionUsers;
        }
      }
    });
  }
}
