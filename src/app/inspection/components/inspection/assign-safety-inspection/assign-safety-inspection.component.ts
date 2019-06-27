// AssignInspectionComponent used to assign the inspection to the technician
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteService } from '../../../../common/services/site.service';
import { UserStore } from '../../../../user/store/user/user.store';
import { AssignInspectionUsers } from '../../../model/assignInspectionUsers.model';
import { InspectionStore } from '../../../../shared/store/inspection/inspection.store';
import { InspectionService } from '../../../../shared/services/inspection.service';
import { TitleCasePipe } from '@angular/common';
import { OfflineStorageService } from '../../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../../common/services/matomo.service';
import { Router } from '@angular/router';
import { GroupsStore } from '../../../../shared/store/groups/groups.store';
import { User } from '../../../../user/model/user.model';
import { Groups } from '../../../../common/models/groups.models';
import { ReportStore } from '../../../../shared/store/report/report.store';
import { AuthService } from '../../../../auth/services/auth.service';
/**
 * Component which is used to assign the inspection to the technician.
 */
@Component({
  selector: 'app-assign-safety-inspection',
  templateUrl: './assign-safety-inspection.component.html',
  styleUrls: ['./assign-safety-inspection.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssignSafetyInspectionComponent implements OnInit, OnDestroy {
  /**
  * Variable which is used to store the subscription and unsubscribe the store     *subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to define the technicians list.
   */
  technicians = [];
  /**
   * Variable which is used to define the inspection list.
   */
  inspection = [];
  /**
   * Variable which is used to define the minimum Date Value in the calender for restrict the access of past dates.
   * @type {Date}
   */
  minDateValue: Date;
  /**
   * Variable which is used to define the sitelocation details.
   */
  siteLocations = [];
  /**
   * Variable which is used to decide whether the dialog needs to be displayed or not.
   * @type {boolean}
   */
  dialogVisible = false;
  /**
   * Variable which is used to define the assigned Inspection form.
   * @type {FormGroup}
   */
  assignInspectionForm: FormGroup;
  /**
   * Variable which is used to display the admin mobile view.
   */
  mobileView: boolean;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Tasks',
    'rightIcon': '', 'rightheader': ''
  };
  /**
   * Variable which is used to store the groups details.
   */
  groups: Groups[];
  /**
   * Variable which is used to define the users list.
   */
  users: User[];
  /**
   * Variable which is used to define the currently selected tab.
   */
  firstTab: boolean;
  /**
   *Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
   pageTitle: string = "SAFETY INSPECTION";
   /**
   * Variable which is used to define the dialog box details.
   */
  dialogBoxDetails = {
    header: 'Message',
    content: '',
    action: [{ label: 'Okay' }]
  };
  /**
   * Component Constructor which is used to inject the required services.
   * @param inspectionStore To get the safety inspection lists from the store.
   * @param userStore To get the user from the store.
   * @param siteService To get sitlelocation details from the database.
   * @param router To navigate the user to the desired routes.
   * @param inspectionService To assign the inspection to the selected technician.
   * @param titlecasePipe To display the username with the TitleCase.
   * @param offlineStorage To get the report details from the offline database.
   * @param matomoService to perform metric operation on this component.
   * @param groupsStore To get the group details from the database.
   */
  constructor(private inspectionStore: InspectionStore,
    private userStore: UserStore,
    private reportStore: ReportStore,
    private siteService: SiteService,
    private authService: AuthService,
    private router: Router,
    private inspectionService: InspectionService,
    private titlecasePipe: TitleCasePipe,
    private offlineStorage: OfflineStorageService,
    private matomoService: MatomoService,
    private groupsStore: GroupsStore) { }
  /**
   * Component OnInit lifecycle hook.
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
    this.minDateValue = new Date();
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Assign Inspection';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-user';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.assignInspectionForm = new FormGroup({
      'technician': new FormControl(null, Validators.required),
      'inspectionName': new FormControl(null, Validators.required),
      'siteLocation': new FormControl(null, Validators.required),
      'dueDate': new FormControl(null, Validators.required),
      'comments': new FormControl(null)
    });
    if (this.mobileView === false) {
      this.assignInspectionForm.addControl('userType', new FormControl('Single User'));
    }

    // To get the inspection list from the store.
    this.subscriptionObject['inspections'] = this.inspectionStore.inspections.subscribe((inspectionHeader) => {
      if (inspectionHeader) {
        // inspectionHeader.forEach((inspection) => {
        //   if (inspection && inspection.isActive === 1) {
        //     this.inspection.push(inspection);
        //   }
        // });
        this.inspection = inspectionHeader.filter((inspection) => {
          return (inspection && inspection.isActive === 1);
        });
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // To get all the windfarm details for assigning the inspection.
    this.subscriptionObject['getAllWindFarms'] = this.siteService.getAllWindFarms().subscribe((res) => {
      if (res && res['windFarms']) {
        this.siteLocations = res['windFarms'];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // Get the userlist details in the userstore subscription.
    this.subscriptionObject['users'] = this.userStore.users.subscribe((user) => {
      if (user) {
        this.users = user;
        this.onUserType();
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['groups'] = this.groupsStore.groups.subscribe((res) => {
      if (res) {
        this.groups = res ? res : [];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to define the type of user, either
   * the inspection is assigned to a single user or to a group of users.
   */
  onUserType() {
    this.firstTab = !this.firstTab;
    const userType = this.assignInspectionForm.value.userType;
    if (userType === 'Single User' || this.firstTab === true && this.mobileView) {
      this.technicians = [];
      if (this.users) {
        this.technicians = this.users.filter((item) => {
          return (item && item.userRoleId === 1 && item.active === 1);
        }).map((item) => {
          const name = this.titlecasePipe.transform(item.firstName + ' ' + item.lastName);
          return ({ name: name, id: item.id, isGroup: false });
        });
      }
    } else if (userType === 'Group of Users' || this.firstTab === false && this.mobileView) {
      this.technicians = [];
      if (this.groups) {
        if (this.groups && this.groups.length > 0) {
          this.technicians = this.groups.filter((item) => {
            return (item && item.groupMembers && item.groupMembers.length > 0);
          }).map((item) => {
            return ({ name: item.name, id: item.id, isGroup: true });
          });
        }
      }
    }
  }
  /**
   * Method which is used to assign the safety inspection to the technician and save those details to the database.
   * @return {void}
   */
  onAssign() {
    let assignedInspection;
    this.matomoService.addEvent("FORMS", "SUBMISSION", "Assign Inspection");
    // Got the entered details to the local variable.
    if (this.assignInspectionForm && this.assignInspectionForm.value) {
      let convertedDate = new Date(this.assignInspectionForm.value.dueDate);
      convertedDate = new Date(convertedDate.getFullYear() + '-'
        + ('00' + (convertedDate.getMonth() + 1)).substring(('00' + (convertedDate.getMonth() + 1)).length - 2) + '-'
        + ('00' + convertedDate.getDate()).substring(('00' + convertedDate.getDate()).length - 2));
      assignedInspection = new AssignInspectionUsers(
        this.assignInspectionForm.value.technician ? this.assignInspectionForm.value.technician.id : null,
        this.assignInspectionForm.value.inspectionName ? this.assignInspectionForm.value.inspectionName.id : null,
        1, convertedDate,
        this.assignInspectionForm.value.siteLocation ? this.assignInspectionForm.value.siteLocation.id : null,
        this.assignInspectionForm.value.comments, ''
      );
      // tslint:disable-next-line:max-line-length
      if (this.assignInspectionForm && this.assignInspectionForm.value.userType === 'Single User' || this.firstTab === true && this.mobileView) {
        // Assigning the inspection with the entered details.
        this.subscriptionObject['assignInspeciton'] = this.inspectionService.assignInspection(assignedInspection).subscribe((res) => {
          if (res['assignedInspection']) {
            this.dialogVisible = true;
            this.dialogBoxDetails.content = this.messages.TASK_TO_USER + ' ' + this.assignInspectionForm.value.technician.name;
            this.assignInspectionForm.reset();
            if (this.mobileView === true) {
              this.firstTab = true;
            } else {
              this.assignInspectionForm.get('userType').setValue('Single User');
            }
            this.reportStore.createNewAssignInspection(res['assignedInspection']);
          }
        }, (err) => {
          this.dialogBoxDetails.content = this.messages.TASK_ERROR;
          this.dialogVisible = true;
        });
      } else {
        // Assigning the inspection with the entered details.
        this.subscriptionObject['groupAssignInspection'] = this.inspectionService.groupAssignInspection(assignedInspection)
          .subscribe((res) => {
            if (res['assigned']) {
              this.dialogBoxDetails.content = this.messages.TASK_TO_GROUP + ' ' + this.assignInspectionForm.value.technician.name;
              this.dialogVisible = true;
              this.assignInspectionForm.reset();
              if (this.mobileView === true) {
                this.firstTab = false;
              } else {
                this.assignInspectionForm.get('userType').setValue('Group of Users');
              }
              this.reportStore.groupAssignInspection(res['assigned']);
            }
          }, (err) => {
            this.dialogBoxDetails.content = this.messages.TASK_ERROR;
            this.dialogVisible = true;
          });
      }
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
   * Component OnDestroy lifecycle hook.
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
   * Method which is used to navigate to the desired routes.
   * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
   */
  onNavigate(key: string) {
    if (key === 'L') {
      this.router.navigate(['/app/inspection/notification']);
    }
  }
  /**
   * Method which is used to alert the user when they navigates to the page
   * without saving the current page data's.
   */
  canDeactivate(): boolean {
    return this.assignInspectionForm && !this.assignInspectionForm.dirty;
  }
}
