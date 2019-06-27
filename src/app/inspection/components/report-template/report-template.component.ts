// ReportTemplateCmponent is used to the technician to assign the inspection for them by themself.
import { Component, OnInit, ViewEncapsulation, OnDestroy, DoCheck, ViewChild } from '@angular/core';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { SiteService } from '../../../common/services/site.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../user/model/user.model';
import { AssignInspectionUsers } from '../../model/assignInspectionUsers.model';
import { InspectionService } from '../../../shared/services/inspection.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ReportStore } from '../../../shared/store/report/report.store';
import { SortingService } from '../../../shared/services/sorting.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserStore } from '../../../user/store/user/user.store';
import { FormGroup, FormControl } from '@angular/forms';
import { filter, mergeMap } from 'rxjs/operators';
import { MatomoCategories } from '../../../common/enum/categories';
import { MatomoActions } from '../../../common/enum/actions';
/**
 * window variable to define the window instance to access the window related methods.
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used to assignInspection to the technicians by the technician itself.
 */
@Component({
  selector: 'app-report-template',
  templateUrl: './report-template.component.html',
  styleUrls: ['./report-template.component.css'],
  providers: [NgbModalConfig, NgbModal],
  encapsulation: ViewEncapsulation.None
})
/**
 * Component which is used to assignInspection to the technicians by the technician itself.
 */
