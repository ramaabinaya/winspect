// TechAssignedInspectionComponent displays the list of assignedInspection to that technician.
import { Component, OnInit, OnDestroy, DoCheck, ViewEncapsulation, ViewChild } from '@angular/core';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ReportStore } from '../../../shared/store/report/report.store';
import { Inspection } from '../../model/inspection.model';
import { SortingService } from '../../../shared/services/sorting.service';
import { User } from '../../../user/model/user.model';
import { ReportService } from '../../../shared/services/report.service';
import { UserService } from '../../../user/services/users.service';

/**
 * window variable which is used to define the window instance and to access the window related methods.
 * @type {any}
 */
declare let window: any;
/**
* Component which is used to display the assigned inspection list of the technician.
*/
@Component({
  selector: 'app-tech-assigned-inspection',
  templateUrl: './tech-assigned-inspection.component.html',
  styleUrls: ['./tech-assigned-inspection.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TechAssignedInspectionComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to refers the techAssignedInspectionTable.
   */
  @ViewChild('techAssignedInspecTableRef') inspecTableRef;
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
   * Variable which is used to define the assigned inspection list of the technician.
   */
  assignedInspection = null;
  /**
  * Variable which is used to decide whether to display the form view component or not
  */
  mobileView = false;
  /**
   * Variable which is used to store user details from useraccount table.
   */
  technicians = [];
  /**
   * Variable which is used to store the id of the technician to whom the task is reassigned.
   */
  selectedTechnician;
  /**
   * Variable used as a local reference to change the due date.
   */
  toDate: Date;
  /**
  * Variable which is used to define the inspection list.
  */
  inspection: Inspection[];
  /**
  * Variable which is used to store the assignInspectionUser details to refer it locally.
  */
  filteredReport = [];
  /**
   * Variable which is used to check there are assignedInspectioList available for display.
   */
  assignedInspectionListExist: boolean;
  /**
   * Variable which is used to disable the previous date from today for datepicker.
   */
  minDateValue: Date;
  /**
   * Variable which is used to store user search value.
   */
  selectedValue: string;
  /**
   * Variable which is used to display search results exists or not.
   */
  resultNotExist: boolean;
  /**
 * Variable which is used the store the current logged in user details.
 */
  user: User;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Tasks',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': true
  };
  /**
   * Variable which is used to define type of sorting.
   */
  sortingDetails = [
    { 'label': 'Client Name', 'value': 'ClientName' },
    { 'label': 'Due Date', 'value': 'DueDate' },
    { 'label': 'Templates', 'value': 'InspectionName' }
  ];
  /**
   * Variable which is used to refer the due date change modal dialog box.
   */
  @ViewChild('dueDateChange') dueDateChangeModal;
  /**
   * Variable which is used to refer the re assign modal dialog box.
   */
  @ViewChild('reAssign') reAssignModal;
  /**
   * Variable which is used to sort table columns in ascending descending order.
   */
  cols = [
    { field: 'inspectionHeader.name', header: 'inspectionHeader.name' },
    { field: 'user.name', header: 'user.name' },
    { field: 'inspectionStatus.name', header: 'Status' }
  ];
  /**
   * Variable which is used to decide whether to show or hide the filter.
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
   * Variable which is used to define the current row selected for the bottom sheet action implementation.
   */
  currentActionRow;
  /**
   * Variable which is used to list status list for dropdown.
   */
  status = [
    { name: 'Assigned', value: 'Assigned' },
    { name: 'In progress', value: 'In progress' },
    { name: 'Completed', value: 'Completed' }
  ];
  /**
     *Variable which is used to display the message like error, success etc.,
     */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'ASSIGNED INSPECTION';
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
   * @param auth To get the current user information.
   * @param modalService To made the dialog box display.
   * @param datePipe To display date in date format.
   * @param inspectionStore To get the the safety inspection details.
   * @param siteService To get the sitelocation details from the database.
   * @param reportStore To get the assigned inspection list.
   * @param router To navigate the user to the provided routes.
   * @param titlecasePipe To display name in titlecase format.
   * @param userStore To get the user from the store.
   * @param sortService To sort the assigned inpection report.
   * @param offlineStorageService To create tables and get synchorization completed percentage.
   * @param matomoService to perform metric operation on this component.
   */
  constructor(private auth: AuthService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private reportService: ReportService,
    private reportStore: ReportStore,
    private userService: UserService,
    private router: Router,
    private sortService: SortingService,
    private offlineStorageService: OfflineStorageService,
    private matomoService: MatomoService) {
  }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    this.subscriptionObject['messages'] = this.auth.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // After hiding the bottom navbar during the inspection to display that back.
    this.offlineStorageService.focusMode.next(false);
    const todayDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    // current logged in user informations got.
    this.subscriptionObject['user'] = this.auth.user.subscribe((user) => {
      this.user = user;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Assigned Task';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-user';
        this.navbarDetails.rightheader = 'Sync';
        this.navbarDetails.placeholder = 'Client Name';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (!this.disconnected) {
      const inspectionList = [];
      // AssignedInspection details got.
      this.subscriptionObject['assignInspectionUsers'] = this.reportService.getAssignedInspections()
        .subscribe((assignedInsepctions) => {
          this.assignedInspectionListExist = false;
          if (assignedInsepctions) {
            this.assignedInspectionListExist = true;
            this.assignedInspection = assignedInsepctions;
            const filterDataCopy = {
              inspectionNames: [],
              userNames: [],
              windfarmNames: []
            };
            if (this.assignedInspection) {
              this.assignedInspection.forEach((val) => {
                if (val) {
                  if (val.inspectionHeader && val.inspectionHeader.name) {
                    if (filterDataCopy.inspectionNames.indexOf(val.inspectionHeader.name) === -1) {
                      filterDataCopy.inspectionNames.push(val.inspectionHeader.name);
                      inspectionList.push({ label: val.inspectionHeader.name, value: val.inspectionHeader.name });
                    }
                  }
                  if (val.user && val.user.firstName && val.user.lastName && this.user.role !== 'Technician') {
                    val.user.name = val.user.firstName + ' ' + val.user.lastName;
                    if (filterDataCopy.userNames.indexOf(val.user.name) === -1) {
                      filterDataCopy.userNames.push(val.user.name);
                      this.technicians.push({ label: val.user.name, value: val.user.name });
                    }
                  }
                }
                if (val.dueDate === todayDate && val.inspectionStatus.name === 'Assigned') {
                  val.color = 'orange';
                  val.toolTip = 'Expires Today';
                }
                if (val.dueDate < todayDate && val.inspectionStatus.name === 'Assigned') {
                  val.color = 'red';
                  val.toolTip = 'Due Date Expired';
                }

                this.sortService.filterDetails = [
                  {
                    'header': 'Inspection Name', 'type': 'select', 'placeholder': 'Search Inspection',
                    'options': inspectionList, 'column': 'inspectionHeader.name'
                  },
                  {
                    'header': 'Assigned Date', 'type': 'calendarRange', 'placeholder': 'Search Date Range',
                    'column': 'created'
                  },
                  {
                    'header': 'DueDate', 'type': 'calendarRange', 'placeholder': 'Search Date Range',
                    'column': 'dueDate'
                  }
                ];
                if (this.user && this.user.userRoleId === 2 && this.technicians) {
                  this.sortService.filterDetails.push({
                    'header': 'Technician Name', 'type': 'select', 'placeholder': 'Search Technician',
                    'options': this.technicians, 'column': 'user.name'
                  });
                }
              });
            }
          }
          if (!this.selectedValue && this.mobileView) {
            this.filteredReport = this.assignedInspection;
          } else {
            this.searchValue(this.selectedValue);
          }
        });
      if (this.mobileView) {
        this.userService.getUsers().subscribe((users) => {
          users.forEach((user) => {
            if (user.firstName && user.lastName) {
              user.name = user.firstName + ' ' + user.lastName;
              this.technicians.push(user);
            }
          });
        });
      }
    }
    // If cordova exist, then check the network status of the device.
    // If the network is unavailable then proceed with the offline mode.
    if (window && window.cordova) {
      this.subscriptionObject['networkDisconnected'] = this.offlineStorageService.networkDisconnected.subscribe((value: boolean) => {
        this.disconnected = value;
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
      if (this.disconnected) {
        this.assignedInspection = [];
        const userId = this.user ? this.user.id : null;
        // AssigndInspection deatils got from the local database.
        this.offlineStorageService.getAssignInspectionUsers(userId)
          .then((assignedInspections) => {
            this.assignedInspection = [];
            for (let i = 0; i < assignedInspections.rows.length; i++) {
              if (assignedInspections.rows.item(i).name === 'Assigned') {
                this.assignedInspectionListExist = true;
                this.assignedInspection.push(assignedInspections.rows.item(i));
              }
            }
            if (this.assignedInspection) {
              this.sortService.sortReport(this.assignedInspection, 'DueDate');
              this.filteredReport = this.assignedInspection;
            }
          })
          .catch((e) => { console.log('failed to get assignedInspections list data', e.message); });
      }
    }
  }
  /**
   * Method which is used to update the filtered table details.
   * @param event The value that holds the filtered records.
   */
  getFilteredTable(event) {
    this.inspecTableRef = event;
  }
  /**
  * Method which is used to navigate to the desired routes.
  * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
  */
  onNavigate() {
    this.router.navigate(['/app/inspection/notification']);
  }
  /**
   * Method which is used to display a model for reassigning a task
   * @param reAssign local reference variable.
   */
  openModal(reAssign) {
    this.modalService.open(reAssign, { centered: true });
  }
  /**
   * Method which is used to cancel the assigned task
   * @param id  To define the index of the assigned inspection
   */
  onDelete(id: number) {
    let reportId;
    if (this.mobileView) {
      reportId = this.currentActionRow ? this.currentActionRow.id : null;
    } else {
      reportId = id;
    }
    this.reportStore.deleteReport(reportId);
  }
  /**
   * Method which is used to reassign the task to other technician.
   * @param inspectionId To define the index of the assigned inspection
   */
  onReassign(inspectionId) {
    let id;
    if (this.mobileView) {
      id = this.currentActionRow ? this.currentActionRow.id : null;
    } else {
      id = inspectionId;
    }
    if (this.selectedTechnician && id) {
      this.reportService.reassignInspection(id, this.selectedTechnician.id).subscribe((val) => {
        console.log('inspection reassigned!', val, this.filteredReport.length);
        this.filteredReport.find((inspection, index) => {
          if (inspection.id === id) {
            this.filteredReport.splice(index, 1);
            console.log('report removed', index, id);
            return true;
          }
        });
      });
    }

  }
  /**
   * Method which is used to change the due date of the assigned task
   */
  onChangeDate() {
    const toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    const todayDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    this.toDate = undefined;
    console.log('current id', this.currentActionRow.id, 'date', toDate);
    return this.reportService.changeAssignedInspectionDueDate(this.currentActionRow.id, toDate)
      .subscribe((val) => {
        console.log('dudate changed successfully!', val);

        this.filteredReport.find((inspection) => {

          if (inspection && inspection.id === this.currentActionRow.id) {
            inspection.color = null;
            inspection.toolTip = null;
            inspection.dueDate = toDate;
            if (inspection.dueDate === todayDate) {
              console.log('expires today');
              inspection.color = 'orange';
              inspection.toolTip = 'Expires Today';
            }
            if (inspection.dueDate < todayDate) {
              inspection.color = 'red';
              inspection.toolTip = 'Due Date Expired';
            }

            console.log('report date changed');
            return true;
          }
        });
      });
  }
  /**
   * Method which is used to sort the completed reports table.
   * @param key Variable which is used to select the sortService column of the table.
   */
  sortReport(key) {
    this.sortService.sortReport(this.assignedInspection, key);
  }
  /**
  * Method which is used to clear the search input.
  */
  onClear() {
    this.selectedValue = undefined;
    this.resultNotExist = false;
    this.filteredReport = this.assignedInspection;
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
      this.filteredReport = this.assignedInspection;
    } else {
      this.filteredReport = this.assignedInspection.filter((user) => {
        return (user.windfarm.name && user.windfarm.name.toLowerCase().indexOf(this.selectedValue.toLowerCase()) !== -1);
      });
      if (this.filteredReport.length === 0) {
        this.resultNotExist = true;
      }
    }
  }
  /**
   * Method which is used to select the assignedInspection and with that
   *  selected inspection's id navigate to the techAssignedMApview.
   * @param id {number} To define the index of the assigned inspection.
   * @return {void}
  */
  onSelected(id: number) {
    let assignedInspectionId;
    if (this.user.role === 'Technician') {
      assignedInspectionId = id;
      // navigating to the mapview.
      this.router.navigate(['app/inspection/', assignedInspectionId, 'techmapview']);
    }
  }
  /**
  * Method which is used to create database tables in device when sync button pressed.
  */
  createsqlitedb() {
    if (window && window.cordova) {
      console.log('Cordova Is Available!');
      this.offlineStorageService.createTables();
    } else {
      console.log('Cordova Not Available!');
    }
  }
  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   */
  filterGlobal(event) {
    this.inspecTableRef.filter(event, 'global', 'contains');
  }
  /**
   * Method which is used to display a model for open a bottom sheet
   * @param bottom local reference variable.
   */
  openBottomSheet(i) {
    this.bottomSheetIndex = i;
    if (this.disconnected) {
      this.bottomSheetDetails = ['Start Inspection'];
    } else if (!this.disconnected) {
      this.bottomSheetDetails = ['Delete', 'Change Due Date', 'Reassign', 'Start Inspection'];
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
   * @param inspection Which is define the currently selected row.
   */
  bottomSheetMenuAction(event, inspection) {
    this.currentActionRow = inspection;
    if (event === 'Delete') {
      // this.openCancelModal(this.cancelModal);
      this.dialogBoxDetails.action = [];
      this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
      this.dialogBoxDetails.content = this.messages.CANCEL_ASSIGNED_INSPECTION;
      this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onDelete' }, { label: 'No' });
      this.display = true;
    } else if (event === 'Change Due Date') {
      this.minDateValue = new Date();
      this.openModal(this.dueDateChangeModal);
    } else if (event === 'Reassign') {
      this.selectedTechnician = null;
      this.openModal(this.reAssignModal);
    } else if (event === 'Start Inspection') {
      this.onSelected(inspection.id);
    }
  }


  /**
  * Method which is used to define which action is triggered.
  * @param event event {any} To define the event value.
  */
  dialogBoxAction(event) {
    this[event]();
    this.display = false;
  }


  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.display = event;
  }

  /**
   * Component OnDestroy life cycle hook.
   * And unsubscribe all the aubscriptions done in the component.
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
