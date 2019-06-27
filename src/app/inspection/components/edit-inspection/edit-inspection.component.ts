// EditInspectionComponent which is used to edit the already created 'In Progress' state Inspections.
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { ViewChild } from '@angular/core';
import { SortingService } from '../../../shared/services/sorting.service';
import { AssignInspectionUsers } from '../../model/assignInspectionUsers.model';
/**
 * window variable to access the window related methods.
 */
declare let window: any;
/**
 * Component which is used to display the list of in progress reports.
 */
@Component({
  selector: 'app-edit-inspection',
  templateUrl: './edit-inspection.component.html',
  styleUrls: ['./edit-inspection.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditInspectionComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to decide whether to show the filters or not.
   * @type {boolean}
   */
  showFilter: boolean;
  /**
 * Variable which is used to store the subscription and unsubscribe the store     *subscriptions.
 * @type {subscription}
 */
  subscriptionObject = {};
  /**
   * Variable which is used to decide whether network available or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which is used to define the inspection reports of the technician.
   */
  inspectionReports: AssignInspectionUsers[] = null;
  /**
  * Variable which is used to refers the reportTable in the template.
  */
  @ViewChild('reportTableRef') reportTableRef;
  /**
   * Variable which is used to sort table columns in ascending descending order.
   */
  cols = [
    { field: 'report.id', header: 'report.id' },
    { field: 'report.windturbineId', header: 'report.windturbineId' },
    { field: 'report.name', header: 'report.name' }
  ];
  /**
   *Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Component constructor used to inject the required services and stores.
   * @param router To navigate the user to the desired components.
   * @param offlineStorage To made edit-inspection functionality in offline mode.
   * @param authService To get the current user information.
   * @param sortService To sortService the archived reports and users.
   * @param reportStore To get the 'In Progress' reportlist for editing.
   */
  constructor(private router: Router,
    private offlineStorage: OfflineStorageService,
    private authService: AuthService,
    private sortService: SortingService,
    private reportStore: ReportStore) {
  }
  /**
   * Component OnInit life cycle hook.
   * All the needed informations are subscribed here.
   */
  ngOnInit() {
    this.messages = this.authService.errorMessages;
    // reportSubscription is for getting all the 'in progress' Status reportslist.
    if (!this.disconnected) {
      this.subscriptionObject['assignInspectionUsers'] = this.reportStore.assignInspectionUsers.subscribe((assignInspectionUsers) => {
        if (assignInspectionUsers) {
          const inspectionReportsCopy = assignInspectionUsers.filter((item) => {
            // tslint:disable-next-line:max-line-length
            return (item && item.inspectionStatus && item.inspectionStatus.name === 'In progress' && item.report && item.report.active === 1);
          });
          this.inspectionReports = inspectionReportsCopy;
        }
        if (this.inspectionReports && this.inspectionReports.length > 0) {
          // Sorting for displaying the reportlist as the recent one on the top based on the date.
          this.sortService.sortReport(this.inspectionReports, 'ReportModifiedDate');

        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
    // check for the cordova availability.
    if (window && window.cordova) {
      // current user information got.
      let currentUser;
      this.subscriptionObject['user'] = this.authService.user.subscribe((user) => {
        currentUser = user;
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
      this.subscriptionObject['network'] = this.offlineStorage.networkDisconnected.subscribe((value: boolean) => {
        this.disconnected = value;
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
      // If the network unavailable then the edit inspection report list got in offline.
      if (this.disconnected) {
        this.offlineStorage.getAssignInspectionUsers(currentUser.id)
          .then((assignedInspections) => {
            this.inspectionReports = [];
            for (let i = 0; i < assignedInspections.rows.length; i++) {
              if (assignedInspections && assignedInspections.rows.item(i).name === 'In progress') {
                this.offlineStorage.getReportsByInspectionId(assignedInspections.rows.item(i).id).then((report) => {
                  for (let reportId = 0; reportId < report.rows.length; reportId++) {
                    assignedInspections.rows.item(i).inspectionStatus = { name: assignedInspections.rows.item(i).name };
                    assignedInspections.rows.item(i).report = report.rows.item(reportId);
                    this.inspectionReports.push(assignedInspections.rows.item(i));
                  }
                  if (assignedInspections && assignedInspections.rows.length - 1 === i) {
                    this.sortService.sortReport(this.inspectionReports, 'ReportModifiedDate');
                  }
                }).catch((e) => { console.log('failed to get report list data', e.message); });
              }
            }
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
        'header': 'Date Submitted', 'type': 'calendarRange', 'placeholder': 'Search DateRange',
        'column': 'report.modified'
      }
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
   * Method used to navigate the user to the editInspection component based on the inspection selected to edit.
   * @param index {number} Parameter used to define the selected reportId.
   * @return {void}
   */
  onReportSelectedToEdit(reportId: number, inspectionHeaderId: number, statusId: number) {
    if (this.disconnected) {
      this.offlineStorage.changeAssignedInspectionStatus(reportId, statusId, 'U');
    }
    this.router.navigate(['app/inspection', inspectionHeaderId, reportId, 'editinspection']);
  }

  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   */
  onInspectionGlobalSearch(event) {
    if (this.reportTableRef && this.reportTableRef.filter) {
      this.reportTableRef.filter(event, 'global', 'contains');
    }
  }
  /**
   * Component OnDestroy life cycle hook.
   * And the subscriptions done in the component's are unsubscribed.
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