export class ReportTemplateComponent implements OnInit, OnDestroy, DoCheck {
  /**
    *  Variable which is used to define the create new template option in mobile view.
    */
  hideFab: any;
  /**
 * Variable which is used to define the dialog box details.
 */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: []
  };
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
   * Variable which is used to decide whether to display the dialogbox or not.
   * @type {boolean}
   */
  dialogVisible: boolean;
  /**
   * Variable which is used to define the inspection list details.
   */
  inspections = null;
  /**
   * Variable which is used to define the windFarm details.
   */
  siteLocations = [];
  /**
   * Variable which is used to defines the selected sitelocation detail.
   * @type {any}
   */
  siteLocation = {};
  /**
   * Variable which is used to decide whether to display the dropdown or the template type table.
   * @type {boolean}
   */
  assignView: boolean;
  /**
   * Variable which is used to define the identifier of the selected inspection.
   * @type {number}
   */
  inspectionId: number;
  /**
   * Variable which is used to define the current user details.
   * @type {User}
   */
  currentUser: User;
  /**
   * Variable which is used to store all template list used as a local reference.
   */
  filteredRecord = null;
  /**
   * Variable which is used to decide whether to display the form view component or not
   * @type {boolean}
   */
  mobileView: boolean;
  /**
   * Variable which is used to define the word to be entered to search.
   */
  selectedValue: string;
  /**
  * Variable which is used to display search results exists or not.
  */
  resultNotExist: boolean;
  /**
   * Variable which is used to decide whether the selected templated is delete or not.
   */
  isArchive: boolean;
  /**
   * Variable which is used to define the warning message.
   */
  action: string;
  /**
   * Variable which is used to define the inspection header id.
   */
  inspectionHeaderId: number;
  /**
   * Variable which is used to define the archived templates.
   */
  archivedInspection = null;
  /**
   * Variable which is used to check whether the list is active template or archived template.
   */
  archivedTemplateView: boolean;
  /**
  * Variable which is used to display the contents of the top nav bar.
  */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'headerTab': true, 'navMenu': 'Templates',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': true
  };
  /**
  * Variable which is used to display the contents of the tab header.
  */
  headerTab = {
    'tab1': 'Templates', 'tab2': 'Archived'
  };
  /**
   * Variable which is used to define type of sorting.
   */
  sortingDetails = [
    { 'label': 'Owner Name', 'value': 'OwnerName' },
    { 'label': 'Template Name', 'value': 'TemplateName' }
  ];
  /**
  * Variable which is used to sort tabel columns in ascending/descending order.
  */
  cols = [
    { field: 'name', header: 'inspectionName' },
    { field: 'id', header: 'inspectionid' },
    { field: 'instructions', header: 'instructions' },
    { field: 'inspectionReportType', header: 'inspectionReportType' }
  ];
  /**
   * Variable which is used to refers the techAssignedInspectionTable.
   */
  @ViewChild('inspectionTemplateRef') inspectionTemplateRef;
  /**
   * Variable which is used to define the customers details.
   */
  customers = [];
  /**
   * Variable which is used to clear the search box value.
   */
  globalSearchVal: string;
  /**
   * Variable which is used to store the inspection details.
   */
  inspectionTemplate: any;
  /**
   * Variable which is used to store the user details.
   */
  users = [];
  /**
   * Variable which is used to store the site location which was selected from the dropdown.
   */
  locationId: any;
  /**
   * Variable which is used to store the template which was selected from the dropdown.
   */
  templateId: any;
  /**
  * Variable which is used to define the bulk assign form.
  * @type {FormGroup}
  */
  bulkassignForm: FormGroup;
  /**
  * Variable which is used to display the errormessage while bulk assign .
  * @type {string}
  */
  errorMsg: string;
  /**
   * Varibale which s used to decide whether to show or hide the filter
   * @type {boolean}
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
     *Variable which is used to display the message like error, success etc.,
     */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'REPORT TEMPLATE';
  /**
   * Component constructor used to inject the required services.
   * @param inspectionStore To get the inspection list details from the inspection store.
   * @param siteService To get the windfarm liat details.
   * @param authService To get the current user details.
   * @param reportStore To get the assigned inspection list.
   * @param inspectionService To assign the inspection to the technician.
   * @param router To navigate the user to the provided rotes.
   * @param route To get the report index from the route params.
   * @param sorting To sorting the template.
   * @param offlineStorageService To create tables and get synchorization completed percentage.
   * @param modalService To made the dialog box display.
   * @param modalService To made the dialog box display.
   * @param userStore To get userlist from the application store.
   */
  constructor(private inspectionStore: InspectionStore,
    private siteService: SiteService,
    private offlineStorageService: OfflineStorageService,
    private matomoService: MatomoService,
    private authService: AuthService,
    private reportStore: ReportStore,
    private inspectionService: InspectionService,
    private router: Router,
    private route: ActivatedRoute,
    private sortService: SortingService,
    private modalService: NgbModal,
    private userStore: UserStore,
    config: NgbModalConfig) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }
  /**
   * Component OnInit life cycle hook.
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
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value: boolean) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-user';
        this.navbarDetails.placeholder = 'Template Name';
        // this.navbarDetails.rightIcon = ''
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['focusMode'] = this.offlineStorageService.focusMode.subscribe((value) => {
      this.hideFab = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // getting the report displayed is archived or not from the queryparameter.
    this.subscriptionObject['params'] = this.route.url.subscribe((path) => {
      if (path) {
        this.archivedTemplateView = path[0].path === 'archived_template' ? true : false;
      }
      this.sortService.selectedDetails = [];
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });

    this.subscriptionObject['networkDisconnected'] = this.offlineStorageService.networkDisconnected.pipe(filter((value) => {
      this.disconnected = value;
      return true;
    }), mergeMap(() => {
      return this.authService.user;
    })).subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
      if (!this.disconnected) {
        if (this.currentUser && this.currentUser.role === 'Admin') {
          this.navbarDetails.rightIcon = 'assets/symbol-defs.svg#resource';
        } else if (this.currentUser && this.currentUser.role === 'Technician') {
          this.navbarDetails.rightheader = 'Sync';
        }
      }
    });

    if (!this.disconnected) {
      // Inspection list details got.
      this.subscriptionObject['inspections'] = this.inspectionStore.inspections.subscribe((inspection: any) => {
        const inspectionsCopy = [];
        const archivedInspectionCopy = [];
        this.inspectionTemplate = inspection;
        if (this.currentUser && this.currentUser.role === 'Admin' && inspection) {
          inspection.forEach((item) => {
            if (item && item.isActive === 1) {
              inspectionsCopy.push(item);
            }
            if (item && item.isActive === 0) {
              archivedInspectionCopy.push(item);
            }
          });
          if (inspectionsCopy || archivedInspectionCopy) {
            this.inspections = inspectionsCopy;
            this.archivedInspection = archivedInspectionCopy;
          }
          if (this.archivedTemplateView) {
            if (this.archivedInspection && this.archivedInspection.length > 0) {
              this.archivedInspection.sort(function (a, b) {
                const value = +new Date(b.modified) - +new Date(a.modified);
                return value;
              });
            }
            this.filteredRecord = this.archivedInspection;
          } else {
            if (this.inspections && this.inspections.length > 0) {
              this.inspections.sort(function (a, b) {
                const value = +new Date(b.modified) - +new Date(a.modified);
                return value;
              });
            }
            this.filteredRecord = this.inspections;
          }
        } else if (inspection && inspection.length > 0) {
          this.inspections = [];
          this.archivedInspection = [];
          inspection.forEach((item) => {
            if (item && item.isActive === 1) {
              this.inspections.push(item);
            }
            if (item && item.isActive === 0) {
              this.archivedInspection.push(item);
            }
          });
        }
        if (this.archivedTemplateView && this.mobileView) {
          if (!this.selectedValue) {
            this.filteredRecord = this.archivedInspection;
          } else {
            this.userSelected(this.selectedValue);
          }
        }
        if (!this.archivedTemplateView && this.mobileView) {
          if (!this.selectedValue) {
            this.filteredRecord = this.inspections;
          } else {
            this.userSelected(this.selectedValue);
          }
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
    // WindFarm list got.
    this.subscriptionObject['getAllWindFarms'] = this.siteService.getAllWindFarms().subscribe((res) => {
      if (res && res['windFarms']) {
        this.siteLocations = res['windFarms'];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // Check whether the cordova plugin available.
    if (window && window.cordova) {
      // check whether the network disconnected.
      if (this.disconnected) {
        this.navbarDetails.headerTab = false;
        this.archivedTemplateView = false;
        const customerId = this.currentUser.customerId;
        // WindFarm details got in the offline from local database.
        this.offlineStorageService.getWindFarmsList(customerId)
          .then((windfarms) => {
            this.siteLocations = [];
            for (let i = 0; i < windfarms.rows.length; i++) {
              this.siteLocations.push(windfarms.rows.item(i));
            }
          })
          .catch((e) => console.log('failed to get windfarms list data', e.message));
        this.offlineStorageService.getInspectionFormDetails(0)
          .then((inspection) => {
            this.inspections = [];
            for (let i = 0; i < inspection.rows.length; i++) {
              if (inspection && inspection.rows.item(i).isActive === 1) {
                this.inspections.push(inspection.rows.item(i));
              }
            }
            this.filteredRecord = this.inspections;
          })
          .catch((e) => console.log('failed to get windfarms list data', e.message));
        // WindFarm details got in the offline from local database.
        this.offlineStorageService.getCustomerDetails(customerId)
          .then((customer) => {
            for (let i = 0; i < customer.rows.length; i++) {
              this.inspections.forEach((item) => {
                if (item && item.customerId === customer.rows.item(i).id) {
                  item.ownername = customer.rows.item(i).name;
                }
              });
            }
          })
          .catch((e) => console.log('failed to get customer list data', e.message));
      }
    }

    if (this.mobileView) {
      // Customer List got
      this.subscriptionObject['getCustomerDetails'] = this.inspectionService.getCustomerDetails().subscribe((res) => {
        if (res && res['customerdetails']) {
          this.customers = res['customerdetails'];
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }

    this.sortService.filterDetails = [
      {
        'header': 'Report Type', 'type': 'select', 'placeholder': 'Search Report Type', 'column': 'inspectionReportType',
        'options': [{ 'label': 'Master', 'value': 'Master' }, { 'label': 'Child', 'value': 'Child' }]
      },
      {
        'header': 'Date Range', 'type': 'calendarRange', 'placeholder': 'Search Date Range',
        'column': 'modified'
      },
    ];
    this.subscriptionObject['userStore'] = this.userStore.users.subscribe((user) => {
      if (user) {
        user.filter((item) => {
          if (item && item.userRoleId === 1) {
            item['status'] = 1;
            this.users.push(item);
            return true;
          }
        });
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Component docheck lifecycle hook.
   */
  ngDoCheck() {
    if (this.mobileView) {
      if (this.inspections && this.customers) {
        this.inspections.forEach((item) => {
          this.customers.find((customer) => {
            if (customer && customer.id === item.customerId) {
              item.ownername = customer.name;
              return true;
            }
          });
        });
      }
      if (this.archivedInspection && this.customers) {
        this.archivedInspection.forEach((item) => {
          this.customers.find((customer) => {
            if (customer && customer.id === item.customerId) {
              item.ownername = customer.name;
              return true;
            }
          });
        });
      }
    }
  }
  /**
  * Method which is used to navigate to the desired routes.
  * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
  */
  onNavigate(key: string) {
    if (key === 'L') {
      this.router.navigate(['/app/inspection/notification']);
    } else if (key === 'R') {
      if (this.currentUser && this.currentUser.role === 'Admin') {
        this.router.navigate(['/app/addresource']);
      } else if (this.currentUser && this.currentUser.role === 'Technician') {
        if (window && window.cordova) {
          console.log('Cordova Is Available!');
          this.offlineStorageService.createTables();
        } else {
          console.log('Cordova Not Available!');
        }
      }
    }
  }
  /**
   * Method which is used to get the selected  template Type.
   * @param inspectionId {number} Parameter which is used to define the id of the selected inspection template.
   * @return {void}
   */
  onTemplateSelected(inspectionId: number) {
    if (this.currentUser && this.currentUser.role !== 'Admin') {
      this.navbarDetails.searchbox = false;
      this.inspectionId = inspectionId;
      this.assignView = true;
    }
  }
  /**
   * Method which is used to get the selected template for displaying preview of that template.
   * @param inspectionId {number} Parameter which is used to define the id of the selected inspection template.
   */
  onInspectionSelected(inspectionId: number) {
    this.router.navigate(['/app/inspection/', inspectionId, 'createsection', 1]);
  }
  /**
  * Method Which is used search reports in global.
  * @param event {any} To get the values entered in the search box.
  */
  filterGlobal(event) {
    if (this.inspectionTemplateRef) {
      this.inspectionTemplateRef.filter(event, 'global', 'contains');
    }
  }
  /**
   * Method which is used to update the filtered table details.
   * @param event The value that holds the filtered records.
   */
  getFilteredTable(event) {
    this.inspectionTemplateRef = event;
  }
  /**
   * Method which is used to assign the selected inspection to the technician.
   * @return {void}
   */
  assignTemplate() {
    const userId = this.currentUser ? this.currentUser.id : null;
    const siteLocationID = this.siteLocation ? this.siteLocation['id'] : null;
    const assignedInspection = new AssignInspectionUsers(userId, this.inspectionId, 1, null, siteLocationID, null, null);
    if (!this.disconnected) {
      // assigning inspection to the technician.
      this.subscriptionObject['assignInspection'] = this.inspectionService.assignInspection(assignedInspection).subscribe((res) => {
        if (res && res['assignedInspection']) {
          const assignedInspectionId = res['assignedInspection'].id;
          this.router.navigate(['app/inspection/', assignedInspectionId, 'techmapview']);
          this.reportStore.createNewAssignInspection(res['assignedInspection']);
        }
      }, (err) => {
        this.dialogBoxDetails.action = [];
        this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
        this.dialogBoxDetails.content = this.messages.TASK_ERROR;
        this.dialogBoxDetails.action.push({ label: 'Okay' });
        this.dialogVisible = true;
      });
    }
    // Assigning Inspection in offline.
    if (window && window.cordova) {
      // Check whether the network disconnected or not.
      if (this.disconnected) {
        // Inspection assigned in offline mode.
        this.offlineStorageService.assignInspection(assignedInspection)
          .then((assignedInspections) => {
            if (assignedInspections) {
              const assignedInspectionId = assignedInspections.insertId;
              this.router.navigate(['/app/inspection/', assignedInspectionId, 'techmapview']);
            }
          }).catch((error) => {
            this.dialogBoxDetails.action = [];
            this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
            this.dialogBoxDetails.content = this.messages.TASK_ERROR;
            this.dialogBoxDetails.action.push({ label: 'Okay' });
            this.dialogVisible = true;
          });
      }
    }
  }

  newTemplate() {
    const buttonName = 'New Template';
    this.matomoService.addEvent(MatomoCategories.Page, MatomoActions.Click, buttonName);
  }
  /**
   * Method which is used to sort the Template Name in ascending order.
   * @param key Variable which is used to select the sorting column of the table.
   */
  sortReport(key) {
    if (this.mobileView) {
      this.sortService.sortReport(this.filteredRecord, key);
    }
  }
  /**
  * Method which is used to clear the search input.
  */
  onClear() {
    this.selectedValue = undefined;
    this.resultNotExist = false;
    if (this.archivedTemplateView) {
      this.filteredRecord = this.archivedInspection;
    }
    if (!this.archivedTemplateView) {
      this.filteredRecord = this.inspections;
    }
  }
  /**
  * Method which is used to select the wind farm name.
  * @param event {any} To get the values entered in the search box.
  */
  userSelected(event) {
    this.selectedValue = event;
    this.filteredRecord = [];
    this.resultNotExist = false;
    if (this.selectedValue === undefined) {
      if (this.archivedTemplateView) {
        this.filteredRecord = this.archivedInspection;
      }
      if (!this.archivedTemplateView) {
        this.filteredRecord = this.inspections;
      }
    } else {
      if (this.archivedTemplateView && this.archivedInspection && this.archivedInspection.length > 0) {
        this.filteredRecord = this.archivedInspection.filter((user) => {
          const site = user.name;
          return (site && site.toLowerCase().indexOf(this.selectedValue.toLowerCase()) !== -1);
        });
      } else {
        if (this.inspections && this.inspections.length > 0) {
          this.filteredRecord = this.inspections.filter((user) => {
            const site = user.name;
            return (site && site.toLowerCase().indexOf(this.selectedValue.toLowerCase()) !== -1);
          });
        }
      }
    }
    if (this.filteredRecord && this.filteredRecord.length === 0) {
      this.resultNotExist = true;
    }
  }
  /**
   * Method which is used to delete the selected inspection header from the list.
   * @param inspectionHeaderId {number} To define the inspection header id.
   */
  onDeleteSelected(event, inspectionHeader) {
    if (!this.mobileView) {
      event.stopPropagation();
    }
    let allAssignInspection;
    this.inspectionHeaderId = inspectionHeader ? inspectionHeader.id : null;
    if (inspectionHeader && inspectionHeader.isCustom === 1) {
      this.subscriptionObject['assignInspectionUsers'] = this.reportStore.assignInspectionUsers.subscribe((res) => {
        allAssignInspection = res ? res : [];
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
      if (allAssignInspection && allAssignInspection.length > 0) {
        allAssignInspection.find((item) => {
          if (item && item.inspectionHeaderId === inspectionHeader.id) {
            return this.isArchive = true;
          }
        });
      }
      if (this.isArchive) {
        this.dialogBoxDetails.action = [];
        this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
        this.dialogBoxDetails.content = this.messages.REPORT_EXIST;
        this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onArchive' }, { label: 'No' });
        this.dialogVisible = true;
      } else if (!this.isArchive) {
        this.dialogBoxDetails.action = [];
        this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
        this.dialogBoxDetails.content = this.messages.DELETE_TEMPLATE;
        this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onDelete' }, { label: 'No' });
        this.dialogVisible = true;
      }
    } else {
      this.dialogBoxDetails.action = [];
      this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
      this.dialogBoxDetails.content = this.messages.DELETE_DEFAULT_TEMPLATE;
      this.dialogBoxDetails.action.push({ label: 'Okay' });
      this.dialogVisible = true;
    }
  }
  /**
 *  Method which is used to display a model for restore option
 * @param inspectionHeader {number} To define the inspection header id.
 */
  openRestoreModal(inspectionHeader) {
    this.dialogBoxDetails.action = [];
    this.inspectionHeaderId = inspectionHeader ? inspectionHeader.id : null;
    this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
    this.dialogBoxDetails.content = this.messages.RESTORE_REPORT;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onRestoreTemplate' }, { label: 'No' });
    this.dialogVisible = true;
  }
  /**
 * Method which is used to display the archived templates list.
 */
  onArchivedTemplate() {
    this.filteredRecord = [];
    this.archivedTemplateView = !this.archivedTemplateView;
    if (this.archivedTemplateView) {
      this.filteredRecord = [];
      this.filteredRecord = this.archivedInspection;
    } else {
      this.filteredRecord = [];
      this.filteredRecord = this.inspections;
    }
  }
  /**
   * Method which is used to delete the inspection template.
   */
  onDelete() {
    this.inspectionStore.deleteInspection(this.inspectionHeaderId);
  }
  /**
   * Method which is used to archive the inspection template.
   */
  onArchive() {
    this.inspectionStore.changeInspectionStatus(this.inspectionHeaderId, 0);
  }
  /**
   * Method which is used to restore the inspection template.
   * @param inspectionHeaderId {number} To define the inspection header id.
   */
  onRestoreTemplate(event, inspectionHeaderId?) {
    inspectionHeaderId = inspectionHeaderId ? inspectionHeaderId : this.inspectionHeaderId;
    this.inspectionStore.changeInspectionStatus(inspectionHeaderId, 1);
  }
  /**
   * Method which is used to edit the inspection template.
   * @param inspectionId {number} Parameter which is used to define the id of the selected inspection template.
   * @param event parameter which holds the event that triggered while selecting a particular inspection template.
   */
  onEdit(event: Event, inspection) {
    if (!this.mobileView) {
      event.stopPropagation();
    }
    if (inspection) {
      if (inspection.isCustom === 1) {
        this.router.navigate(['/app/inspection/', inspection.id, 'createsection', 0]);
      } else {
        this.dialogBoxDetails.action = [];
        this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
        this.dialogBoxDetails.content = this.messages.DEFAULT_TEMPLATE;
        this.dialogBoxDetails.action.push({ label: 'Okay' });
        this.dialogVisible = true;
      }
    }
  }
  /**
   * Method which is used to display all templates list.
   */
  allTemplate() {
    this.selectedValue = undefined;
    this.filteredRecord = [];
    this.filteredRecord = this.inspections;
    this.archivedTemplateView = false;
    this.resultNotExist = false;
  }
  /**
   * Method which is used to display archived templates list.
   */
  archivedTemplate() {
    this.selectedValue = undefined;
    this.filteredRecord = [];
    this.filteredRecord = this.archivedInspection;
    this.archivedTemplateView = true;
    this.resultNotExist = false;
  }
  /**
   * Method which is used to open bulk assign modal for assigning a inspection
   * to number of users for a particular site location.
   * @param event defines the event triggered when bulk assign option is selected
   * @param bulkAssign used to open the bulk assign modal.
   * @param inspectionId defines the templates id which was selected.
   */
  openAssignModal(event, bulkAssign, inspectionId) {
    this.templateId = inspectionId;
    this.inspectionTemplate.find((item) => {
      if (item && item.id === inspectionId) {
        this.bulkassignForm = new FormGroup({
          'template': new FormControl(item.name),
          'location': new FormControl(null)
        });
        return true;
      }
    });
    event.stopPropagation();
    this.modalService.open(bulkAssign, { centered: true });
  }
  /**
   * Method which is used to assign inspection to the selected users list.
   * @param userId defines the users id who were selected.
   */
  onAssignBulk(userId) {
    // tslint:disable-next-line:max-line-length
    if (this.bulkassignForm && this.bulkassignForm.value && this.bulkassignForm.value.template !== null && this.bulkassignForm.value.location !== null) {
      if (userId && this.users) {
        this.users.filter((item) => {
          if (item && item.id === userId) {
            item.status = 0;
            return true;
          }
        });
      }
      const assignedInspection = {
        userId: userId,
        inspectionHeaderId: this.templateId,
        inspectionStatusId: 1,
        windMillFormId: this.locationId
      };
      this.errorMsg = '';
      this.subscriptionObject['assignedInspection'] = this.inspectionService.assignInspection(assignedInspection).subscribe((res) => {
        if (res && res['assignedInspection']) {
          this.reportStore.createNewAssignInspection(res['assignedInspection']);
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
    // tslint:disable-next-line:max-line-length
    if (this.bulkassignForm && this.bulkassignForm.value && this.bulkassignForm.value.template === null || this.bulkassignForm.value.location === null) {
      this.errorMsg = this.messages.SELECT_SITE_LOCATION_ERROR;
    }
  }
  /**
   * Method which is used to reset the bulk assignment.
   */
  bulkAssignReset() {
    if (this.users) {
      this.users.forEach((item) => {
        item.status = 1;
      });
    }
  }
  /**
   * Method which is used to change the template.
   * @param template defines the name of the template.
   */
  onChangeTemplate(template) {
    this.inspectionTemplate.find((item) => {
      if (item && item.name === template) {
        this.templateId = item.id;
        return true;
      }
    });
  }
  /**
   * Method which is used to display a model for open a bottom sheet
   * @param id to refer the index value.
   * @param inspection Which is define the currently selected row.
   */
  openBottomSheet(id, inspection) {
    this.bottomSheetIndex = id;
    if (this.disconnected) {
      this.bottomSheetDetails = [
        'Start Inspection'
      ];
    } else if (!this.disconnected) {
      if (this.currentUser && this.currentUser.role === 'Admin') {
        if (inspection && inspection.isCustom === 1) {
          this.bottomSheetDetails = [
            'Delete', 'Edit'
          ];
        } else {
          this.bottomSheetDetails = ['Delete'];
        }
      } else if (this.currentUser && this.currentUser.role === 'Technician') {
        if (inspection && inspection.isCustom === 1) {
          this.bottomSheetDetails = [
            'Edit', 'Start Inspection'
          ];
        } else {
          this.bottomSheetDetails = ['Start Inspection'];
        }
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
   * @param inspection Which is define the currently selected row.
   */
  bottomSheetMenuAction(event, inspection) {
    if (event === 'Delete') {
      this.onDeleteSelected(event, inspection);
    } else if (event === 'Edit') {
      this.onEdit(event, inspection);
    } else if (event === 'Start Inspection') {
      this.onTemplateSelected(inspection.id);
    }
  }
  tabAction(event) {
    if (event === true) {
      this.archivedTemplate();
    } else if (event === false) {
      this.allTemplate();
    }
  }

  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.dialogVisible = event;
  }
  /**
* Method which is used to define which action is triggered.
* @param event event {any} To define the event value.
*/
  dialogBoxAction(event) {
    this[event]();
    this.dialogVisible = false;
  }
  /**
   * Component OnDestroy life cycle hook.
   * And unsubscribe all the subscriptions done in the component.
   * @return {void}
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
