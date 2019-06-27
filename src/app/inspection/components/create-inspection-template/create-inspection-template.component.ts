// Component which is used to create inspection sections, questiona and inputtypeproperties for question display.
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DynamicInspectionService } from '../../../shared/services/dynamicInspection.service';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { InspectionSection } from '../../model/inspectionSection.model';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import * as _ from 'lodash';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { AuthService } from '../../../auth/services/auth.service';

/**
 * Component which is used to create inspectionsections and questions with drag and drop functionality.
 */
@Component({
  selector: 'app-create-inspection-template',
  templateUrl: './create-inspection-template.component.html',
  styleUrls: ['./create-inspection-template.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateInspectionTemplateComponent implements OnInit, OnDestroy {
  /**
  * Variable which is used to store the subscription and unsubscribe the stored subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to define the index of the dynamicField question.
   * @type {number}
   */
  dynamicFieldId: number;
  /**
   * fieldQuestionId is the index of the dynamicField Question.
   * @type {any}
   */
  fieldQuestionId = null;
  /**
   * dragname is the draggable element name.
   * @type {string}
   */
  dragname: string;
  /**
   * optiondialog is used to display the dialogbox with the option form.
   * @type {boolean}
   */
  optiondialog: boolean;
  /**
   * Variable which is used to store the current inspection related details.
   * inspectionName To define the newly created inspectionName.
   * currentQuestionId  defines the current question's index
   * sectionName To define the current sectionName.
   * nameEdited Used to denote whether to open the edit sectionName dialog.
   * inspectionHeaderId To define the id of the created inspectionHeader.
   * sectionId To define the created InspectionSectionId.
   * selectedOptionGroup To define the current selected optionGroup for the question.
   */
  currentInspection = {
    inspectionName: null,
    currentQuestionId: null,
    sectionName: null,
    nameEdited: null,
    inspectionHeaderId: null,
    sectionId: null,
    selectedOptionGroup: null
  };
  /**
   * optionChoices defines the options of the multiplechoice questions.
   * @type {any[]}
   */
  optionChoices = [];
  /**
   * formControlInfo defines the id's of the created questions and optionchoices.
   */
  formControlInfo = [];
  /**
   * Variable which is used to define the inspectionsections.
   * @type {any[]}
   */
  inspectionSections: InspectionSection[];
  /**
   * Variable which is used to define the current sectionId.
   * @type {number}
   */
  propertySectionId = 0;
  /**
   * Variable which is used to denote whether the entered details are saved or not.
   * @type {boolean}
   */
  detailsSaved: boolean;
  /**
   * Variable which is used to define the details of inputtypes that has been dragged.
   * @type {any}
   */
  draggedInputType: any;
  /**
   * Variable which is used to define the inputType property details.
   * @type {any}
   */
  inputTypeProperties = {};
  /**
   * Variable which is used to define the inputTypes deatils.
   * @type {any}
   */
  inputTypes: any;
  /**
   * Variable which is used to define the inputPropertyform.
   * @type {FormGroup}
   */
  inputPropertiesForm: FormGroup;
  /**
   * Variable which is used to denote whether to display the form preview or not.
   * @type {boolean}
   */
  formPreview: boolean;
  /**
   * Variable is used to define the inputcontrols that are dragged.
   * @type {any[]}
   */
  draggedFormControls = [];
  /**
   * Variable which defines the inputTypeProperty of the created question.
   * @type {any{}}
   */
  property = {};
  /**
   * Variable which is used to check whether the application running in devices or not.
   * @type {boolean}
   */
  mobileView = false;
  /**
   * Variable which is used to check whether the display of bottom view.
   * @type {boolean}
   */
  viewFieldList = false;
  /**
   * Variable which is used to check whether the edit section view or not.
   * @type {boolean}
   */
  sectionView = false;
  /**
   * Variable which is used to define the selected index tab.
   * @type {boolean}
   */
  tabIndex = 1;
  /**
   * Variable which is used to check whether to display preview page or not.
   * @type {boolean}
   */
  inspectionPreview: boolean;
  /**
   * Variable which is used to store the resource list data.
   */
  resources: [];
  /**
   * Variable which is used to define bottom container.
   */
  displayBottomContainer = 'BottomInputlistContainer';
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Users',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': false
  };
  /**
    * Variable which is used to define the current tab which is enabled.
    */
  firstTab = true;
  /**
     *Variable which is used to display the message like error, success etc.,
     */
  messages: any;
    /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'CREATE TEMPLATE';
  /**
  * Variable which is used to define the dialog box details.
  */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: [{ label: 'Okay' }]
  };
  unauthorized: boolean;
  /**
   * Constructor which is used to inject the required services.
   * @param route To fetch activated route and it's parameters.
   * @param inspectionStore To get the inspection details.
   * @param dynamicInspectionService To get inputtypes and inputtypeproperties.
   * @param matomoService to perform metric operation on this component.
   * @param offlineStorage To find the application running in device or not.
   * And to add the created input properties and questions to the database and also for editing the sectionName.
   */
  constructor(private route: ActivatedRoute,
    private inspectionStore: InspectionStore,
    private dynamicInspectionService: DynamicInspectionService,
    private offlineStorage: OfflineStorageService,
    private matomoService: MatomoService,
    private router: Router,
    private authService: AuthService) { }

  /**
   * Component OnInit lifecycle hook.
   */
  ngOnInit() {
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      if (this.messages) {
        this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });

    this.navbarDetails.header = 'Create Template';
    this.subscriptionObject['appMode'] = this.offlineStorage.applicationMode.subscribe((value: boolean) => {
      this.mobileView = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['focusMode'] = this.offlineStorage.focusMode.subscribe((focused) => {
      this.displayBottomContainer = focused;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.offlineStorage.focusMode.next('BottomInputlistContainer');
    // To get the current activated route parameters.
    this.subscriptionObject['route'] = this.route.params.subscribe((params: Params) => {
      if (params && params['inspectionId']) {
        this.currentInspection.inspectionHeaderId = +params['inspectionId'];
        // tslint:disable-next-line:max-line-length
        if (this.currentInspection && this.currentInspection.inspectionHeaderId !== null && this.currentInspection.inspectionHeaderId !== undefined) {
          this.navbarDetails.leftheader = 'Preview';
          this.navbarDetails.rightheader = 'Done';
        }
      } else {
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-chevron-left';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['resource'] = this.dynamicInspectionService.getResourceList().subscribe((res) => {
      this.resources = res;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['queryparam'] = this.route.params.subscribe((params: Params) => {
      if (params && params['preview']) {
        const isPreview = +params['preview'];
        this.formPreview = isPreview === 1 ? true : false;

        this.inspectionPreview = isPreview === 1 ? true : false;
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });

    if (!this.currentInspection.inspectionHeaderId) {
      this.tabIndex = 2;
    }

    // To get the newly created inspection header with it's sections.
    this.subscriptionObject['inspection'] = this.inspectionStore.inspections.subscribe((inspections) => {
      // this.inspections = inspections;
      if (inspections) {
        inspections.find((value) => {
          if (value && value.isCustom === 1 && value.id === this.currentInspection.inspectionHeaderId) {
            this.unauthorized = true;
            this.currentInspection.inspectionName = value.name;
            if (value && value.inspectionSections && value.inspectionSections.length > 0) {
              this.inspectionSections = value.inspectionSections;
              if (this.inspectionSections && this.inspectionSections.length > 0) {
                // this.initForm();
                if (this.currentInspection && this.currentInspection.sectionId === null || this.currentInspection.sectionId === undefined) {
                  this.changeCurrentSection(0);
                } else if (!this.mobileView) {
                  this.changeCurrentSection(this.inspectionSections.length - 1);
                }
              }
              // Initially we assign the first section details for the  section id and name.

            } else {
              const section = new InspectionSection(this.currentInspection.inspectionHeaderId, 'Section1', '', 0);
              this.inspectionStore.addInspectionSection(section);
            }
            return true;
          }
        });
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // To get the inputtypes details from the database.
    this.subscriptionObject['formInput'] = this.dynamicInspectionService.getFormInputTypes().subscribe((data) => {
      this.inputTypes = data['inputTypes'];
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }

  /**
   * Mthod which is used to initialise the inputProperties form.
   */
  initForm() {
    this.inputPropertiesForm = new FormGroup({
      'sections': new FormArray([])
    });
    // To check whether there is a questions available for the created sections.
    if (this.inspectionSections) {
      for (const section of this.inspectionSections) {
        (<FormArray>this.inputPropertiesForm.get('sections')).push(new FormGroup({
          'draggedcontrols': new FormArray([])
        }));
      }
    }
    // To get the current clicked section's details with the entered question.
    this.getCurrentSectionDetails();
  }
  /**
   * Method which is used to create the property control for the dynamic field's sub questions.
   * @param inputType The inputType that dragged.
   * @param propertyvalue The propertyValue of the control to be created.
   * @param dynamicFieldId The index of the current dynamicFieldQuestion.
   * @param optionValues The values of the optionchoices.
   */
  createDynamicFieldControl(inputType, propertyvalue, optionValues, dynamicFieldId) {
    if (dynamicFieldId !== null && dynamicFieldId !== undefined) {
      if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls'] &&
        this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId] &&
        this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'] && this.inputPropertiesForm.get('sections')['controls']
          [this.propertySectionId].get('draggedcontrols')['controls'][dynamicFieldId]
        && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls']) {

        const length = this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls'].length;
        const dynamicCtrlId = length > 0 ? length - 1 : 0;
        // subquestion's property formarray created.
        (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls'][dynamicCtrlId])
          .push(new FormGroup({ 'dynamicproperties': new FormArray([]) }));

        if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls'][dynamicCtrlId]) {
          const len = this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls'][dynamicCtrlId]
            .length;
          const propertyId = len > 0 ? len - 1 : 0;
          // Push each property of the question inside the created form array.
          for (let i = 0; i < this.inputTypeProperties[inputType.inputTypeName].length; i++) {
            if (this.inputTypeProperties[inputType.inputTypeName] && this.inputTypeProperties[inputType.inputTypeName][i]) {
              // If the control properties pushed in the edit scenario, then pushed with the values.
              if (this.inputTypeProperties[inputType.inputTypeName][i].propertyType !== 'stringarray') {
                const val = propertyvalue ? (propertyvalue[i] ? propertyvalue[i] : null) : null;
                (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                  .get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls']
                [dynamicCtrlId]['controls'][propertyId].get('dynamicproperties'))
                  .push(new FormControl(val));

              } else if (this.inputTypeProperties[inputType.inputTypeName][i].propertyType === 'stringarray') {
                if (this.draggedFormControls[dynamicFieldId] && this.draggedFormControls[dynamicFieldId].dynamicPro
                  && this.draggedFormControls[dynamicFieldId].dynamicPro[propertyId] &&
                  this.draggedFormControls[dynamicFieldId].dynamicPro[propertyId].selectedOption === 'Options From Resource') {
                  const optionGroupval = this.draggedFormControls[dynamicFieldId].dynamicPro[propertyId] ?
                    this.draggedFormControls[dynamicFieldId].dynamicPro[propertyId].selectedOptionGroup : null;
                  // tslint:disable-next-line:max-line-length
                  this.onOptionTypeSelected(inputType.inputTypeName, dynamicFieldId, dynamicCtrlId, propertyId, null, this.draggedFormControls[dynamicFieldId].dynamicPro[propertyId].selectedOption, optionGroupval);
                } else if (this.draggedFormControls[dynamicFieldId] && this.draggedFormControls[dynamicFieldId].dynamicPro
                  && this.draggedFormControls[dynamicFieldId].dynamicPro[propertyId] &&
                  this.draggedFormControls[dynamicFieldId].dynamicPro[propertyId].selectedOption === 'Fixed Options') {
                  // tslint:disable-next-line:max-line-length
                  this.onOptionTypeSelected(inputType.inputTypeName, dynamicFieldId, dynamicCtrlId, propertyId, null, this.draggedFormControls[dynamicFieldId].dynamicPro[propertyId].selectedOption, null);
                  if (optionValues && optionValues.length > 0) {
                    optionValues.forEach((option) => {
                      if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls'] &&
                        this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId] &&
                        this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                          // tslint:disable-next-line:max-line-length
                          .get('draggedcontrols')['controls'] && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                            .get('draggedcontrols')['controls'][dynamicFieldId] && this.inputPropertiesForm.get('sections')['controls']
                            [this.propertySectionId].get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls'] &&
                        this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls']
                        [dynamicFieldId].get('properties')['controls'][dynamicCtrlId] && this.inputPropertiesForm.get('sections')
                        ['controls'][this.propertySectionId].get('draggedcontrols')['controls'][dynamicFieldId].get('properties')
                        ['controls'][dynamicCtrlId]['controls'][propertyId] && this.inputPropertiesForm.get('sections')['controls']
                        [this.propertySectionId].get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls']
                        // tslint:disable-next-line:max-line-length
                        [dynamicCtrlId]['controls'][propertyId].get('dynamicproperties')['controls'] && this.inputPropertiesForm.get('sections')
                        ['controls'][this.propertySectionId].get('draggedcontrols')['controls'][dynamicFieldId].get('properties')
                        ['controls'][dynamicCtrlId]['controls'][propertyId].get('dynamicproperties')['controls'][i]) {

                        (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                          .get('draggedcontrols')['controls'][dynamicFieldId].get('properties')['controls']
                        [dynamicCtrlId]['controls'][propertyId].get('dynamicproperties')['controls'][i]
                          .get('options')).push(
                            new FormGroup({
                              'optionChoiceLabel': new FormControl(option.optionChoiceName),
                              'optionChoiceValue': new FormControl(option.optionChoicesValue)
                            })
                          );
                      }
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Method which is used to add new sections in the custom inspection headers.
   */
  addNewSection() {
    this.currentInspection.sectionName = 'Section' + (this.inspectionSections.length + 1);
    const section = new InspectionSection(this.currentInspection.inspectionHeaderId, this.currentInspection.sectionName, '', 0);
    // To add the sections for the newly created inspection header.
    this.inspectionStore.addInspectionSection(section);
    // And created the formArray inside the created section for inserting the questions.
    (<FormArray>this.inputPropertiesForm.get('sections')).push(new FormGroup({
      'draggedcontrols': new FormArray([])
    }));
    // Make the fieldQuestionId and dynamicFieldId null for the newly created section.
    this.fieldQuestionId = null;
    this.dynamicFieldId = null;
  }

  /**
   * Methos which is used to delete the dragged questions when the close icon clicked.
   * @param sectionId {number} parameter defines the current sectionId.
   * @param inputControlId {number} The id of the inputcontrol.
   * @param dynamicControlId {number} The id of the subquestion created inside the dynamicField control.
   * @return {void}
   */
  onDeleteQuestion(event, sectionId: number, inputControlId: number, dynamicControlId: number) {
    event.stopPropagation();
    this.propertySectionId = sectionId;
    if (this.draggedFormControls && this.draggedFormControls.length > 0 && this.draggedFormControls[inputControlId]) {
      let indexDetails;
      if (this.formControlInfo && this.formControlInfo[inputControlId] && this.formControlInfo[inputControlId].dynamicPro &&
        this.formControlInfo[inputControlId].dynamicPro[dynamicControlId] && dynamicControlId !== null) {
        indexDetails = this.formControlInfo[inputControlId].dynamicPro[dynamicControlId];
      } else if (this.formControlInfo && this.formControlInfo[inputControlId] && inputControlId !== null && dynamicControlId === null) {
        indexDetails = this.formControlInfo[inputControlId];
      }
      if (indexDetails) {
        this.subscriptionObject['delete'] = this.dynamicInspectionService.deleteInputProperty(indexDetails)
          .subscribe((res) => {
            console.log('property deleted successfully!', res);
            this.removeFormControl(sectionId, inputControlId, dynamicControlId);
          }, (err) => {
            if (err.error && err.error.error) {
              console.log('Error: ', err.error.error);
            }
          });
      } else {
        this.removeFormControl(sectionId, inputControlId, dynamicControlId);
      }
    }
    this.property = {};
  }
  /**
   * Method which is used to remove the input control from the form related to the question deleted.
   * @param sectionId {number} parameter defines the current sectionId.
   * @param inputControlId {number} The id of the inputcontrol.
   * @param dynamicControlId {number} The id of the subquestion created inside the dynamicField control.
   */
  removeFormControl(sectionId: number, inputControlId: number, dynamicControlId: number) {
    // Removing the control from the form.
    if (dynamicControlId === null || dynamicControlId === undefined) {
      this.formControlInfo.splice(inputControlId, 1);
      this.inputTypeProperties[this.draggedFormControls[inputControlId].inputTypeName].splice(inputControlId, 1);
      this.draggedFormControls.splice(inputControlId, 1);
    } else if (dynamicControlId !== null && dynamicControlId !== undefined) {
      if (this.formControlInfo && this.formControlInfo[inputControlId] && this.formControlInfo[inputControlId]
        .dynamicPro && this.formControlInfo[inputControlId].dynamicPro[dynamicControlId]) {
        this.formControlInfo[inputControlId].dynamicPro.splice(dynamicControlId, 1);
      }
      if (this.draggedFormControls && this.draggedFormControls[inputControlId] &&
        this.draggedFormControls[inputControlId].dynamicPro &&
        this.draggedFormControls[inputControlId].dynamicPro[dynamicControlId]) {
        this.inputTypeProperties[this.draggedFormControls[inputControlId].dynamicPro[dynamicControlId]
          .inputTypeName].splice(dynamicControlId, 1);

        this.draggedFormControls[inputControlId].dynamicPro.splice(dynamicControlId, 1);
      }
    }

    if (inputControlId >= 0 && dynamicControlId === null) {
      (<FormArray>this.inputPropertiesForm.get('sections')['controls'][sectionId]
        .get('draggedcontrols')).removeAt(inputControlId);
    } else if (this.dynamicFieldId === inputControlId && dynamicControlId === null) {
      const len = this.inputPropertiesForm.get('sections')['controls'][sectionId]
        .get('draggedcontrols')['controls'][inputControlId].get('properties')['controls'].length;
      const pid = len > 0 ? len - 1 : 0;
      (<FormArray>this.inputPropertiesForm.get('sections')['controls'][sectionId]
        .get('draggedcontrols')['controls'][inputControlId].get('properties')['controls'][pid]
      ).removeAt(inputControlId);

    } else if (this.dynamicFieldId === inputControlId && dynamicControlId !== null) {
      const len = this.inputPropertiesForm.get('sections')['controls'][sectionId]
        .get('draggedcontrols')['controls'][inputControlId].get('properties')['controls'].length;
      const pid = len > 0 ? len - 1 : 0;

      (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][inputControlId].get('properties')['controls']
      [pid]).removeAt(dynamicControlId);
    }
    if (this.dynamicFieldId === inputControlId && dynamicControlId === null) {
      this.dynamicFieldId = null;
      this.fieldQuestionId = null;
    }
    if (this.draggedFormControls && this.draggedFormControls.length === 0) {
      this.dynamicFieldId = null;
      this.fieldQuestionId = null;
    }
  }
  /**
   * Method which is used to save question and entered details in the database.
   * @param controlId {number} The index of the selected control.
   * @param cid {any} The index of the subquestion of the selected inputcontrol.
   * @return {void}
   */
  saveDetails(controlId, cid: number) {
    if (this.dynamicFieldId !== null && controlId !== this.dynamicFieldId && cid === null) {
      this.fieldQuestionId = null;
      this.dynamicFieldId = null;
    }
    if (this.property) {
      this.property['optionChoices'] = this.optionChoices ? (this.optionChoices.length > 0 ? this.optionChoices : null) : null;
      this.property['resourceId'] = this.currentInspection.selectedOptionGroup ? this.currentInspection.selectedOptionGroup.id : null;
      this.property['sectionId'] = this.currentInspection.sectionId;
    }
    if (this.formControlInfo && this.formControlInfo[controlId] && ((cid === null && this.formControlInfo[controlId]) ||
      (cid !== null && this.formControlInfo[controlId].dynamicPro &&
        this.formControlInfo[controlId].dynamicPro[cid]))) {
      if (this.property) {
        if (cid === null && this.dynamicFieldId === null && this.fieldQuestionId === null) {
          // tslint:disable-next-line:max-line-length
          this.subscriptionObject['update'] = this.dynamicInspectionService.updateInputproperties(this.formControlInfo[controlId], this.property)
            .subscribe((res) => {
              console.log('property updated!', res);
              if (res && res['response']) {
                this.formControlInfo[controlId]['optionChoiceId'] = res['response'];
              }
              this.dialogBoxDetails.content = this.messages.DETAIL_UPDATE;
              this.detailsSaved = true;
            }, (err) => {
              if (err.error && err.error.error) {
                console.log('Error: ', err.error.error);
              }
            });

        } else if (cid !== null && this.dynamicFieldId !== null && this.fieldQuestionId !== null) {
          let controlInfos;
          this.property['dynamicFieldId'] = this.fieldQuestionId;
          if (this.formControlInfo && this.formControlInfo[controlId] &&
            this.formControlInfo[controlId].dynamicPro && this.formControlInfo[controlId].dynamicPro[cid]) {
            controlInfos = this.formControlInfo[controlId].dynamicPro[cid];
          }
          // tslint:disable-next-line:max-line-length
          this.subscriptionObject['update'] = this.dynamicInspectionService.updateInputproperties(controlInfos, this.property)
            .subscribe((res) => {
              console.log('property updated!', res);
              if (res && res['response']) {
                this.formControlInfo[controlId].dynamicPro[cid]['optionChoiceId'] = res['response'];
              }
              this.dialogBoxDetails.content = this.messages.DETAIL_UPDATE;
              this.detailsSaved = true;
            }, (err) => {
              if (err.error && err.error.error) {
                console.log('Error: ', err.error.error);
              }
            });
        }
      }
    } else {
      if (this.property) {
        if (this.optionChoices && this.optionChoices.length > 0 && !this.currentInspection.selectedOptionGroup) {
          this.property['optionGroup'] = { optionGroupName: null };
        }
        this.property['position'] = controlId;
        if ((cid === null && this.dynamicFieldId === null && this.fieldQuestionId === null) ||
          (cid === null && this.draggedFormControls[controlId].inputTypeName === 'DynamicFieldModel')) {
          this.property['inputTypeId'] = this.draggedFormControls[controlId].id;
        } else if (cid !== null && this.dynamicFieldId !== null && this.fieldQuestionId !== null) {
          this.property['inputTypeId'] = this.draggedFormControls[controlId].dynamicPro[cid].id;
          this.property['dynamicFieldId'] = this.fieldQuestionId;
        }
        this.subscriptionObject['add'] = this.dynamicInspectionService.addInputTypeProperties(this.property)
          .subscribe((data) => {
            console.log('property added successfully!', data['response']);
            this.dialogBoxDetails.content = this.messages.DETAIL_SAVE;
            this.detailsSaved = true;
            if (this.dynamicFieldId !== null && this.dynamicFieldId !== undefined &&
              this.fieldQuestionId !== null && this.fieldQuestionId !== undefined && cid !== null) {
              if (this.formControlInfo && this.formControlInfo[controlId] && this.formControlInfo[controlId].dynamicPro) {
                this.formControlInfo[controlId].dynamicPro[cid] = data['response'];
                // tslint:disable-next-line:max-line-length
              } else if (this.formControlInfo && this.formControlInfo[controlId] && !this.formControlInfo[controlId].hasOwnProperty('dynamicPro')) {
                this.formControlInfo[controlId].dynamicPro = [data['response']];
              }
            } else if (cid === null) {
              this.formControlInfo[controlId] = data['response'];
              if (this.draggedFormControls && this.draggedFormControls[controlId] &&
                this.draggedFormControls[controlId].inputTypeName === 'DynamicFieldModel' &&
                cid === null && (this.fieldQuestionId === null)) {
                this.fieldQuestionId = data['response'].questionId;
              }
            }
          }, (err) => {
            if (err.error && err.error.error) {
              console.log('Error: ', err.error.error);
            }
          });
      }
    }
  }

  /**
   * Method which is used to edit the sectionName of the selected section.
   * @param editedName {string} The name to be edited.
   */
  editSectionName(editedName: string) {
    this.currentInspection.sectionName = editedName;
    this.currentInspection.nameEdited = false;
    // To edit the default sectionName in the database.
    // tslint:disable-next-line:max-line-length
    this.inspectionStore.editSectionName(this.currentInspection.inspectionHeaderId, this.currentInspection.sectionId, this.currentInspection.sectionName);
  }

  /**
   * Method which is used to change the current sectionName by clicking the particular section.
   * @param id {number} The index of the selected section.
   * @return {void}
   */
  changeCurrentSection(id: number) {
    this.currentInspection.sectionName = this.inspectionSections[id].sectionName;
    this.currentInspection.sectionId = this.inspectionSections[id].id;
    this.propertySectionId = id;
    this.draggedInputType = null;
    this.dragname = undefined;
    this.initForm();
  }

  /**
   * Method is triggered when the accordion tab has been opened.
   * @param event It has the event that triggered when the tab opened.
   * @param id {number} the index of the selected inputcontrol.
   * @return {void}
   */
  onTabOpen(event, id: number) {
    this.currentInspection.selectedOptionGroup = null;

    this.property['validator'] = [];
    if (event) {
      if (this.fieldQuestionId !== null) {
        this.dragname = 'dynamicFieldDrag';
      }
      // If the Opened tab's question is the dynamicField question, then define the fieldQuestionId and dynamicField
      // Id for that.
      if (this.draggedFormControls && this.draggedFormControls[id] &&
        this.draggedFormControls[id].inputTypeName === 'DynamicFieldModel') {
        this.dynamicFieldId = id;
        if (this.fieldQuestionId === null || this.fieldQuestionId === undefined) {
          if (this.formControlInfo && this.formControlInfo[id] && this.formControlInfo[id].questionId !== null
            && this.formControlInfo[id].questionId !== undefined) {
            this.fieldQuestionId = this.formControlInfo[id].questionId;
          }
        }
      }

    } else if (!event) {
      if (this.fieldQuestionId !== null && this.dynamicFieldId !== null) {
        this.dragname = 'inputTypes';
      }
      this.dynamicFieldId = null;
      this.fieldQuestionId = null;
    }
  }
  /**
   * Method which is used to get the current selected section's details with the created questions and the inputcontrols.
   * @return {void}
   */
  getCurrentSectionDetails() {
    this.fieldQuestionId = null;
    this.dynamicFieldId = null;
    this.draggedFormControls = [];
    this.formControlInfo = [];
    let inspectionData = [];
    let idx = -1; // The index of the dragged controls.
    if (this.currentInspection && this.currentInspection.inspectionHeaderId && this.currentInspection.sectionId) {
      // get the current selected section's questions with inputproperties from the database.
      // tslint:disable-next-line:max-line-length
      this.subscriptionObject['sectionDetails'] = this.dynamicInspectionService.getSectionDetails(this.currentInspection.inspectionHeaderId, this.currentInspection.sectionId)
        .subscribe((data) => {
          inspectionData = _.cloneDeep(data['inspectionSection']);
          if (inspectionData && inspectionData.length > 0) {
            inspectionData.forEach((value) => {
              // process the questions inside the sections.
              if (value && value.questions && value.questions.length > 0) {
                value.questions.forEach((item, id) => {
                  const dynamicQusIds = {
                    'inputPropertyId': null,
                    'optionGroupId': null,
                    'optionChoiceId': [],
                    'validatorId': [],
                    'resourceId': null,
                    'questionId': null,
                    'resourceName': null
                  };
                  let selectedOption = null;
                  if (item) {
                    this.draggedInputType = item.inputType;
                    this.getInputTypeProperties(item.inputTypeId, item.inputType).then((sfd) => {
                      const inputType = {
                        'id': item.inputTypeId, 'iconName': item.inputType.iconName,
                        'inputTypeName': item.inputType.inputTypeName,
                        'validators': item.validators
                      };
                      dynamicQusIds.questionId = _.cloneDeep(item.id);
                      if (item && item.validators) {
                        dynamicQusIds.validatorId = [];
                        item.validators.forEach((validator) => {
                          dynamicQusIds.validatorId.push(_.cloneDeep(validator.id));
                        });
                      }
                      if (item && item.inputTypesProperty) {
                        dynamicQusIds.inputPropertyId = _.cloneDeep(item.inputTypesProperty.propertyId);
                      }
                      if (item.optionGroupId !== null && item.optionGroupId !== undefined && item.optionGroup) {
                        if (item.optionGroup.isResource !== 1) {
                          selectedOption = 'Fixed Options';
                          if (item.optionGroup && item.optionGroup.id === item.optionGroupId) {
                            if (item.optionGroup.optionChoices && item.optionGroup.optionChoices.length > 0) {
                              this.optionChoices = [];
                              item.optionGroup.optionChoices.forEach((options) => {
                                this.optionChoices.push({
                                  optionChoiceName: options.optionChoiceName,
                                  optionChoicesValue: options.optionChoicesValue,
                                  id: _.cloneDeep(options.id),
                                  questionId: item.id
                                });
                                dynamicQusIds.optionChoiceId.push(_.cloneDeep(options.id));
                              });
                            }
                            dynamicQusIds.optionGroupId = _.cloneDeep(item.optionGroupId);
                          }
                        } else if (item && item.optionGroup && item.optionGroup.isResource === 1) {
                          selectedOption = 'Options From Resource';
                          this.currentInspection.selectedOptionGroup = _.cloneDeep(item.optionGroup);
                          dynamicQusIds.resourceId = _.cloneDeep(item.optionGroupId);
                          dynamicQusIds.resourceName = _.cloneDeep(item.optionGroupName);
                        }
                      }

                      // If the question are not the subquestions, then store the question's id in the formcontrolInfo
                      // and the inputType details in the draggedcontrols array .
                      if ((item.dynamicFieldQuestionId === null || item.dynamicFieldQuestionId === undefined)) {
                        idx++;
                        this.fieldQuestionId = null;
                        this.dynamicFieldId = null;
                        this.draggedFormControls[idx] = _.cloneDeep(inputType);
                        this.draggedFormControls[idx].selectedOption = selectedOption;
                        this.draggedFormControls[idx].selectedOptionGroup = this.currentInspection.selectedOptionGroup;
                        this.formControlInfo[idx] = dynamicQusIds;
                        // Adding properties formArray for inserting properties of each question.
                        (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                          .get('draggedcontrols')).push(new FormGroup({
                            'properties': new FormArray([])
                          }));
                      }
                      const pvalue = [];
                      // Mapping the inputProperties with the current questions properties and get the current
                      // question's property values with that.
                      if (this.inputTypeProperties[item.inputType.inputTypeName] &&
                        this.inputTypeProperties[item.inputType.inputTypeName].length > 0
                        && item.inputTypesProperty) {
                        this.inputTypeProperties[item.inputType.inputTypeName].forEach((inputproperty, pid) => {
                          let val;
                          if (inputproperty && !item.inputTypesProperty[inputproperty.propertyName]) {
                            item.validators.forEach((list) => {
                              if (list.keyName === inputproperty.propertyName) {
                                if (list.keyValue === null) {
                                  list.keyValue = true;
                                }
                                val = list.keyValue;
                              }
                            });
                          } else if (inputproperty) {
                            val = item.inputTypesProperty[inputproperty.propertyName];
                          }
                          if (item.dynamicFieldQuestionId !== null && item.dynamicFieldQuestionId !== undefined) {
                            // If the question is the subquestion then the values pushed inside the pvalue.
                            pvalue.push(val);
                          }
                          // If the question is the question in the section then create a property with the
                          // value got.
                          if ((item.dynamicFieldQuestionId === null
                            || item.dynamicFieldQuestionId === undefined) && item && item.inputType) {
                            if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls']
                              && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                              && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                                .get('draggedcontrols')['controls'][idx] && this.inputPropertiesForm
                                  .get('sections')['controls'][this.propertySectionId]
                                  .get('draggedcontrols')['controls'][idx].get('properties')['controls'] &&
                              this.inputTypeProperties[item.inputType.inputTypeName][pid]) {
                              // tslint:disable-next-line:max-line-length
                              if (this.inputTypeProperties && this.inputTypeProperties[item.inputType.inputTypeName][pid].propertyType !== 'stringarray') {
                                (<FormArray>this.inputPropertiesForm.get('sections')['controls']
                                [this.propertySectionId].get('draggedcontrols')['controls'][idx]
                                  .get('properties')).push(new FormControl(val));
                                // tslint:disable-next-line:max-line-length
                              } else if (this.inputTypeProperties && this.inputTypeProperties[item.inputType.inputTypeName][pid].propertyType === 'stringarray') {
                                // tslint:disable-next-line:max-line-length
                                if (this.draggedFormControls && this.draggedFormControls[idx] && this.draggedFormControls[idx].selectedOption === 'Fixed Options') {
                                  this.onOptionTypeSelected(inputType.inputTypeName, idx, null, null, null, selectedOption, null);
                                  if (item.optionGroup && item.optionGroup.optionChoices
                                    && !item.dynamicFieldQuestionId && item.optionGroup.isResource !== 1) {
                                    item.optionGroup.optionChoices.forEach((option) => {
                                      if (this.inputPropertiesForm.get('sections')['controls']
                                      [this.propertySectionId].get('draggedcontrols')['controls'][idx]
                                        .get('properties')['controls'][pid].get('options')) {
                                        (<FormArray>this.inputPropertiesForm.get('sections')['controls']
                                        [this.propertySectionId].get('draggedcontrols')['controls'][idx]
                                          .get('properties')['controls'][pid].get('options')).push(
                                            new FormGroup({
                                              'optionChoiceLabel': new FormControl(option.optionChoiceName),
                                              'optionChoiceValue': new FormControl(option.optionChoicesValue)
                                            })
                                          );
                                      }
                                    });
                                  }
                                } else if (this.draggedFormControls[idx]
                                  && this.draggedFormControls[idx].selectedOption === 'Options From Resource') {
                                  // tslint:disable-next-line:max-line-length
                                  this.onOptionTypeSelected(inputType.inputTypeName, idx, null, null, null, selectedOption, this.draggedFormControls[idx].selectedOptionGroup);
                                }
                              }
                            }
                          }
                        });

                      }
                      // If the question is the dynamic field question then create the formarray for pushing the
                      // subquestions.
                      if (item && item.inputType && item.inputType.inputTypeName === 'DynamicFieldModel' && this.draggedFormControls) {
                        this.fieldQuestionId = item.id;
                        this.dynamicFieldId = this.draggedFormControls.length > 0 ?
                          this.draggedFormControls.length - 1 : null;
                        if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls'] &&
                          this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId] &&
                          this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                            .get('draggedcontrols')['controls'] && this.inputPropertiesForm.get('sections')
                            ['controls'][this.propertySectionId].get('draggedcontrols')['controls'][idx]
                          && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                            .get('draggedcontrols')['controls'][idx].get('properties')) {

                          (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                            .get('draggedcontrols')['controls'][idx].get('properties')).push(new FormArray([]));

                        }
                      }
                      /// Add the subquestion's inputtypes in the draggedformcontrols.
                      if (item && item.dynamicFieldQuestionId !== null && item.dynamicFieldQuestionId !== undefined) {
                        if (this.draggedFormControls && this.draggedFormControls[this.dynamicFieldId]) {
                          if (this.draggedFormControls[this.dynamicFieldId].dynamicPro
                            && this.draggedFormControls[this.dynamicFieldId].dynamicPro.length > 0) {
                            this.draggedFormControls[this.dynamicFieldId].dynamicPro.push(_.cloneDeep(inputType));
                            const qusId = this.draggedFormControls[this.dynamicFieldId].dynamicPro.length - 1;
                            this.draggedFormControls[this.dynamicFieldId].dynamicPro[qusId].selectedOption = selectedOption;
                            // tslint:disable-next-line:max-line-length
                            this.draggedFormControls[this.dynamicFieldId].dynamicPro[qusId].selectedOptionGroup = this.currentInspection.selectedOptionGroup;
                          } else {
                            this.draggedFormControls[this.dynamicFieldId].dynamicPro = [_.cloneDeep(inputType)];
                            this.draggedFormControls[this.dynamicFieldId].dynamicPro[0].selectedOption = selectedOption;
                            // tslint:disable-next-line:max-line-length
                            this.draggedFormControls[this.dynamicFieldId].dynamicPro[0].selectedOptionGroup = this.currentInspection.selectedOptionGroup;

                          }
                        }

                        /// Add the dynamicQusIds in the formcontrolInfo.
                        if (this.formControlInfo && this.formControlInfo[this.dynamicFieldId] &&
                          this.formControlInfo[this.dynamicFieldId].dynamicPro &&
                          this.formControlInfo[this.dynamicFieldId].dynamicPro.length > 0) {
                          this.formControlInfo[this.dynamicFieldId].dynamicPro
                            .push(_.cloneDeep(dynamicQusIds));
                        } else if (this.formControlInfo[this.dynamicFieldId]) {
                          this.formControlInfo[this.dynamicFieldId].dynamicPro = [_.cloneDeep(dynamicQusIds)];
                        } else {
                          this.formControlInfo[this.dynamicFieldId] = {
                            'dynamicPro':
                              [_.cloneDeep(dynamicQusIds)]
                          };
                        }
                        if (this.fieldQuestionId !== null && this.fieldQuestionId !== undefined) {
                          this.createDynamicFieldControl(item.inputType, pvalue, this.optionChoices, this.dynamicFieldId);
                        }
                        if (value && value.questions && value.questions.length - 1 === id && this.dragname === undefined) {
                          this.dynamicFieldId = null;
                          this.fieldQuestionId = null;
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error: ', err.error.error);
          }
        });
    }
  }

  /**
   * Method which is used to save the question entered by user.
   * @param id {number} The index of the dragged input control.
   * @param pid {number} The index of the dragged input's property.
   * @param cid {number} The index of the dragged sub input control.
   * @param cpid {number} The index of the dragged sub input control's property.
   * @param currentinput {string} The name of the current draged inputtype's property.
   * @return {void}
   */
  onTypeQuestion(id: number, pid: number, cid: number, cpid: number, currentInput: string) {
    if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls']
      && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]) {
      // tslint:disable-next-line:max-line-length
      if (this.inputTypeProperties && this.inputTypeProperties[currentInput][pid] && this.inputTypeProperties[currentInput][pid].propertyName
        && cid === null && cpid === null) {
        // tslint:disable-next-line:max-line-length
        if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'] &&
          this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'][id]
          && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][id].get('properties')['controls'] &&
          this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid]) {
          // To check whether the incoming property is design property or the validator property.
          if (this.inputTypeProperties && this.inputTypeProperties[currentInput][pid].isValidator === 0) {
            // If the inputproperty type is boolean then get the value from the dropdown of the formcontrol.
            if (this.inputTypeProperties && this.inputTypeProperties[currentInput][pid].propertyType === 'stringarray') {
              if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid]
                .get('options')['controls'] && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                  .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid]
                  .get('options')['controls'].length === 0) {
                (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                  .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid].get('options')).push(
                    new FormGroup({
                      'optionChoiceLabel': new FormControl(null),
                      'optionChoiceValue': new FormControl(null)
                    })
                  );
              }
              this.currentInspection.currentQuestionId = id;
              this.optiondialog = true;
              // For get the value for the selected inputcontrol.
            } else {
              this.property[this.inputTypeProperties[currentInput][pid].propertyName] =
                this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                  .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid].value;
            }
          } else if (this.inputTypeProperties && this.inputTypeProperties[currentInput][pid].isValidator === 1) {
            let validatorObj = {};
            if (this.inputTypeProperties && this.inputTypeProperties[currentInput][pid].propertyName === 'required') {
              if (this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid].value === true) {
                validatorObj = {
                  keyName: this.inputTypeProperties[currentInput][pid].propertyName,
                  errorMessage: this.inputTypeProperties[currentInput][pid].errorMessage
                };
              } else {
                validatorObj = { keyName: this.inputTypeProperties[currentInput][pid].propertyName };
              }
            }
            if (this.inputTypeProperties[currentInput][pid].propertyName !== 'required') {
              if (this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid].value !== null) {
                validatorObj = {
                  keyName: this.inputTypeProperties[currentInput][pid].propertyName,
                  keyValue: this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                    .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid].value,
                  errorMessage: this.inputTypeProperties[currentInput][pid].errorMessage
                };
              } else {
                validatorObj = { keyName: this.inputTypeProperties[currentInput][pid].propertyName };
              }
            }
            if (this.property['validator'] && validatorObj) {
              const vid = this.inputTypeProperties[currentInput].length - pid - 2 > 0 ?
                this.inputTypeProperties[currentInput].length - pid - 2 : 0;
              this.property['validator'][vid] = validatorObj;
            }
          }
        }
        // If the question value entered is the subquestion then get the value from the subquestion input control.
      } else if (cpid !== null && this.inputTypeProperties[currentInput][cpid] &&
        this.inputTypeProperties[currentInput][cpid].propertyName) {
        if (this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'][id]
          && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid] && this.inputPropertiesForm
              .get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'][id]
              .get('properties')['controls'][pid]['controls'][cid] && this.inputPropertiesForm
                .get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'][id]
                .get('properties')['controls'][pid]['controls'][cid].get('dynamicproperties')['controls'][cpid]) {
          if (this.inputTypeProperties[currentInput][cpid].isValidator === 0) {
            if (this.inputTypeProperties[currentInput][cpid].propertyType === 'stringarray') {
              if (this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid] &&
                this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                  .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid]['controls'][cid]
                  .get('dynamicproperties')['controls'][cpid] !== undefined &&
                this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                  .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid]['controls'][cid]
                  .get('dynamicproperties')['controls'][cpid].get('options')['controls'].length === 0) {
                (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                  .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid]['controls'][cid]
                  .get('dynamicproperties')['controls'][cpid].get('options')).push(
                    new FormGroup({
                      'optionChoiceLabel': new FormControl(null),
                      'optionChoiceValue': new FormControl(null)
                    })
                  );
              }
              this.currentInspection.currentQuestionId = cid;
              this.optiondialog = true;
            } else {
              this.property[this.inputTypeProperties[currentInput][cpid].propertyName] =
                this.inputPropertiesForm
                  .get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'][id]
                  .get('properties')['controls'][pid]['controls'][cid].get('dynamicproperties')['controls'][cpid].value;
            }
          } else if (this.inputTypeProperties[currentInput][cpid].isValidator === 1) {
            let validatorObj = {};
            if (this.inputTypeProperties[currentInput][cpid].propertyName === 'required') {
              if (this.inputPropertiesForm
                .get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'][id]
                .get('properties')['controls'][pid]['controls'][cid].get('dynamicproperties')['controls'][cpid].value === true) {
                validatorObj = {
                  keyName: this.inputTypeProperties[currentInput][cpid].propertyName,
                  errorMessage: this.inputTypeProperties[currentInput][cpid].errorMessage
                };
              } else {
                validatorObj = { keyName: this.inputTypeProperties[currentInput][cpid].propertyName, };
              }
            }
            if (this.inputTypeProperties[currentInput][cpid].propertyName !== 'required') {
              if (this.inputPropertiesForm
                .get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'][id]
                .get('properties')['controls'][pid]['controls'][cid].get('dynamicproperties')['controls'][cpid].value !== null) {
                validatorObj = {
                  keyName: this.inputTypeProperties[currentInput][cpid].propertyName,
                  keyValue: this.inputPropertiesForm
                    .get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls'][id]
                    .get('properties')['controls'][pid]['controls'][cid].get('dynamicproperties')['controls'][cpid].value,
                  errorMessage: this.inputTypeProperties[currentInput][cpid].errorMessage
                };
              } else {
                validatorObj = {
                  keyName: this.inputTypeProperties[currentInput][cpid].propertyName
                };
              }

            }
            if (this.property['validator'] && validatorObj) {
              const vid = this.inputTypeProperties[currentInput].length - cpid - 2 > 0 ?
                this.inputTypeProperties[currentInput].length - cpid - 2 : 0;
              this.property['validator'][vid] = validatorObj;
            }
          }
        }
      }
    }
    // tslint:disable-next-line:max-line-length
    if (this.draggedFormControls && this.draggedFormControls[id] && this.draggedFormControls[id].inputTypeName === 'DynamicImageModel'
      || this.draggedFormControls[id].inputTypeName === 'DynamicCustomSignatureModel') {
      this.property['inputType'] = 'image';
    }
    // assign label as a id for the inputproperty,].
    if (this.property['label']) {
      this.property['id'] = this.property['label'];
    }
    if (this.property['']) {
      this.property['id'] = this.property[''];
    }
    this.property['validator'] = this.property['validator'];
  }

  /**
   * For adding optionchoices for the questions in the form.
   * @param id current input control id.
   * @param pid current input property id.
   * @param cid current dynamic input control id.
   * @param cpid current dynamic input property id.
   * @return {void}
   */
  addOptions(id: number, pid: number, cid: number, cpid: number) {
    if (pid !== null && cpid === null) {
      (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid]
        .get('options')['controls']).push(
          new FormGroup({
            'optionChoiceLabel': new FormControl(null),
            'optionChoiceValue': new FormControl(null)
          })
        );
    } else if (cpid !== null) {
      (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][id].get('properties')['controls'][pid]['controls'][cid]
        .get('dynamicproperties')['controls'][cpid].get('options')['controls']).push(
          new FormGroup({
            'optionChoiceLabel': new FormControl(null),
            'optionChoiceValue': new FormControl(null)
          })
        );
    }
  }
  /**
   * Method which is used to save the entered options in the optionchoices.
   * @param index {number} The index of the option.
   * @param qid {number} The index of the question.
   * @param pid {number} The index of that property.
   * @param dqid {number} The index of the dynamic question.
   * @param dpid {number} The index of that dynamic question's property.
   */
  saveOptions(qid: number, pid: number, dqid: number, dpid: number) {
    this.optionChoices = [];
    this.optiondialog = false;
    if (dqid === null && dpid === null) {
      const len = this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]
        .get('options')['controls'].length;
      for (let i = 0; i < len; i++) {
        this.optionChoices.push({
          optionChoiceName: this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]
            .get('options')['controls'][i].get('optionChoiceLabel').value,
          optionChoicesValue: this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]
            .get('options')['controls'][i].get('optionChoiceValue').value
        });
        if (this.formControlInfo[qid] && this.formControlInfo[qid].optionChoiceId && this.formControlInfo[qid].optionChoiceId[i]
          && this.formControlInfo[qid].optionChoiceId[i]) {
          this.optionChoices[i].id = this.formControlInfo[qid].optionChoiceId[i];
        }
      }
    } else if (dqid !== null && dpid !== null) {
      const len = this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]['controls'][dqid]
        .get('dynamicproperties')['controls'][dpid].get('options')['controls'].length;
      for (let i = 0; i < len; i++) {
        this.optionChoices.push({
          optionChoiceName: this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]['controls'][dqid]
            .get('dynamicproperties')['controls'][dpid].get('options')['controls'][i].get('optionChoiceLabel').value,
          optionChoicesValue: this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]['controls'][dqid]
            .get('dynamicproperties')['controls'][dpid].get('options')['controls'][i].get('optionChoiceValue').value
        });
        if (this.formControlInfo[qid] && this.formControlInfo[qid].dynamicPro
          && this.formControlInfo[qid].dynamicPro[dqid] && this.formControlInfo[qid].dynamicPro[dqid].optionChoiceId &&
          this.formControlInfo[qid].dynamicPro[dqid].optionChoiceId[i]) {
          this.optionChoices[i].id = this.formControlInfo[qid].dynamicPro[dqid].optionChoiceId[i];
        }
      }
    }
  }
  /**
   * Method which is used to remove the deleted options in the optionchoices.
   * @param index {number} The index of the option.
   * @param qid {number} The index of the question.
   * @param pid {number} The index of that property.
   * @param dqid {number} The index of the dynamic question.
   * @param dpid {number} The index of that dynamic question's property.
   */
  removeOptions(qid: number, pid: number, dqid: number, dpid: number, index: number) {
    if (dqid === null && dpid === null) {
      if (this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]
        .get('options')['controls'].length === 1) {
        this.dialogBoxDetails.content = this.messages.OPTION_CHOICE_ERROR;
        this.detailsSaved = true;
      } else if (this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]
        .get('options')['controls'].length > 1) {

        this.optionChoices.splice(index, 1);
        (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]
          .get('options')).removeAt(index);
      }
      if (this.formControlInfo[qid] && this.formControlInfo[qid].optionChoiceId &&
        this.formControlInfo[qid].optionChoiceId.length > 0) {
        // tslint:disable-next-line:max-line-length
        this.subscriptionObject['deleteOptions'] = this.dynamicInspectionService.deleteOptionChoices(this.formControlInfo[qid].optionChoiceId[index])
          .subscribe((res) => {
            console.log('option choices deleted successfully!', res);
            this.formControlInfo[qid].optionChoiceId.splice(index, 1);
          }, (err) => {
            if (err.error && err.error.error) {
              console.log('Error: ', err.error.error);
            }
          });
      }
    } else if (dqid !== null && dpid !== null) {
      if (this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]['controls'][dqid]
        .get('dynamicproperties')['controls'][dpid].get('options')['controls'].length > 0) {
        this.optionChoices.splice(index, 1);
        (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][qid].get('properties')['controls'][pid]['controls'][dqid]
          .get('dynamicproperties')['controls'][dpid].get('options')).removeAt(index);
      }
      if (this.formControlInfo[qid] && this.formControlInfo[qid].dynamicPro &&
        this.formControlInfo[qid].dynamicPro[dqid] && this.formControlInfo[qid].dynamicPro[dqid].optionChoiceId &&
        this.formControlInfo[qid].dynamicPro[dqid].optionChoiceId.length > 0) {
        // tslint:disable-next-line:max-line-length
        this.subscriptionObject['delOptions'] = this.dynamicInspectionService.deleteOptionChoices(this.formControlInfo[qid].dynamicPro[dqid].optionChoiceId[index])
          .subscribe((res) => {
            console.log('option choices deleted successfully!', res);
            this.formControlInfo[qid].dynamicPro[dqid].optionChoiceId.splice(index, 1);
          }, (err) => {
            if (err.error && err.error.error) {
              console.log('Error: ', err.error.error);
            }
          });
      }
    }
  }
  /**
   * Component OnDestroy lifecycle hook.
   * Here we unsubscribe all the subscriptions done in the component.
   */
  ngOnDestroy() {
    this.offlineStorage.focusMode.next(false);
    if (this.subscriptionObject) {
      for (const subscriptionProperty in this.subscriptionObject) {
        if (this.subscriptionObject[subscriptionProperty]) {
          this.subscriptionObject[subscriptionProperty].unsubscribe();
        }
      }
    }
  }

  /**
   * Method which is used to trigger a method when the element to drag clicked or touched.
   */
  onPan(event) {
    console.log('on pan event!');
  }
  /**
   * Method which get the form structure information from the database and assign that in the form Variable.
   * @return {void}
   */
  onPanStart(event) {
    this.currentInspection.selectedOptionGroup = null;
    this.property = {};
    this.property['validator'] = [];
    if (this.dynamicFieldId !== null && this.dynamicFieldId !== undefined) {
      this.dragname = 'dynamicFieldDrag';
    }
  }
  /**
   * Method which is triggered when the draged element move.
   */
  onPanMove(event) {
    console.log('on panmove event!');

  }
  /**
   * Method which get the control that is being dragged.
   * @param event Parameter defines the event that trggered when the dragend.
   * @param inputType Parameter defines the control that dragged.
   * @return {void}
   */
  onPanEnd(event, inputType) {
    this.currentInspection.selectedOptionGroup = null;
    this.property = {};
    this.property['validator'] = [];
    if (this.dynamicFieldId !== null && this.dynamicFieldId !== undefined) {
      this.dragname = 'dynamicFieldDrag';
    }
    this.optionChoices = [];
    let controlcreated;
    // pushing the draged inputTypes into the array for reference.
    // If the drgaed control is not belongs to the dynamicField then push it normally.
    if (this.inputPropertiesForm) {
      if (this.dynamicFieldId === null || this.dynamicFieldId === undefined) {
        this.draggedFormControls.push(_.cloneDeep(inputType));
      } else {
        // tslint:disable-next-line:max-line-length
        // If the drgaed control is belongs to the dynamicField then push it in the dynamicField reference of the dragedControls.
        if (this.draggedFormControls[this.dynamicFieldId] && this.draggedFormControls[this.dynamicFieldId].dynamicPro
          && this.draggedFormControls[this.dynamicFieldId].dynamicPro.length > 0) {
          this.draggedFormControls[this.dynamicFieldId].dynamicPro.push(_.cloneDeep(inputType));
        } else if (this.draggedFormControls[this.dynamicFieldId]) {
          this.draggedFormControls[this.dynamicFieldId].dynamicPro = [_.cloneDeep(inputType)];
        } else {
          this.draggedFormControls[this.dynamicFieldId] = { 'dynamicPro': _.cloneDeep(inputType) };
        }
      }

      // Get the inputType properties for the dragged inputTypes.
      this.getInputTypeProperties(inputType.id, inputType).then((data) => {
        if (this.propertySectionId !== null && this.inputPropertiesForm && this.inputPropertiesForm.get('sections')['controls']) {
          controlcreated = true;
          // If the current dragged inputcontrol is not an subquestion then add the properties inside the
          // properties formarray.
          if (this.dynamicFieldId === null || this.dynamicFieldId === undefined) {
            (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
              .get('draggedcontrols')).push(new FormGroup({
                'properties': new FormArray([])
              }));
          }
          // If the current dragged inputcontrol is the dynamicfield question then add subcategory formArray for that.
          if (inputType && inputType.inputTypeName === 'DynamicFieldModel') {
            this.dynamicFieldId = this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
              .get('draggedcontrols')['controls'].length - 1;
          }
        }
        // Make the dragged inputType as the current inputType.
        this.draggedInputType = inputType;
        if (this.inputTypeProperties && controlcreated && this.inputPropertiesForm
          && this.inputPropertiesForm.get('sections')['controls'] && this.inputPropertiesForm
            .get('sections')['controls'][this.propertySectionId].get('draggedcontrols')['controls']) {

          const index = this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'].length > 0 ? this.inputPropertiesForm
              .get('sections')['controls'][this.propertySectionId]
              .get('draggedcontrols')['controls'].length - 1 : 0;
          if (index !== null && controlcreated && this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][index] && this.inputPropertiesForm.get('sections')['controls']
            [this.propertySectionId].get('draggedcontrols')['controls'][index].get('properties')['controls'].length === 0) {

            // If the fieldQuestion is not added then the controls are pushed inside the normal dynamicForm.
            if (inputType && inputType.inputTypeName) {
              for (let i = 0; i < this.inputTypeProperties[inputType.inputTypeName].length; i++) {
                if (this.inputTypeProperties[inputType.inputTypeName][i] &&
                  this.inputTypeProperties[inputType.inputTypeName][i].propertyType !== 'stringarray') {
                  (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                    .get('draggedcontrols')['controls'][index].get('properties')).push(new FormControl(null));

                }
              }
            }
            // Create the form array subquestion properties inside the dynamicField Question's properties.
            if (this.draggedInputType.inputTypeName === 'DynamicFieldModel') {
              (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
                .get('draggedcontrols')['controls'][index].get('properties')).push(
                  new FormArray([]));
            }
          }
          // Creating The properties formarray for pushing each subcategory question's properties.
          if (this.dynamicFieldId !== null && this.dynamicFieldId !== undefined && this.dragname === 'dynamicFieldDrag') {
            this.createDynamicFieldControl(inputType, [], [], this.dynamicFieldId);
          }
        }
      });
    }
  }
  /**
   * Method which is used to get the input properties of the selected input type.
   * @param inputTypeId Id of the selected input type.
   * @param inputType The details of the selected input type.
   */
  getInputTypeProperties(inputTypeId, inputType) {
    return new Promise((resolve, reject) => {
      this.subscriptionObject['formInputProperty'] = this.dynamicInspectionService.getFormInputTypeModelProperties(inputTypeId)
        .subscribe((data) => {
          const inputTypeProperties = [];
          let propertyCopy;
          data['inputModelProperties'].forEach((property) => {
            if (property.propertyType !== 'stringarray') {
              inputTypeProperties.push(property);
            } else if (property.propertyType === 'stringarray') {
              propertyCopy = property;
            }
          });
          inputTypeProperties.push(propertyCopy);
          if (inputTypeProperties) {
            this.inputTypeProperties[inputType.inputTypeName] = inputTypeProperties;
          }
          resolve(true);
        }, (err) => {
          reject(false);
        });
    });
  }
  /**
   * Method which is used to delete a section.
   * @param event Parameter defines the event that triggered when the delete button is clicked.
   * @param index The index of the section to be deleted.
   */
  deleteSection(event, index: number) {
    event.stopPropagation();
    if (this.inspectionSections.length > 0 && index > 0) {
      this.inspectionStore.deleteInspectionSection(this.inspectionSections[index].id);
      this.inspectionSections.splice(index, 1);
      this.currentInspection.sectionName = this.inspectionSections[index - 1].sectionName;
      this.propertySectionId = index - 1;
    } else {
      this.dialogBoxDetails.content = this.messages.DEFAULT_SECTION;
      this.detailsSaved = true;
    }

  }
  /**
   * Method which is used to trigger the event when the element tapped to move.
   */
  onTap($event) {
  }
  /**
   * Method which is used to notify a user when moving ot from the component without saving the entered details.
   */
  canDeactivate() {
    return (this.inputPropertiesForm && !this.inputPropertiesForm.dirty) || !this.unauthorized;
  }
  /**
   * Method which is used to change between sections.
   * @param event  Parameter defines the event that triggered when the section changes.
   */
  onSectionChanged(event) {
    if (event) {
      this.currentInspection.sectionId = event;
      this.inspectionSections.find((item, index) => {
        if (item && item.id === event) {
          this.propertySectionId = index;
          this.currentInspection.sectionName = item.sectionName;
          return true;
        }
      });
      this.initForm();
    }
    this.sectionView = false;
  }
  /**
   * Method which is used to change the tabs.
   * @param index The index of the tab.
   */
  onTabChanged(index: number) {
    if (this.currentInspection.inspectionHeaderId !== null && this.currentInspection.inspectionHeaderId !== undefined) {
      this.tabIndex = index;
    }
  }
  /**
   * Method which is used to get the option group
   * @param optiongroup which defines the option group details.
   */
  getOptionGroup(optiongroup) {
    this.currentInspection.selectedOptionGroup = optiongroup;
  }
  /**
   * Method which is used to decide whether to use fixed option or from resource
   * @param inputType  Parameter defines the control that dragged.
   * @param qid {number} The index of the question.
   * @param pid {number} The index of that property.
   * @param dqid {number} The index of the dynamic question.
   * @param dpid {number} The index of that dynamic question's property.
   * @param selectedOption defines the option selected.
   */
  onOptionTypeSelected(inputType, qid, pid, dqid, dpid, selectedOption, value) {
    if ((dpid === null || dpid === undefined) && (dqid === null || dqid === undefined) && (qid !== null)) {
      if (this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][qid].get('properties')['controls'] && this.inputTypeProperties[inputType] &&
        this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][qid].get('properties')['controls'].length >= this.inputTypeProperties[inputType].length) {
        const index = this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][qid].get('properties')['controls'].length - 1;

        (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][qid].get('properties')).removeAt(index);
      }
    } else if (dqid !== null && dqid !== undefined && qid !== null && pid !== null) {
      const len = this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
        .get('draggedcontrols')['controls'][qid].get('properties')['controls']
      [pid]['controls'][dqid].get('dynamicproperties')['controls'].length;

      if (len === this.inputTypeProperties[inputType].length) {
        (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
          .get('draggedcontrols')['controls'][qid].get('properties')['controls']
        [pid]['controls'][dqid].get('dynamicproperties')).removeAt(len - 1);
      }
    }

    if (selectedOption === 'Fixed Options') {
      if (this.inputTypeProperties && this.inputTypeProperties[inputType]) {
        if ((dpid === null || dpid === undefined) && (dqid === null || dqid === undefined)) {
          if (this.draggedFormControls && this.draggedFormControls[qid]) {
            this.draggedFormControls[qid].selectedOption = selectedOption;
          }
          (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][qid].get('properties')).push(
              new FormGroup({
                'options': new FormArray([])
              })
            );

        } else if (dqid !== null && dqid !== undefined) {
          if (this.draggedFormControls && this.draggedFormControls[qid] &&
            this.draggedFormControls[qid].dynamicPro && this.draggedFormControls[qid].dynamicPro[dqid]) {
            this.draggedFormControls[qid].dynamicPro[dqid].selectedOption = selectedOption;
          }
          (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][qid].get('properties')['controls']
          [pid]['controls'][dqid].get('dynamicproperties')).push(
            new FormGroup({
              'options': new FormArray([])
            })
          );
        }
      }
    } else if (selectedOption === 'Options From Resource') {
      if (this.inputTypeProperties && this.inputTypeProperties[inputType]) {
        if ((dpid === null || dpid === undefined) && (dqid === null || dqid === undefined)) {
          if (this.draggedFormControls && this.draggedFormControls[qid]) {
            this.draggedFormControls[qid].selectedOption = selectedOption;
          }
          (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][qid].get('properties')).push(new FormControl(value));
        } else if ((dqid !== null) || (dpid !== null)) {
          if (this.draggedFormControls && this.draggedFormControls[qid] &&
            this.draggedFormControls[qid].dynamicPro && this.draggedFormControls[qid].dynamicPro[dqid]) {
            this.draggedFormControls[qid].dynamicPro[dqid].selectedOption = selectedOption;
          }
          (<FormArray>this.inputPropertiesForm.get('sections')['controls'][this.propertySectionId]
            .get('draggedcontrols')['controls'][qid].get('properties')['controls']
          [pid]['controls'][dqid].get('dynamicproperties')).push(new FormControl(value));
        }
      }
    }
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.detailsSaved = event;
    // console.log('display var1', this.display);
  }
  /**
   * Method which is used to navigate to the desired routes.
   * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
   */
  onNavigate(key: string) {
    if (key === 'R') {
      this.router.navigate(['/app/inspection/reporttemplate']);
    } else if (key === 'L') {
      if (this.currentInspection.inspectionHeaderId === null || this.currentInspection.inspectionHeaderId === undefined) {
        this.router.navigate(['/app/inspection/reporttemplate']);
      } else if (this.currentInspection.inspectionHeaderId !== null || this.currentInspection.inspectionHeaderId !== undefined) {
        this.formPreview = true;
      }
    }
  }
}
