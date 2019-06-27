// dynamic-from component,which is used to display the dynamic form controls and define functionality
// for form control value changes.
import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewEncapsulation, SimpleChanges, OnDestroy } from '@angular/core';
import {
  DynamicInputModel,
  DynamicSelectModel,
  DynamicFormGroupModel,
  DynamicFormService,
  DynamicFormControlModel,
  DynamicTextAreaModel,
  DynamicRadioGroupModel,
  DynamicDatePickerModel,
  DynamicCheckboxModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormGroupService } from '../../services/dynamic-form-group.service';
import { DynamicImageModel } from '../../models/dynamic-image.model';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { DynamicFieldModel } from '../../models/dynamic-field-model';
import { ExportService } from '../../../inspection/services/export.service';
import { CommonReportDataService } from '../../../shared/services/common-report-data.service';
import { DynamicSubcategoryModel } from '../../models/dynamic-subcategory.model';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { SiteService } from '../../services/site.service';
import { DynamicCustomTimepickerModel } from '../../models/dynamic-timepicker.model';
import { DynamicCustomSignatureModel } from '../../models/dynamic-signature.model';
import { AuthService } from '../../../auth/services/auth.service';
/**
 * Variable which is used to define the window screen.
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used to display dynamic form controls.
 */
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Variable which is used to define the image url.
   */
  imageUrlDb = environment.imageUrlDb;
  /**
   * Variable which is used to decide whether the network is connected or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which is used to subscribe and unsubscribe.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to define the inspectionHeader details.
   * @type {any}
   */
  inspectionHeader: any;
  /**
   * Variable which is used to define form name(inspectionHeader name) from the parent component.
   * @type {string}
   */
  @Input() formName: string;
  /**
   * Variable which is used to define section name from the parent component.
   * @type {string}
   */
  @Input() sectionName: string;
  /**
   * Variable which is used to define report id from the parent component.
   * @type {number}
   */
  @Input() editId: number;
  /**
   * Variable which is used to emit the form control value to the parent component.
   * @type {any}
   */
  @Output() buttontriggered = new EventEmitter<any>();
  /**
   * Variable which is used to define dynamic field questions from the parent component.
   * @type {any[]}
   */
  @Input() fieldQuestions = [];
  /**
   * Variable which is used to define dynamic-field group id from the parent component.
   * @type {number}
   */
  @Input() elementArray: number;
  /**
   * Variable which is used to define the questions list.
   * @type {any[]}
   */
  questions = [];
  /**
   * Variable which is used to define the answers list.
   * @type {any[]}
   */
  @Input() answers = [];
  /**
   * Variable which is used to define the button model list.
   * @type {any[]}
   */
  buttonModel = [];
  /**
   * Variable which is used to define the selected camera options.
   * @type {string}
   */
  imgOption: string;
  /**
   * Variable which is used to display camera when value is true.
   * @type {boolaen}
   */
  viewCamera: boolean;
  /**
   * Variable which is used to define the inspectionSections list for the given header name.
   * @type {any}
   */
  form: any;
  /**
   * Variable which is used to define dynamic form model.
   * @type {DynamicFormControlModel[]}
   */
  formModel: DynamicFormControlModel[] = [];
  /**
   * Variable which is used to define the dynamic form group.
   * @type {FormGroup}
   */
  formGroup: FormGroup;
  /**
   * Variable which is used to define the saved image details.
   * @type {any[]}
   */
  @Input() imageData = [];
  /**
   * Variable which is used to define the selected section for storing images.
   * @type {any}
   */
  saveOption: any;
  /**
   * Variable which is used to dispaly dialog when value is true.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to define the latitude of the current location.
   * @type {number}
   */
  lat: number;
  /**
   * Variable which is used to define the longitude of the current location.
   * @type {number}
   */
  longitude: number;
  /**
   * Variable which is used to define the current inspectionSections is common or not.
   * @type {boolean}
   */
  isCommonSections: boolean;
  /**
   * Variable which is used to check whether the application running in device or not.
   */
  mobileView: boolean;
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
    action: [{ label: 'Okay' }]
  };
  /**
   * Component Constructor used to inject the required services.
   * @param formService To use dynamic forms.
   * @param formgroupService To get and store the form details.
   * @param offlinestorage To get and store form details in offline.
   * @param exportService To find current location latitiude and longtitude.
   * @param commonReportDataService To store common inspectionesction anwsers.
   * @param siteService To get wind farm details.
   * @param authService To get current user details.
   */
  constructor(private formService: DynamicFormService,
    private formgroupService: DynamicFormGroupService,
    private offlinestorage: OfflineStorageService,
    private exportService: ExportService,
    private commonReportDataService: CommonReportDataService,
    private siteService: SiteService,
    private authService: AuthService) {
  }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['applicationMode'] = this.offlinestorage.applicationMode.subscribe((value: boolean) => {
      this.mobileView = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // Subscribe when save button trigger on parent component
    this.subscriptionObject['sectionSaveTriggered'] = this.formgroupService.sectionSaveTriggered.subscribe((sectionName) => {
      console.log('section name', sectionName, this.sectionName);
      if (this.sectionName === sectionName) {
        console.log('sectio cond', this.sectionName, this.formGroup);
        // To check form is valid and dirty
        if (this.formGroup && this.formGroup.valid) {
          const status = this.formGroup.valid && this.formGroup.dirty;
          // Form the object with form details
          // tslint:disable-next-line:max-line-length
          const value = { 'method': status, 'sectionName': this.sectionName, 'value': this.formGroup.value, 'img': this.imageData };
          // Emit the form deatils to the parent component
          this.buttontriggered.emit(value);
          this.formGroup = undefined;
        } else {
          this.buttontriggered.emit({ 'method': false });
        }
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // To get network status
    this.subscriptionObject['network'] = this.offlinestorage.networkDisconnected.subscribe((value) => {
      this.disconnected = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
  * Method which is used to get the questions list and init the form group.
  */
  createFormGroup() {
    if (this.inspectionHeader && this.inspectionHeader.inspectionSections) {
      this.form = this.inspectionHeader.inspectionSections;
      if (this.form) {
        this.form.find((section) => {
          if (section && section.questions && section.sectionName === this.sectionName) {
            this.isCommonSections = section.isCommon;
            this.questions = section.questions;
            this.initFormGroup();
            return true;
          }
        });
      }
    } else if (this.fieldQuestions && this.fieldQuestions.length > 0) {
      this.questions = this.fieldQuestions;
      this.initFormGroup();
    } else {
      console.log('The provided form does not exist');
    }
  }
  /**
   * Method which is used to create the dynamic form group.
   */
  initFormGroup() {
    const group = [];
    let answerValue;
    let optionChoiceAnswer = [];
    // To each questions in given inspection Sections
    this.questions.forEach((question) => {
      answerValue = null;
      if (question) {
        const inputType = question.inputType;
        const inputTypeProperty = _.cloneDeep(question.inputTypesProperty);
        if (this.fieldQuestions && this.fieldQuestions.length > 0 && inputTypeProperty) {
          inputTypeProperty.id = inputTypeProperty.id + this.elementArray;
        }
        const validatorsArray = question.validators;
        if (validatorsArray && inputTypeProperty && validatorsArray.length > 0) {
          // If validators is available then form validators and errorMessage property
          const validators: { [key: string]: string } = {};
          const errorMessages: { [key: string]: string } = {};
          validatorsArray.forEach((item) => {
            if (item && item.keyName) {
              // Create property name with given keyName for validators object
              validators[item.keyName] = item.keyValue;
            }
            if (item && item.keyName && item.errorMessage) {
              // Create property name with given keyName for errorMessages object
              errorMessages[item.keyName] = item.errorMessage;
            }
          });
          // Assign validators and errorMessages
          inputTypeProperty.validators = validators;
          inputTypeProperty.errorMessages = errorMessages;
        }
        if (this.answers && inputTypeProperty) {
          this.answers.find((value) => {
            // To find the answer value for the given question id
            // tslint:disable-next-line:max-line-length
            if (value && question.id === value['questionId'] && (this.elementArray === null || this.elementArray === undefined)) {
              // Save answer value to the answerValue variable
              if (value['answer_text']) {
                answerValue = value['answer_text'];
              } else if (value['answer_numeric']) {
                answerValue = value['answer_numeric'];
              } else if (value['imageAnswers'] && value['imageAnswers'].length > 0) {
                this.imageData = [];
                let imageAdded = false;
                // If answers have image then save this value into imageData variable
                value['imageAnswers'].forEach((item) => {
                  imageAdded = false;
                  // if (item && item.imageLocation && inputType.inputTypeName !== 'DynamicCustomSignatureModel') {
                  //   item.imageLocation = (item.imageLocation).substring(1);
                  //   item.imageLocation = this.imageUrlDb + item.imageLocation + '?' + new Date().getTime();
                  // }
                  if (item && this.imageData.length > 0) {
                    this.imageData.find((image) => {
                      if (image && image.sectionName === item.sectionName && image.img) {
                        imageAdded = true;
                        item.imgId = image.img.length;
                        image.img.push(item);
                        return true;
                      }
                    });
                  }
                  if (!imageAdded && item) {
                    item.imgId = 0;
                    this.imageData.push({
                      sectionName: item.sectionName,
                      img: [item]
                    });
                  }
                });
              }
              if (this.isCommonSections) {
                // If sections common to all inspection then save thses details into service
                this.commonReportDataService.setAnswersData(question.questionName, answerValue);
              }
              return true;
            } else if (value && question.id === value['questionId'] && value['answer_text'] &&
              value['elementArray'] === this.elementArray) {
              answerValue = value['answer_text'];
              if (answerValue === '1' && question.inputType && question.inputType.inputTypeName === 'DynamicCheckboxModel') {
                answerValue = true;
              }
              return true;
            }
          });
          inputTypeProperty.value = answerValue;
          for (const input in inputTypeProperty) {
            if (inputTypeProperty[input] === 1) {
              console.log('condition satisfied');
              inputTypeProperty[input] = true;
            }
          }
          if (answerValue === null || answerValue === undefined) {
            // Check whether the form control have auto generate answers
            if (inputTypeProperty.id === 'Latitude') {
              inputTypeProperty.value = this.lat;
            } else if (inputTypeProperty.id === 'Longitude') {
              inputTypeProperty.value = this.longitude;
            }
          }
        }
        const options = [];
        optionChoiceAnswer = [];
        // tslint:disable-next-line:max-line-length
        if (question && question.optionGroup && question.optionGroup.optionChoices && question.optionGroup.optionChoices.length > 0) {
          if (inputTypeProperty && inputTypeProperty.id !== 'Damage classification') {
            // If question have optionGroup then find the optionChoiceAnswer
            const optionChoice = question.optionGroup.optionChoices;
            if (this.answers) {
              this.answers.find((value) => {
                // To find the optionChoiceAnswer value for the given question id
                if (question.id === value['questionId']) {
                  if (value['optionChoiceAnswers']) {
                    const optionChoiceAnswers = value['optionChoiceAnswers'];
                    optionChoiceAnswers.forEach((item) => {
                      optionChoice.find((option) => {
                        if (option.id === item.optionChoiceId) {
                          optionChoiceAnswer.push(option.optionChoicesValue);
                          return true;
                        }
                      });
                    });
                  }
                  return true;
                }
              });
            }
            optionChoice.forEach((option) => {
              if (option) {
                options.push({ 'label': option.optionChoiceName, 'value': option.optionChoicesValue });
              }
            });
          } else {
            this.answers.find((value) => {
              // To find the optionChoiceAnswer value for the given question id
              if (value && question.id === value['questionId']) {
                if (value['optionChoiceAnswers']) {
                  const optionChoiceAnswers = value['optionChoiceAnswers'];
                  optionChoiceAnswers.forEach((item) => {
                    if (item) {
                      // optionChoiceAnswer.push(item.optionChoiceId);
                      optionChoiceAnswer = item.optionChoiceId;

                    }
                  });
                }
                return true;
              }
            });
          }
          // Assign the answer value to the value property
          inputTypeProperty.value = optionChoiceAnswer;
          inputTypeProperty.options = options;
        }
        if (inputType && inputTypeProperty) {
          // Map the inputTypeName and corresponing model is pushed into group
          switch (inputType.inputTypeName) {
            case 'DynamicInputModel': {
              group.push(new DynamicInputModel(inputTypeProperty));
              break;
            }
            case 'DynamicSelectModel': {
              group.push(new DynamicSelectModel(inputTypeProperty));
              break;
            }
            case 'DynamicCheckboxModel': {
              group.push(new DynamicCheckboxModel(inputTypeProperty));
              break;
            }
            case 'DynamicTextAreaModel': {
              group.push(new DynamicTextAreaModel(inputTypeProperty));
              break;
            }
            case 'DynamicRadioGroupModel': {
              group.push(new DynamicRadioGroupModel(inputTypeProperty));
              break;
            }
            case 'DynamicDatePickerModel': {
              // Change the value to date object
              if (inputTypeProperty.value) {
                const date = new Date(inputTypeProperty.value);
                inputTypeProperty.value = date;
                // } else {
                //   inputTypeProperty.min = new Date(Date.now());
              }
              group.push(new DynamicDatePickerModel(inputTypeProperty));
              break;
            }
            case 'ButtonModel': {
              this.buttonModel.push(inputTypeProperty);
              break;
            }
            case 'DynamicImageModel': {
              group.push(new DynamicImageModel(inputTypeProperty));
              break;
            }
            case 'DynamicFieldModel': {
              // Assign the editId and question proprty in dynamic field model
              inputTypeProperty.editId = this.editId;
              inputTypeProperty.question = question;
              group.push(new DynamicFieldModel(inputTypeProperty));
              break;
            }
            case 'DynamicSubcategoryModel': {
              // Assign the editId and question proprty in dynamic field model
              inputTypeProperty.subcategoryName = question.questionName;
              group.push(new DynamicSubcategoryModel(inputTypeProperty));
              break;
            }
            case 'DynamicCustomTimepickerModel': {
              group.push(new DynamicCustomTimepickerModel(inputTypeProperty));
              break;
            }
            case 'DynamicCustomSignatureModel': {
              console.log('image data fr sign', this.imageData);
              if (this.imageData && this.imageData[0] && this.imageData[0].img &&
                this.imageData[0].img[0]) {
                inputTypeProperty.imageDataToEdit = this.imageData[0].img[0];
              } else if (this.imageData && this.imageData[0] && !this.imageData[0].hasOwnProperty('img')) {
                console.log('image daata sent', this.imageData);
                inputTypeProperty.imageDataToEdit = this.imageData[0];
              }
              group.push(new DynamicCustomSignatureModel(inputTypeProperty));
              break;
            }
          }
        }
      }


    });
    // Create form group with id as form
    this.formModel = [new DynamicFormGroupModel({ id: 'form', group: group })];
    this.formGroup = this.formService.createFormGroup(this.formModel);
    const inputupdateModel = this.formService.findById('Damage Number', this.formModel) as DynamicSelectModel<string>;
    if (inputupdateModel && inputupdateModel.value !== null) {
      this.getOptionsForDamageClassification(inputupdateModel.value[0]);
    }
    const inputupdate = this.formService.findById('Start Date of work carried out', this.formModel) as DynamicDatePickerModel;
    if (inputupdate && inputupdate.value) {
      const input = this.formService.findById('End Date of work carried out', this.formModel) as DynamicDatePickerModel;
      input.min = inputupdate.value;
    }
    const windFarmIdProperty = this.formService.findById('windFarm', this.formModel) as DynamicSelectModel<string>;
    if (windFarmIdProperty) {
      // Customer List got
      this.subscriptionObject['windSite'] = this.siteService.getAllWindFarms().subscribe((res) => {
        if (res && res['windFarms']) {
          const windFarmsList = [];
          windFarmsList.push({ 'label': 'Select wind Farm', 'value': null });
          res['windFarms'].forEach((item) => {
            if (item) {
              windFarmsList.push({ 'label': item.name, 'value': item.id });
            }
          });
          windFarmIdProperty.options = windFarmsList;
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
  }
  /**
   * Component onChanges life cycle hook.
   * @param {SimpleChanges} changes To define changes in input property.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('formName')) {
      // If changes in formName input property then get the form details from the database
      if (!this.disconnected) {
        if (this.formName) {
          this.subscriptionObject['formDetails'] = this.formgroupService.getFormDetails(this.formName).subscribe((response) => {
            if (response && response['inspectionHeader']) {
              this.inspectionHeader = response['inspectionHeader'];
              if (this.inspectionHeader.isForm !== 1) {
                this.getLocation();
              }
              this.createFormGroup();
            }
          }, (err) => {
            if (err.error && err.error.error) {
              console.log('Error: ', err.error.error);
            }
          });
        }
      } else if (window && window.cordova && this.disconnected) {
        // If device in offline mode
        const inspectionHeader = [];
        // Get the inspectionHeader details from the offline database
        this.offlinestorage.getInspectionHeader(this.formName)
          .then((inspection) => {
            for (let i = 0; i < inspection.rows.length; i++) {
              if (inspection.rows.item(i)) {
                inspectionHeader.push(inspection.rows.item(i));
                if (inspection.rows.item(i).isForm !== 1) {
                  this.getLocation();
                }
                // Get the inspectionSections details for the given header id
                this.offlinestorage.getInspectionSections(inspection.rows.item(i).id)
                  .then((inspectionSection) => {
                    this.form = [];
                    for (let sectionId = 0; sectionId < inspectionSection.rows.length; sectionId++) {
                      if (inspectionSection.rows.item(sectionId)) {
                        this.form.push(inspectionSection.rows.item(sectionId));
                        // Get the questions list for the given section id
                        this.offlinestorage.getQuestions(inspectionSection.rows.item(sectionId).id)
                          .then((question) => {
                            const questions = [];
                            for (let questionId = 0; questionId < question.rows.length; questionId++) {
                              if (question.rows.item(questionId)) {
                                questions.push(question.rows.item(questionId));
                                // Get the inputType details for the given question id
                                // tslint:disable-next-line:max-line-length
                                this.offlinestorage.getInputTypes(question.rows.item(questionId).inputTypeId)
                                  .then((inputTypes) => {
                                    questions[questionId].inputType = {};
                                    // tslint:disable-next-line:max-line-length
                                    for (let inputTypeId = 0; inputTypeId < inputTypes.rows.length; inputTypeId++) {
                                      if (inputTypes.rows.item(inputTypeId)) {
                                        // tslint:disable-next-line:max-line-length
                                        questions[questionId].inputType = inputTypes.rows.item(inputTypeId);
                                      }
                                    }
                                  }).catch((error) => {
                                  });
                                //  Get the inputTypeProperties details for the given question id
                                // tslint:disable-next-line:max-line-length
                                this.offlinestorage.getInputTypeProperties(question.rows.item(questionId).inputTypePropertyId)
                                  .then((inputTypesProperties) => {
                                    questions[questionId].inputTypesProperty = {};
                                    // tslint:disable-next-line:max-line-length
                                    for (let inputTypePropertyId = 0; inputTypePropertyId < inputTypesProperties.rows.length; inputTypePropertyId++) {
                                      if (inputTypesProperties.rows.item(inputTypePropertyId)) {
                                        // tslint:disable-next-line:max-line-length
                                        questions[questionId].inputTypesProperty = (inputTypesProperties.rows.item(inputTypePropertyId));
                                      }
                                    }
                                    // To check whether the get all the inspectionSections details is finished or not
                                    // tslint:disable-next-line:max-line-length
                                    if (question.rows.item.length - 1 === questionId && question.rows.item(questionId).optionGroupId === null) {
                                      if (inspectionSection.rows.length - 1 === sectionId) {
                                        // Call the createFormGroup
                                        this.createFormGroup();
                                      }
                                    }
                                  }).catch((errorMessage) => {
                                    console.log('error', errorMessage);
                                  });
                                //  Get the optionGroup details for the given question id
                                // tslint:disable-next-line:max-line-length
                                this.offlinestorage.getOptionGroups(question.rows.item(questionId).optionGroupId)
                                  .then((optionGroup) => {
                                    questions[questionId].optionGroup = {};
                                    // tslint:disable-next-line:max-line-length
                                    for (let optionGroupId = 0; optionGroupId < optionGroup.rows.length; optionGroupId++) {
                                      if (optionGroup.rows.item(optionGroupId)) {
                                        // tslint:disable-next-line:max-line-length
                                        questions[questionId].optionGroup = (optionGroup.rows.item(optionGroupId));

                                        // Get the optionChoices details for the given optionGroup id
                                        // tslint:disable-next-line:max-line-length
                                        this.offlinestorage.getOptionChoices(optionGroup.rows.item(optionGroupId).id)
                                          .then((optionChoice) => {
                                            const optionChoices = [];
                                            // tslint:disable-next-line:max-line-length
                                            for (let optionChoiceId = 0; optionChoiceId < optionChoice.rows.length; optionChoiceId++) {
                                              if (optionChoice.rows.item(optionChoiceId)) {
                                                // tslint:disable-next-line:max-line-length
                                                optionChoices.push(optionChoice.rows.item(optionChoiceId));
                                              }
                                            }
                                            // To check whether the get all the inspectionSections details is finished or not
                                            if (question.rows.item.length - 1 === questionId) {
                                              if (inspectionSection.rows.length - 1 === sectionId) {
                                                // Call the createFormGroup
                                                this.createFormGroup();
                                              }
                                            }
                                            questions[questionId].optionGroup.optionChoices = optionChoices;
                                          }).catch((e) => {
                                          });
                                      }
                                    }
                                  });
                              }
                            }
                            this.form[sectionId].questions = questions;
                          });
                      }
                    }

                    this.inspectionHeader.inspectionSections = this.form;
                  });
              }
            }
            this.inspectionHeader = inspectionHeader[0];
          });
      }
    } else if (changes.hasOwnProperty('sectionName')) {
      // If changes in sectionName input property. And get the answers details from the database
      if (this.editId !== undefined) {
        // To get answers list for the given report id
        if (!this.disconnected) {
          this.subscriptionObject['answersList'] = this.formgroupService.getAnswers(this.editId).subscribe((res) => {
            this.answers = res['answers'];
            this.createFormGroup();
          }, (err) => {
            if (err.error && err.error.error) {
              console.log('failed to get answer data: ', err.error.error);
            }
          });
        } else if (window && window.cordova && this.disconnected) {
          // If error occured in get the answer details and device in offline mode
          // then get answers list from the offline database
          this.offlinestorage.getAnswers(this.editId)
            .then((answer) => {
              this.answers = [];
              if (answer.rows.length > 0) {
                for (let i = 0; i < answer.rows.length; i++) {
                  if (answer.rows.item(i)) {
                    this.answers.push(answer.rows.item(i));
                    // To get optionChoiceAnswers for the given anser id
                    this.offlinestorage.getOptionChoiceAnswers(answer.rows.item(i).Id).then((optionAnswer) => {
                      const optionChoiceAnswers = [];
                      if (optionAnswer.rows.length > 0) {
                        for (let optId = 0; optId < optionAnswer.rows.length; optId++) {
                          if (optionAnswer.rows.item(optId)) {
                            optionChoiceAnswers.push(optionAnswer.rows.item(optId));
                          }
                        }
                        this.answers[i].optionChoiceAnswers = optionChoiceAnswers;
                      }
                      if (answer.rows.length - 1 === i) {
                        this.createFormGroup();
                      }
                    });
                    // To get imageAnswers for the given answer id
                    this.offlinestorage.getImageAnswers(answer.rows.item(i).Id)
                      .then((imageAnswers) => {
                        if (imageAnswers.rows.length > 0) {
                          this.answers[i].imageAnswers = [];
                          for (let imgId = 0; imgId < imageAnswers.rows.length; imgId++) {
                            if (imageAnswers.rows.item(imgId)) {
                              this.answers[i].imageAnswers.push(imageAnswers.rows.item(imgId));
                            }
                          }
                          if (answer.rows.length - 1 === i) {
                            this.createFormGroup();
                          }
                        }
                      }).catch((e) => { console.log('error in image got in report view', e.message); });
                    if (answer.rows.length - 1 === i) {
                      this.createFormGroup();
                    }
                  }
                }
              } else {
                this.createFormGroup();
              }
            })
            .catch((e) => { console.log('failed to get answer data', e.message); });
        }
      } else {
        this.createFormGroup();
      }
    } else if (changes.hasOwnProperty('fieldQuestions')) {
      // If changes in fieldQuestions input property. And get the dynamicFieldAnswers details from the database
      if (this.editId !== null) {
        this.questions = this.fieldQuestions;
        // To get dynamicFieldAnswers list
        // this.dynamicFieldAnsSubscription = this.formgroupService.getDynamicFieldAnswers(this.editId).subscribe((res) => {
        //   if (res && res['answer']) {
        //     this.answers = res['answer'];
        //     this.initFormGroup();
        //   }
        // });
        this.initFormGroup();
      } else {
        this.questions = this.fieldQuestions;
        this.createFormGroup();
      }
    } else if (changes.hasOwnProperty('elementArray') || changes.hasOwnProperty('answers')) {
      this.initFormGroup();
    }
  }
  /**
   * Method which is implemented when form have value changes..
   * @param event {any} To define event( form value) value.
   */
  onValueChange(event: any) {
    console.log('in value change in dyn form', _.cloneDeep(event), this.imageData);
    if (this.fieldQuestions && this.fieldQuestions.length > 0) {
      // If form control is dynamic field form then emit the form value to the dynamic field form component
      if (event.$event && event.model.type === 'CUSTOMSIGNATURE') {
        event.group.value[event.model.name] = event.$event;
        console.log('signature got', _.cloneDeep(event.group.value[event.model.name]),
          _.cloneDeep(event.group.value));
      }
      this.buttontriggered.emit(event.group.value);
    }
    if (event && event.model && (event.model.type === 'IMAGE')) {
      // If model is dynamicImage model then assign the form control value to the imgOption
      this.subscriptionObject['formValue'] = event.model.valueUpdates.subscribe((value) => {
        this.imgOption = event.model.value;
        // To get selected section name for storing images
        if (this.form) {
          this.form.find((section) => {
            if (section && section.sectionName === this.sectionName) {
              section.questions.find((question) => {
                if (question) {
                  const inputType = question.inputType;
                  if (inputType && inputType.inputTypeName === 'DynamicSelectModel') {
                    this.saveOption = this.formGroup.value.form[question.questionName];
                    // To check whether the section name is selected or not
                    if (this.saveOption && typeof this.saveOption !== 'string' && this.saveOption.length > 0) {
                      this.saveOption = this.saveOption[0];
                    } else if (this.saveOption === null || this.saveOption.length <= 0) {
                      this.dialogBoxDetails.content = this.messages.SELECT_SECTION;
                      this.display = true;
                    }
                  }
                  return true;
                }
              });
              return true;
            }
          });
        }
        if (this.saveOption === undefined && !this.display) {
          this.saveOption = 'Blade';
        }
        if (!this.display) {
          // To display camera component
          this.viewCamera = true;
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    } else if (event && event.model && event.model.id === 'Damage Number') {
      this.getOptionsForDamageClassification(event.model.value);
    } else if (event && event.model && event.model.id === 'Start Date of work carried out') {
      const inputupdateModel = this.formService.findById('End Date of work carried out', this.formModel) as DynamicDatePickerModel;
      if (inputupdateModel) {
        inputupdateModel.min = event.model.value;
      }
    }
    // else if (event && event.model && event.model.name === 'role') {
    // 	if (event.model.value === 'Client') {
    // 		// When model value is 'Client' then show the site location dropdown
    // 		const options = [];
    // 		// To get form model for clientId
    // 		const inputupdateModel = this.formService.findById('clientId', this.formModel) as DynamicSelectModel<string>;
    // 		if (inputupdateModel) {
    // 			// To get all client details from the database
    // 			this.subscriptionObject['clientList'] = this.clientService.getAllClients().subscribe((res) => {
    // 				const client = res['client'];
    // 				client.forEach((item) => {
    // 					if (item) {
    // 						options.push({ value: item.id, label: item.clientName });
    // 					}
    // 				});
    // 				inputupdateModel.options = options;
    // 			});
    // 			// To assign false to show the clientId(siteLocation) form control in dispaly
    // 			inputupdateModel.hidden = false;
    // 		}
    // 	} else {
    // 		// When model value is 'Client' then hide the site location dropdown
    // 		// To get form model for clientId
    // 		const inputupdateModel = this.formService.findById('clientId', this.formModel) as DynamicSelectModel<string>;
    // 		if (inputupdateModel) {
    // 			inputupdateModel.hidden = true;
    // 		}
    // 	}
    // }

  }
  /**
   * Method which emits the formdata when the button clicked in the form.
   * @param method {boolean} It defines whether the button trigger has the method to perform updations.
   * @param name {string} It defines the section name
   */
  onClick(method: boolean, name: string) {

    const value = { 'method': method, sectionName: name, 'value': this.formGroup.value, 'img': this.imageData };
    console.log('buttontriggred', value);

    this.buttontriggered.emit(value);
    if (this.inspectionHeader && this.inspectionHeader.isForm) {
      const inputupdateModel = this.formService.findById('clientId', this.formModel) as DynamicSelectModel<string>;
      if (inputupdateModel) {
        inputupdateModel.hidden = true;
      }
    }
  }
  /**
   *  Method which is used to save the captured image datails.
   * @param event {any} To define the event(captured image details) value.
   */
  onCapturedImage(event: any) {
    console.log('event in image cao', event);
    if (!this.disconnected) {
      if (event && event.length > 0) {
        // console.log('event in image capture', this.imageData, event);
        // if (this.imageData && this.imageData.length > 0) {
        //   this.imageData[0].image = event.img;
        // } else {
        this.imageData = event;
        // }
        console.log('this.image data in dynamic form', this.imageData);
        if (this.fieldQuestions && this.fieldQuestions.length > 0) {
          this.buttontriggered.emit(this.imageData);
          // this.imageData = [];
        }
      }
    }

    if (this.disconnected) {
      if (event && event.length > 0) {
        this.imageData = event;
      }
    }
    this.viewCamera = false;
  }
  /**
   * Method which is used to alert the user when he navigates to the page
   * without saving the current page data's.
   */
  canDeactivate() {
    return this.formGroup && !this.formGroup.dirty;
  }
  /**
   * Method which is used to get the option choices for 'Damage classification' model.
   * @param optionGroupName which is used to define the optionGroup name
   */
  getOptionsForDamageClassification(optionGroupName: string) {
    // Show 'Damage classification' dropdown options for the selected 'Damage Number' value
    // To get form model for 'Damage classification'
    const inputupdateModel = this.formService.findById('Damage classification', this.formModel) as DynamicSelectModel<string>;
    let options = [];
    if (optionGroupName && inputupdateModel) {
      // To get optionChoices for given group name
      if (!this.disconnected) {
        this.subscriptionObject['optionChoiceList'] = this.formgroupService.getOptionChoices(optionGroupName).subscribe((res) => {
          if (res && res['optionGroup'] && res['optionGroup'].optionChoices) {
            res['optionGroup'].optionChoices.forEach((option) => {
              if (option) {
                options.push({ 'label': option.optionChoiceName, 'value': option.id });
              }
            });
          }
          inputupdateModel.options = options;
          if (inputupdateModel.value && inputupdateModel.value.length > 0) {
            inputupdateModel.valueUpdates.next(inputupdateModel.value[0]);
          }
        });
      } else if (window && window.cordova) {
        this.offlinestorage.getOptionGroupByName(optionGroupName).then((optionGroup) => {
          for (let optionGroupId = 0; optionGroupId < optionGroup.rows.length; optionGroupId++) {
            if (optionGroup.rows.item(optionGroupId)) {
              // Get the optionChoices details for the given optionGroup id
              this.offlinestorage.getOptionChoices(optionGroup.rows.item(optionGroupId).id)
                .then((optionChoice) => {
                  options = [];
                  for (let optionChoiceId = 0; optionChoiceId < optionChoice.rows.length; optionChoiceId++) {
                    if (optionChoice.rows.item(optionChoiceId)) {
                      const option = optionChoice.rows.item(optionChoiceId);
                      options.push({ 'label': option.optionChoiceName, 'value': option.id });
                    }
                  }
                  inputupdateModel.options = options;
                  if (inputupdateModel.value && inputupdateModel.value.length > 0) {
                    inputupdateModel.valueUpdates.next(inputupdateModel.value[0]);
                  }
                }).catch((e) => {
                  console.log('error in get option choices', e.message);
                });
            }
          }
        }).catch((err) => {
          console.log('error in get option groups', err.message);
        });
      }
    }
  }
  /**
   * Method which is used to get the current location details.
   */
  getLocation() {
    // Get the current location latitude and longitude
    this.subscriptionObject['currentLocation'] = this.exportService.getLocation().subscribe((res) => {
      if (res) {
        this.lat = res.latitude;
        this.longitude = res.longitude;
        const latitudeInputModel = this.formService.findById('Latitude', this.formModel) as DynamicInputModel;
        if (latitudeInputModel && latitudeInputModel.value === null) {
          latitudeInputModel.value = this.lat;
          latitudeInputModel.valueUpdates.next(latitudeInputModel.value);
        }
        const longitudeInputModel = this.formService.findById('Longitude', this.formModel) as DynamicInputModel;
        if (longitudeInputModel && longitudeInputModel.value === null) {
          longitudeInputModel.value = this.longitude;
          longitudeInputModel.valueUpdates.next(longitudeInputModel.value);
        }
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.display = event;
  }
  /**
   * Component onDestroy life cycle hook.
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
