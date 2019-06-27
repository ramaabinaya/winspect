// Component which is used to create inspection header with the entered details.
import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Inspection } from '../../model/inspection.model';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { DynamicInspectionService } from '../../../shared/services/dynamicInspection.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CustomAsyncValidatorService } from '../../../shared/services/customAsyncValidator.service';
import { MatomoCategories } from '../../../common/enum/categories';
import { MatomoActions } from '../../../common/enum/actions';
/**
 * Component to create a custom inspectionHeader.
 */
@Component({
  selector: 'app-custom-inspection-template',
  templateUrl: './custom-inspection-template.component.html',
  styleUrls: ['./custom-inspection-template.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomInspectionTemplateComponent implements OnInit, OnDestroy {
  /**
 * Variable which is used to display a dialog box when value is true.
 * @type {boolean}
 */
  display: boolean;
  /**
   * Variable which is used to define the inspectionHeaderId  from the parent component.
   * @type {number}
   */
  @Input() inspectionHeaderId: number;
  /**
   * Variable is used to define the Inspectionlist in the database.
   * @type {Inspection[]}
   */
  inspections: Inspection[];
  /**
   * Variable which is used to define the type of the inspectionHeader to be created.
   */
  templateTypes = [
    { label: 'Master', value: 'Master' },
    { label: 'Child', value: 'Child' }
  ];
  /**
   * Variable which is used to define the inspectionHeaderform.
   * @type {FormGroup}
   */
  templateInfoForm: FormGroup;
  /**
   * Variable which is used to check wherther the application running in devices or not.
   * @type {boolean}
   */
  mobileView: boolean;
  /**
  * Variable which is used to store the subscription and unsubscribe the store     *subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
     *Variable which is used to display the message like error, success etc.,
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
   * Component constructor which is used to inject the required services.
   * @param router To navigate the user to the desired routes.
   * @param inspectionStore To get the inspectiondetails.
   * @param dynamicInspectionService To get the add inspection details in the database.
   * @param offlineStorageService To find the app running in devices or not.
   * @param matomoService to perform metric operation on this component.
   * @param route To get the current activated route and route params.
   */
  constructor(private router: Router,
    private inspectionStore: InspectionStore,
    private dynamicInspectionService: DynamicInspectionService,
    private offlineStorageService: OfflineStorageService,
    private matomoService: MatomoService,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  /**
   * Component OnInit lifecycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // To get the current activated route parameters.
    this.subscriptionObject['routeParams'] = this.route.params.subscribe((params: Params) => {
      if (params && params['inspectionId']) {
        this.inspectionHeaderId = +params['inspectionId'];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // Initialisation of the templateform.
    this.templateInfoForm = new FormGroup({
      'name': new FormControl(null, Validators.required,
        CustomAsyncValidatorService.asyncTemplateValidator(this.dynamicInspectionService)),
      'description': new FormControl(null, Validators.required),
      'type': new FormControl(null, Validators.required)
    });
    // InspectionHeader details loaded.
    this.subscriptionObject['inspections'] = this.inspectionStore.inspections.subscribe((inspectionList) => {
      this.inspections = inspectionList;
      this.initForm();
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to init the form view.
   */
  initForm() {
    if (this.inspectionHeaderId && this.inspections) {
      let isDefault = true;
      this.inspections.find((item) => {
        if (item && item.isCustom === 1 && item.id === this.inspectionHeaderId) {
          this.templateInfoForm.setValue({
            'name': item.name,
            'description': item.instructions,
            'type': item.inspectionReportType
          });
          isDefault = false;
          return true;
        }
      });
      if (isDefault) {
        this.router.navigate(['app/inspection/createtemplate']);
      }
    }
  }
  /**
   * Method which is used to create the inspectionheader with the provided details.
   */
  onCreateTemplate() {
    this.inspections = [];
    const buttonName = 'Create Template';
    this.matomoService.addEvent(MatomoCategories.Form, MatomoActions.Click, buttonName);
    this.subscriptionObject['addInspectionHeader'] = this.dynamicInspectionService.addInspectionHeader(this.templateInfoForm.value.name,
      this.templateInfoForm.value.type, this.templateInfoForm.value.description).subscribe((data) => {
        console.log('data added properly');
        const inspectionHeaderId = data['inspectionHeader'].id;
        this.inspectionStore.addInspectionHeader(data['inspectionHeader']);
        if (inspectionHeaderId && this.inspections) {
          setTimeout(() => {
            this.router.navigate(['app/inspection', inspectionHeaderId, 'createsection', 0]);
          }, 2000);
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
  }
  /**
   * Method which is used to edit the inspectionheader with the provided details.
   */
  onEditTemplate(edit) {
    const buttonName = 'Edit Template';
    this.matomoService.addEvent(MatomoCategories.Form, MatomoActions.Click, buttonName);
    if (this.templateInfoForm && this.templateInfoForm.value) {
      this.inspectionStore.editInspectionHeader(this.inspectionHeaderId, this.templateInfoForm.value.name, this.templateInfoForm.value.type,
        this.templateInfoForm.value.description);
    }
    this.display = true;
    this.dialogBoxDetails = {
      header: this.messages.HEADER_MESSAGE,
      content: this.messages.TEMPLATE_EDIT,
      action: [{ label: 'Okay' }]
    };
  }
  /**
 * Method which is used to close the dialog box.
 * @param event local reference variable.
 */
  dialogBoxClose(event) {
    this.display = event;
  }
  /**
    * Component OnDestroy lifecycle hook.
    * Here we unsubscribe all the subscriptions done in the component.
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
