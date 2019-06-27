// ArchivedReport component is for displaying the list of archived reports.
import { Component, OnInit, OnDestroy, DoCheck, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortingService } from '../../../shared/services/sorting.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ReportService } from '../../../shared/services/report.service';
/**
* Component which is used to display the list of archived users and archived reports.
*/
@Component({
  selector: 'app-archived-report',
  templateUrl: './archived-report.component.html',
  styleUrls: ['./archived-report.component.css']
})
export class ArchivedReportComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to subscribe and unsubscribe the assignInspectionUser details.
   * @type {subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to define the current user role.
   */
  userRole: string;
  /**
   * Variable which is used to define whether there is a response received from the server or not.
   * @type {boolean}
   */
  responseReceived: boolean;
  /**
   * Variable which is used to define the list of archived report list for admin.
   * @type {AssignInspectionUsers}
   */
  // archivedReports: AssignInspectionUsers[] = [];
  archivedReports = [];

  /**
   * Variable which is used to decide whether to display the form view component or not
   * @type {boolean}
   */
  mobileView = false;
  /**
   * Variable which is used to refers the assignInspectionTable.
   */
  @ViewChild('assignInspectionRef') assignInspectionTableRef;
  /**
   * Variable which is used to show the filter bar.
   * @type {boolean}
   */
  showFilter: boolean;
  /**
  * Variable which is used to store the report related details like usernamelist, windfarmslist, inspectionlist details.
  */
  reportData = {};
  /**
  * Variable which is used to display the message like error, success etc.,
  */
  messages;
  /**
   * Variable which is used to set the title of the page in metric tool.
  */
  pageTitle = 'ARCHIVED REPORTS';
  /**
   * Variable which is used to sort table columns in ascending descending order.
   */
  cols = [
    { field: 'report.id', header: 'report.id' },
    { field: 'inspectionHeader.name', header: 'inspectionHeader.name' },
    { field: 'user.name', header: 'user.name' },
    { field: 'windfarm.name', header: 'windfarm.name' }
  ];
  /**
   * Variable which is used to define the filter data which is loaded in the dropdown.
   */
  filterData = {
    userNameList: [],
    windFarmsList: [],
    inspectionList: []
  };
  /**
  * Component constructor used to inject the required services.
  * @param router To navigate the user to the provided routes.
  * @param modalService To made the dialog box display.
  * @param siteService To get the windFarm details.
  * @param offlinestorage To check whether the application is in the mobile or browser.
  * @param matomoService to perform metric operation on this component.
  * @param authService  To get the current user details.
  * @param sortService To sort the archived reports and users.
  */
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private offlinestorage: OfflineStorageService,
    private matomoService: MatomoService,
    private authService: AuthService,
    private sortService: SortingService,
    private reportService: ReportService) {
  }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.messages = this.authService.errorMessages;
    this.userRole = this.authService.userRole;
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    this.subscriptionObject['appMode'] = this.offlinestorage.applicationMode.subscribe((value: boolean) => {
      this.mobileView = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // tslint:disable-next-line:max-line-length
    this.subscriptionObject['archivedReport'] = this.reportService.getallreports({ active: 0 }).subscribe((assignInspectionUsers) => {
      if (assignInspectionUsers) {
        this.filterData.userNameList = [];
        this.filterData.windFarmsList = [];
        this.filterData.inspectionList = [];
        this.archivedReports = assignInspectionUsers;
        this.sortService.sortReport(this.archivedReports, 'ReportModifiedDate');
        this.responseReceived = true;
      }
      const filterDataCopy = {
        inspectionNames: [],
        userNames: [],
        windfarmNames: []
      };
      this.archivedReports.forEach((val) => {
        if (val) {
          if (val.inspectionHeader && val.inspectionHeader.name) {
            if (filterDataCopy.inspectionNames.indexOf(val.inspectionHeader.name) === -1) {
              filterDataCopy.inspectionNames.push(val.inspectionHeader.name);
              this.filterData.inspectionList.push({ label: val.inspectionHeader.name, value: val.inspectionHeader.name });
            }
          }
          if (val.user && val.user.firstName && val.user.lastName) {
            val.user.name = val.user.firstName + ' ' + val.user.lastName;
            if (filterDataCopy.userNames.indexOf(val.user.name) === -1) {
              filterDataCopy.userNames.push(val.user.name);
              this.filterData.userNameList.push({ label: val.user.name, value: val.user.name });
            }
          }
          if (val.windfarm && val.windfarm.name) {
            if (filterDataCopy.windfarmNames.indexOf(val.windfarm.name) === -1) {
              filterDataCopy.windfarmNames.push(val.windfarm.name);
              this.filterData.windFarmsList.push({ label: val.windfarm.name, value: val.windfarm.name });
            }
          }
        }
      });
    });
  }
  /**
   * Method which is used for filters.
   */
  onFilterShow() {
    this.sortService.filterDetails = [
      {
        'header': 'Technician Name', 'type': 'select', 'placeholder': 'Search Technician',
        'options': this.filterData.userNameList, 'column': 'user.name'
      },
      {
        'header': 'Inspection Name', 'type': 'select', 'placeholder': 'Search Inspection',
        'options': this.filterData.inspectionList, 'column': 'inspectionHeader.name'
      },
      {
        'header': 'Client Name', 'type': 'select', 'placeholder': 'Search Client',
        'options': this.filterData.windFarmsList, 'column': 'windfarm.name'
      },
      {
        'header': 'Archived Date Range', 'type': 'calendarRange', 'placeholder': 'Search Date Range',
        'column': 'report.modified'
      }
    ];
    this.showFilter = !this.showFilter;
  }
  /**
   * Method which is used to update the filtered table details.
   * @param event The value that holds the filtered records.
   */
  getFilteredTable(event) {
    this.assignInspectionTableRef = event;
  }
  /**
   * Method which is used to navigate user to the reports page.
   */
  navigateBack() {
    if (this.userRole === 'Technician') {
      this.router.navigate(['/app/inspection/technicianreports']);
    } else if (this.userRole !== 'Technician') {
      this.router.navigate(['/app/inspection/reports']);
    }
  }
  /**
  * Method which is used to display the confirmation model dialog for restore the selected report.
  * @param undo lacal reference variable.
  */
  openConfirmationDialog(undo) {
    this.modalService.open(undo, { centered: true });
  }
  /**
   * Method which is used to delete the reports from the archived list.
   * @param assignInspecUserId {number} Parameter which is used to define the id of the assignInspection that selected.
   * @param event {Event} Parameter which defines the event that triggers when clicking the delete icon.
   * @return {void}
   */
  onDeleteClicked(assignInspecUserId: number, event: Event) {
    event.stopPropagation();
    this.reportService.deleteReport(assignInspecUserId).subscribe((res) => {
      this.archivedReports.find((item, index) => {
        if (item && item.id === assignInspecUserId) {
          this.archivedReports.splice(index, 1);
          return true;
        }
      });
    });
  }
  /**
   * Method which is used to restore the selected report back to the reportlist.
   * @param index  {number} Parameter which defines the selected reportId for restore.
   * @param event {Event} Parameter which defines the event that triggers when the restore icon is being clicked.
   * @return {void}
   */
  onRestoreClicked(reportId: number, event: Event) {
    const archiveDetails = {
      reportId: reportId,
      active: 1
    };
    event.stopPropagation();
    // this.reportStore.changeReportStatus(index, 1);
    this.reportService.changeReportStatus(archiveDetails).subscribe((res) => {
      if (res) {
        console.log('archived', res);
        this.archivedReports.find((item, index) => {
          if (item && item.report && item.report.id === archiveDetails.reportId) {
            item.report.active = archiveDetails.active;
            this.archivedReports.splice(index, 1);
            return true;
          }
        });
      }
    });

  }
  /**
   * Method which is used to navigate the user from the archived reports list to the individual report
   * display. And here we have route params for informing that this call is from the archived list component.
   * @param index {number} Parameter which defines the id of the selected report.
   * @return {void}
   */
  onNavigate(index: number) {
    this.router.navigate(['/app/inspection', index, 'report', 1]);
  }
  /**
   *  Method which is used to sort the completed reports table.
   * @param key Variable which is used to select the sortService column of the table.
   */
  sortReport(key) {
    this.sortService.sortReport(this.archivedReports, key);
  }
  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   */
  onReportGlobalSearch(event) {
    this.assignInspectionTableRef.filter(event, 'global', 'contains');
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
