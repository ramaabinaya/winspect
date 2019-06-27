// section-wizard component, display section wise form and used for move to next and previous section in form.
import {
  Component, OnInit, OnChanges,
  Input, Output, EventEmitter, SimpleChanges,
  ViewChild, OnDestroy
} from '@angular/core';
import { DynamicFormGroupService } from '../../services/dynamic-form-group.service';
import { Router } from '@angular/router';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { AuthService } from '../../../auth/services/auth.service';
import { InspectionSection } from '../../../inspection/model/inspectionSection.model';
/**
 * Variable which is used to define the window screen.
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used for sectionwise form display.
 */
@Component({
  selector: 'app-section-wizard',
  templateUrl: './section-wizard.component.html',
  styleUrls: ['./section-wizard.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class SectionWizardComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Variable which is used to subscribe and unsubscribe the network status.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to define whether the section display is for preview or inspection.
   * @type {boolean}
   */
  @Input() preview: boolean;
  /**
   * Variable which is used to check whether the network is connected or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which got the formName from the parent component.
   * @type {string}
   */
  @Input() formName: string;
  /**
   * Variable which got the editId from the parent component.
   * @type {number}
   */
  @Input() editId: number;
  /**
   * Variable which got the message from the parent component.
   * @type {string}
   */
  @Input() message: string;
  /**
   * Variable which conatains the inspection sections of the particular form that provided.
   * @type {any[]}
   */
  inspectionSections: InspectionSection[];
  /**
   * It holds the sectionName whic selected currently for display.
   * @type {string}
   */
  selectedOption: string;
  /**
   * Variable which emits the value when the button clicked in the child component.
   * @type {any}
   */
  @Output() buttonClicked = new EventEmitter<any>();
  /**
   * Variable which stores the id of the selected inspection Section.
   * @type {number}
   */
  selectedSectionId = 0;
  /**
   * Variable which define the status of the report.
   * @type {string}
   */
  status: string;
  /**
   * Variable that decides whether to display the dialogbox or not.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable that decides whether to continue to create new report or not.
   * @type {boolean}
   */
  addReport: boolean;
  /**
  * Variable which is used to define the DynamicFormComponent of the template.
  */
  @ViewChild(DynamicFormComponent) childForm: DynamicFormComponent;
  /**
  * Variable which is used to display the screen in mobile view
  */
  mobileView: boolean;
  /**
   * Variable which is used to define the current user role.
   */
  userRole: string;
  /**
   * Variable which is used to display the contents of the top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Reports',
    'rightIcon': '', 'rightheader': ''
  };
  /**
   * Variable which is used to define the navbar hide or not.
   */
  hideNav;
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
   * Component constructor which used to inject the needed services into the component.
   * @param dynamicFormService Which is used to the dynamic form by got the input properties from the database.
   * @param offlineStorage To get inspectionheader details in offline mode.
   * @param router service which is used to navigate to the desired routes.
   * @param modalService To made the dialog box display.
   * @param authService To get current user details.
   */
  constructor(private dynamicFormService: DynamicFormGroupService,
    private offlineStorage: OfflineStorageService,
    private router: Router,
    private authService: AuthService) {
  }
  /**
   * component OnInit lifecycle hook.
   */
  ngOnInit() {
    this.offlineStorage.focusMode.next('RedBottomTray');
    this.subscriptionObject['focusMode'] = this.offlineStorage.focusMode.subscribe((value) => {
      this.hideNav = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.userRole = this.authService.userRole;
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (!this.preview && this.mobileView) {
        this.navbarDetails.header = 'Inspection';
        this.navbarDetails.leftheader = 'Cancel';
        this.navbarDetails.rightheader = 'Done';
      } else if (this.preview && this.mobileView) {
        this.navbarDetails.header = 'Template Preview';
        this.navbarDetails.leftheader = 'Close';
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
  }
  /**
   * Component Onchanges lifecycle hook.
   * Which called when the changes triggered.
   * @param {SimpleChanges} changes It holds the information about the changes done.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('formName') && this.formName) {
      // If changes in formName input property then get the form details from the database
      // if (this.formName) {}
      if (!this.disconnected) {
        // if (this.formName) {
        this.subscriptionObject['section'] = this.dynamicFormService.getInspectionSections(this.formName).subscribe((res) => {
          if (res && res['inspectionHeader'] && res['inspectionHeader']['inspectionSections']) {
            this.inspectionSections = res['inspectionHeader']['inspectionSections'];
            if (this.inspectionSections && this.inspectionSections.length > 0 && this.inspectionSections[this.selectedSectionId]) {
              this.selectedOption = this.inspectionSections[this.selectedSectionId].sectionName;
            }
          }
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error in get inspection Header: ', err.error.error);
          }
        });
        // }
      } else if (window && window.cordova && this.disconnected) {
        this.inspectionSections = [];
        // To get form details from the offline database
        this.offlineStorage.getInspectionDetails(this.formName)
          .then((sections) => {
            this.inspectionSections = [];
            for (let i = 0; i < sections.rows.length; i++) {
              this.inspectionSections.push(sections.rows.item(i));
            }
            if (this.inspectionSections.length > 0 && this.inspectionSections[this.selectedSectionId]) {
              this.selectedOption = this.inspectionSections[this.selectedSectionId].sectionName;
            }
          })
          .catch((e) => console.log('falied to fetch section', e.message));
      }
    }
  }
  /**
   * Method which is used to navigate the sectionForm when the particular sectionName clicked.
   * @param id {number} which holds the id of the selected section.
   */
  onSectionClicked(id: number) {
    if (this.selectedSectionId !== id) {
      this.childForm.formGroup = undefined;
    }
    this.selectedSectionId = id;
    if (this.inspectionSections && this.inspectionSections[id]) {
      this.selectedOption = this.inspectionSections[id].sectionName;
    }
  }
  /**
   * Method which is used to save the section details when move to the next section.
   * So it emit the button triggered action to pass the selectedsection to the child component.
   * @param isCompleted {boolean} which is used to decide the report status completed or not.
   * @param addReport {boolean} which is used to decides whether to continue to create new report or not.
   */
  saveSectionDetails(status: string, addReport: boolean) {
    this.status = status;
    this.addReport = addReport;
    this.dynamicFormService.sectionSaveTriggered.emit(this.selectedOption);
  }
  /**
   * Method which is used to emit the
   * button click to the parent component for saving details.
   * @param event {any} parameter which holds the event that triggered when the button click.
   */
  eventTriggered(event: any) {
    if ((event && event.method === true) || this.status === 'Completed') {
      event.status = this.status;
      event.addReport = this.addReport;
      this.buttonClicked.emit(event);
    } else if (this.inspectionSections && this.inspectionSections.length - 1 === this.selectedSectionId && this.status !== null) {
      this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
    } else if (this.status === 'Preview') {
      this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
    }
  }
  /**
   * Method which is used to move to the previous section when the Previous section button clicked.
   */
  movePrevious() {
    if (this.inspectionSections && this.inspectionSections.length > 0) {
      this.inspectionSections.forEach((section, index) => {
        if (section && section.sectionName === this.selectedOption && this.inspectionSections && this.inspectionSections[index - 1]) {
          this.selectedSectionId = index ? index - 1 : 0;
          this.selectedOption = this.inspectionSections[index - 1].sectionName;
        }
      });
    }
  }
  /**
   * Method which is used to move to the next section when the next section button clicked.
   */
  moveNext() {
    if (this.inspectionSections && this.inspectionSections.length - 1 !== this.selectedSectionId) {
      // To move to the next section
      this.inspectionSections.find((section, index) => {
        if (section && section.sectionName === this.selectedOption) {
          this.selectedSectionId = index + 1;
          return true;
        }
      });
      if (this.inspectionSections && this.inspectionSections[this.selectedSectionId]) {
        this.selectedOption = this.inspectionSections[this.selectedSectionId].sectionName;
      }
    }
  }
  /**
   * Method which is used to alert the user when he navigates to other route
   * without saving the child component data's.
   * @return {boolean}
   */
  canDeactivate(): boolean {
    if (this.childForm) {
      return this.childForm.canDeactivate();
    }
  }
  /**
  *  Method which is used to display a model for cancel option
  * @param cancel local reference variable.
  */
  openVerticallyCentered(cancel) {
    if (this.preview) {
      this.buttonClicked.emit(false);
      this.offlineStorage.focusMode.next('BottomInputlistContainer');
    } else {
      this.dialogBoxDetails.content = this.messages.CANCEL;
      this.dialogBoxDetails.action.push({ label: 'Yes', value: 'Cancel' }, { label: 'No' });
      this.display = true;
    }
  }
  /**
   * Method which is used to cancel inspection.
   */
  onCancelYes() {
    if (this.userRole === 'Admin') {
      this.router.navigate(['/app/inspection/reports']);
    } else {
      this.router.navigate(['/app/inspection/technicianreports']);
    }
    // After hiding the bottom navbar during the inspection to display that back.
    this.offlineStorage.focusMode.next(false);
  }
  onComplete() {
    this.dialogBoxDetails.action = [];
    this.dialogBoxDetails.content = this.messages.COMPLETE_REPORT;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'Complete_yes' }, { label: 'No', value: 'Complete_no' });
    this.display = true;
  }
  /**
   * Method which is used to define which action is triggered.
   * @param event event {any} To define the event value.
   */
  dialogBoxAction(event) {
    this.display = false;
    if (event === 'Cancel') {
      this.onCancelYes();
    } else if (event === 'Complete_yes') {
      this.saveSectionDetails('Completed', false);
    } else if (event === 'Complete_no') {
      this.saveSectionDetails('In progress', false);
    } else if (event === 'Quit_yes') {
      this.saveSectionDetails('Preview', false);
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
   * Method which is used to navigate to the desired routes.
   */
  onNavigate(key: string) {
    if (key === 'L') {
      if (this.preview) {
        this.buttonClicked.emit(false);
        this.offlineStorage.focusMode.next('BottomInputlistContainer');
      } else {
        this.dialogBoxDetails.content = this.messages.CANCEL;
        this.dialogBoxDetails.action.push({ label: 'Yes', value: 'Cancel' }, { label: 'No' });
        this.display = true;
      }
    } else {
      this.dialogBoxDetails.content = this.messages.QUIT_REPORT_PROCESS;
      this.dialogBoxDetails.action.push({ label: 'Yes', value: 'Quit_yes' }, { label: 'No' });
      this.display = true;
    }
  }
  /**
  * Component ondestroy life cycle hook.
  * All subscriptions are unsubscribe here.
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
