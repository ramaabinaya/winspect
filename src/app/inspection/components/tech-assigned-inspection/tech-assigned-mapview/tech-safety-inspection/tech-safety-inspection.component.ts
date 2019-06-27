// TechSafetyInspection is the component which is used to initialise the form creation process for SafetyInspection.
import { Component, OnInit, ViewEncapsulation, ViewChild, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DynamicFormGroupService } from '../../../../../common/services/dynamic-form-group.service';
import { ReportService } from '../../../../../shared/services/report.service';
import { OfflineStorageService } from '../../../../../common/services/offlineStorage.service';
import { SectionWizardComponent } from '../../../../../common/components/section-wizard/section-wizard.component';
import { CommonReportDataService } from '../../../../../shared/services/common-report-data.service';
import { ReportStore } from '../../../../../shared/store/report/report.store';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AuthService } from '../../../../../auth/services/auth.service';
/**
 * window variable to access the window related methods.
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used for doing the inspection report by filling the safety inspection form.
 */
@Component({
  selector: 'app-tech-safety-inspection',
  templateUrl: './tech-safety-inspection.component.html',
  styleUrls: ['./tech-safety-inspection.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TechSafetyInspectionComponent implements OnInit, OnDestroy {
  /**
  * Variable which is used to store the subscription and unsubscribe the store     *subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to check the network availability.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which is used to define the content of the dialog box.
   * @type {string}
   */
  dialogInfo: string;
  /**
   * Variable which is used to define selected sectionName in the inspection form.
   * @type {string}
   */
  sectionName: string;
  /**
   * Variable which is used to define common question's data of the sections.
   * @type {any[]}
   */
  data = [];
  /**
   * Variable which is used to define optionChoiceAnswers of the questions.
   * @type {any[]}
   */
  optionChoiceAnswers = [];
  /**
   * Input parameter which is a turbineId got from the parent component.
   * @type {number}
   */
  @Input() turbineId: number;
  /**
   * Input parameter which is a assignedInspectionId got from the parent component.
   * @type {number}
   */
  @Input() assignedInspectionId: number;
  /**
   * Input parameter which is a inspectionHeaderId got from the parent component.
   * @type {number}
   */
  @Input() inspectionHeaderId: number;
  /**
   * Input parameter which is a bladeType got from the parent component.
   * @type {number}
   */
  @Input() bladeType: string;
  /**
   * Variable which is used to define the selected inspectionHeader details.
   */
  inspectionHeader;
  /**
   * Variable which is used to define the formName.
   */
  formName: string;
  /**
   * Variable which is used to define the selected report index.
   * @type {number}
   */
  editId: number;
  /**
   * Variable which is used to define the images that uploaded in the formview.
   */
  imageData = [];
  /**
   * Variable which is used to define the imageanswer.
   * @type {any}
   */
  imageUpload = {};
  /**
   * Variable which is used to define the status of the report.
   * @type {string}
   */
  status: string;
  /**
   * Variable which is used to decide whether to create the new report or not.
   * @type {boolean}
   */
  addReport: boolean;
  /**
   * Variable which is used to decide whether the formSaved or not.
   * @type {boolean}
   */
  formSaved: boolean;
  /**
   * Reference to the sectionwizard component.
   */
  @ViewChild(SectionWizardComponent) childSection: SectionWizardComponent;
  /**
   * Variable which is used to display the screen in mobile view
   */
  mobileView: boolean;
  /**
     *Variable which is used to display the message like error, success etc.,
     */
  messages: any;
  /**
   * Component constructor used to inject the required services.
   * @param route To get the activated route informations.
   * @param dynamicFormGroupService To get the formdetails of the given formName.
   * @param offlineStorage To display the form in the offline mode.
   * @param router To navigate the user to the provided routes.
   * @param reportService To creating the report and sections.
   * @param commonReportDataService For get and set the common field values in the form sections.
   * @param reportStore To get the assigned inspection list.
   */
  constructor(private route: ActivatedRoute,
    private dynamicFormGroupService: DynamicFormGroupService,
    private offlineStorage: OfflineStorageService,
    private router: Router,
    private reportService: ReportService,
    private commonReportDataService: CommonReportDataService,
    private reportStore: ReportStore,
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
    // Empty the data that have the common field values of the inspectionSection in the service.
    this.commonReportDataService.emptyData();
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // Getting reportid and inspectionid from the current activated route.
    this.subscriptionObject['routeParams'] = this.route.params.subscribe((params: Params) => {
      this.editId = +params['report_id'];
      if (params && params['inspectionId']) {
        this.inspectionHeaderId = +params['inspectionId'];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // Code for getting the inspection details with the inspection id.
    if (this.inspectionHeaderId && !this.disconnected) {
      this.subscriptionObject['getInspectionDetails'] = this.dynamicFormGroupService.getInspectionDetails(this.inspectionHeaderId)
        .subscribe((res) => {
          if (res && res['inspectionHeader']) {
            this.inspectionHeader = res['inspectionHeader'];
            this.initForm();
          }
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error: ', err.error.error);
          }
        });
    }
    // Check for cordova availablity and the network availablity.
    if (window && window.cordova) {
      // subscription for the current network status.
      this.subscriptionObject['networkDisconnected'] = this.offlineStorage.networkDisconnected.subscribe((value: boolean) => {
        this.disconnected = value;
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
      // If network unavailable do the formcreation process in offline.
      if (this.disconnected) {
        // Code for getting  the inspection details with inspectionsections,questions,optiongroups and optionchoices,inputtypes
        // and inputTypeProperties from the local db.
        this.offlineStorage.getInspection(this.inspectionHeaderId)
          .then((inspection) => {
            for (let i = 0; i < inspection.rows.length; i++) {
              this.inspectionHeader = inspection.rows.item(i);
              // inspection section details got.
              this.offlineStorage.getInspectionSections(inspection.rows.item(i).id)
                .then((inspectionSection) => {
                  this.inspectionHeader.inspectionSections = [];
                  for (let sectionId = 0; sectionId < inspectionSection.rows.length; sectionId++) {
                    this.inspectionHeader.inspectionSections.push(inspectionSection.rows.item(sectionId));
                    // inspection section's question details got.
                    this.offlineStorage.getQuestions(inspectionSection.rows.item(sectionId).id)
                      .then((question) => {
                        const questions = [];
                        for (let questionId = 0; questionId < question.rows.length; questionId++) {
                          questions.push(question.rows.item(questionId));
                          // inspection question's inputypes information got.
                          this.offlineStorage.getInputTypes(question.rows.item(questionId).inputTypeId)
                            .then((inputTypes) => {
                              questions[questionId].inputType = {};
                              for (let inputTypeId = 0; inputTypeId < inputTypes.rows.length; inputTypeId++) {
                                questions[questionId].inputType = inputTypes.rows.item(inputTypeId);
                              }
                            }).catch((err) => {
                            });
                          // inspection question's inputypeproperties information got.
                          this.offlineStorage.getInputTypeProperties(question.rows.item(questionId).inputTypePropertyId)
                            .then((inputTypesProperties) => {
                              questions[questionId].inputTypesProperty = {};
                              // tslint:disable-next-line:max-line-length
                              for (let inputTypePropertyId = 0; inputTypePropertyId < inputTypesProperties.rows.length; inputTypePropertyId++) {
                                questions[questionId].inputTypesProperty = (inputTypesProperties.rows.item(inputTypePropertyId));
                              }
                            }).catch((err) => {
                            });
                          // inspection question's optiongroups and related optionChoices information got.
                          this.offlineStorage.getOptionGroups(question.rows.item(questionId).optionGroupId)
                            .then((optionGroup) => {
                              // tslint:disable-next-line:max-line-length
                              questions[questionId].optionGroup = {};
                              for (let optionGroupId = 0; optionGroupId < optionGroup.rows.length; optionGroupId++) {
                                questions[questionId].optionGroup = optionGroup.rows.item(optionGroupId);
                                this.offlineStorage.getOptionChoices(optionGroup.rows.item(optionGroupId).id)
                                  .then((optionChoice) => {
                                    const optionChoices = [];
                                    for (let optionChoiceId = 0; optionChoiceId < optionChoice.rows.length; optionChoiceId++) {
                                      optionChoices.push(optionChoice.rows.item(optionChoiceId));
                                    }
                                    questions[questionId].optionGroup.optionChoices = optionChoices;
                                  }).catch((err) => {
                                  });
                              }
                            }).catch((err) => {
                              console.log('error', err);
                            });
                        }
                        this.inspectionHeader.inspectionSections[sectionId].questions = questions;
                      }).catch((err) => {
                        console.log('error', err);
                      });
                  }
                });
            }
            this.initForm();
          })
          .catch((e) => { console.log('failed to get inspectionHeader list data', e.message); });
      }
    }
  }
  /**
   * Method which is used to define the formName for creating the inspectionform.
   * @return {void}
   */
  initForm() {
    if (this.inspectionHeader) {
      this.formName = this.inspectionHeader.name;
    }
  }
  /**
   * It catch the button clicked event that triggered from the parent component
   * and also get the needed informations.
   * @param event Which holds the triggered event details.
   * @return {void}
   */
  buttonTriggered(event) {
    console.log('event triggered', event);
    if (event) {
      this.sectionName = event.sectionName;
      this.imageData = event.img;
      this.status = event.status;
      this.addReport = event.addReport;
      this.saveDetails(event.value.form);
    }
  }
  /**
   * Method which is used to save the details from the form and create the report with that.
   * @param form Which hold the user entered details.
   * @return {void}
   */
  saveDetails(form) {
    this.data = [];
    // Check for report existance, If exist call savesections for edit.
    if (this.assignedInspectionId === undefined) {
      this.saveSections(form);
    } else {
      // Check for report existance, If not exist create the report and call savesections.
      const reportName = 'Report ' + this.assignedInspectionId;
      const status = 2;
      if (!this.disconnected) {
        // Report creation with the provided information.
        this.subscriptionObject['createReport'] = this.reportService.createReport(this.assignedInspectionId, this.turbineId,
          reportName, status, this.bladeType).subscribe((res) => {
            if (res && res['report']) {
              this.reportStore.createReport(this.assignedInspectionId, status, res['report']);
              const report = res['report'];
              this.assignedInspectionId = undefined;
              this.editId = report.id;
              this.saveSections(form);
            }
          }, (err) => {
            // Print error message if the error occurred.
            if (err.error && err.error.error) {
              this.dialogInfo = this.messages.REPORT_ERROR + '\nError:' + err.error.error;
              this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
            }
          });
        // If error occured in online report creation then create that in offline.
      } else if (window && window.cordova && this.disconnected) {
        // Report creation in offline mode.
        this.offlineStorage.createReport(this.assignedInspectionId, this.turbineId, reportName, status, this.bladeType)
          .then((res) => {
            if (res) {
              this.editId = res.insertId;
              this.assignedInspectionId = undefined;
              this.saveSections(form);
            }
          }).catch((e) => {
            console.log('error in create report', e.message);
          });
      }
    }
  }
  /**
   * Method which is used to save each section with the details entered in the form.
   * @param form Parameter whhich have the user entered values.
   * @return {void}
   */
  saveSections(form) {
    console.log('in save section', this.inspectionHeader, form);
    let imageAdded = false;
    let signatureAdded = false;
    let counter = 0;
    let fieldValue = [];
    if (this.inspectionHeader && this.inspectionHeader.inspectionSections && this.inspectionHeader.inspectionSections.length > 0) {
      // For saving the common fieds values(text answers and images and optionchoices).
      console.log('inside option cond');
      this.inspectionHeader.inspectionSections.forEach((element, index) => {
        if (element && element.sectionName === this.sectionName && element.questions) {
          element.questions.forEach((question) => {
            // tslint:disable-next-line:max-line-length
            if (question && form[question.questionName] !== null && form[question.questionName] !== undefined
              && question.dynamicFieldQuestionId === null) {
              if (element && element.isCommon) {
                this.commonReportDataService.setAnswersData(question.questionName, form[question.questionName]);
              }
              if (question && question.inputType && question.inputType.inputTypeName === 'DynamicInputModel') {
                this.data.push({ questionId: question.id, reportId: this.editId, answer_text: form[question.questionName] });
              } else if (question && question.inputType && (question.inputType.inputTypeName === 'DynamicImageModel')) {
                if (this.imageData && this.imageData.length > 0) {
                  if (!this.disconnected) {
                    imageAdded = true;
                    console.log('in image savibg');
                    // tslint:disable-next-line:max-line-length
                    this.subscriptionObject['storeAnswerForImages'] = this.reportService.storeAnswerForImages(question.id, this.editId, null)
                      .subscribe((res) => {
                        console.log('img saving true!', this.imageData, res['answer']);
                        if (res && res['answer']) {
                          this.imageData.forEach((section) => {
                            if (section && section.img && section.img.length > 0) {
                              console.log('in sec if', section);
                              section.img.find((item) => {
                                console.log('section in find', section);
                                if (item && (item.mode !== undefined && item.mode !== null)) {
                                  console.log('in mode if', item);
                                  item.answerId = res['answer'].Id;
                                  this.imageUpload = { image: item };
                                  counter++;
                                  this.subscriptionObject['storeImage'] = this.reportService.storeImage(this.imageUpload)
                                    .subscribe((response) => {
                                      console.log('image uploaded successfully!');
                                      counter--;
                                      console.log('counter', counter, this.status, this.data, this.data.length,
                                        this.optionChoiceAnswers, fieldValue, signatureAdded);
                                      if (counter === 0 && this.status !== null && this.data && this.data.length === 0
                                        && this.optionChoiceAnswers.length === 0 && fieldValue.length === 0 && !signatureAdded) {
                                        this.formSaved = true;
                                        this.dialogInfo = this.messages.IMAGE_UPLOAD_SUCCESS;
                                        if (this.addReport) {
                                          this.router.navigate(['app/inspection/', this.editId, 'childreport']);
                                        } else {
                                          this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
                                        }
                                      } else if (counter === 0) {
                                        imageAdded = false;
                                      }
                                    }, (err) => {
                                      console.log('error in image upload!');
                                      counter--;
                                      if (counter === 0 && this.status !== null && this.data && this.data.length === 0
                                        && this.optionChoiceAnswers.length === 0 && fieldValue.length === 0 && !signatureAdded) {
                                        this.formSaved = true;
                                        if (this.addReport) {
                                          this.router.navigate(['app/inspection/', this.editId, 'childreport']);
                                        } else {
                                          this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
                                        }
                                      } else if (counter === 0) {
                                        imageAdded = false;
                                      }
                                    });
                                }
                              });
                            }
                          });
                        } else {
                          imageAdded = false;
                        }
                      }, (err) => {
                        imageAdded = false;
                      });
                  }
                  if (window && window.cordova && this.disconnected && this.imageData && this.imageData.length > 0) {
                    const questionId = question ? question.id : null;
                    this.offlineStorage.storeAnswersForImage(questionId, this.editId).then((answer) => {
                      if (answer && answer.insertId !== null) {
                        this.imageData.forEach((item) => {
                          if (item && item.img && item.img.length > 0) {
                            this.offlineStorage.storeImageAnswers(item.img, answer.insertId);
                          }
                        });
                      }
                    });
                  }
                }
                // For getting optionGroup and optionChoices of safetyInspection form.
              } else if (question && question.optionGroupId && question.optionGroup && question.optionGroup.optionChoices) {
                if (question && question.inputTypesProperty && question.inputTypesProperty.id !== 'Damage classification') {
                  const optionGroup = question.optionGroup;
                  this.assignOptionChoiceAnswers(question.id, form[question.questionName], optionGroup, null);
                } else {
                  console.log('in damage classification save', question.id, this.editId, form[question.questionName]);
                  // tslint:disable-next-line:max-line-length
                  this.optionChoiceAnswers.push({ questionId: question.id, reportId: this.editId, optionChoiceId: form[question.questionName], elementArray: null });
                }
                // tslint:disable-next-line:max-line-length
              } else if (question && question.inputType && question.inputType.inputTypeName === 'DynamicFieldModel' && form[question.questionName].length > 0) {
                form[question.questionName].forEach((item) => {
                  if (item && (!item.reportId || !item.mode)) {
                    item.reportId = this.editId;
                  }
                  if (item && item.inputTypeName === 'DynamicImageModel') {
                    console.log('in dynamic Field image add');
                    if (item && item.imageAnswers && item.imageAnswers.length > 0 && item.changedElementArray > -1) {
                      this.reportService.storeAnswerForImages(item.questionId, this.editId, item.changedElementArray)
                        .subscribe((res) => {
                          if (res && res['answer']) {
                            item.imageAnswers.forEach((section) => {
                              console.log('answser created successfully for the asdfg', res);
                              if (section && section.img) {
                                section.img.forEach((image, id) => {
                                  if (image && image.mode !== null && image.mode !== undefined) {
                                    const imageData = { image: image };
                                    imageData.image['answerId'] = res['answer'].Id;
                                    this.storeImages(imageData, fieldValue, true, true);
                                  }
                                });
                              }
                            });
                          }
                        });
                    }
                    console.log('item', item);

                  } else if (item && item.inputTypeName === 'DynamicCustomSignatureModel') {
                    console.log('sign save in dynamic field', item.value);
                    if (item && item.imageAnswers && item.changedElementArray > -1) {
                      this.reportService.storeAnswerForImages(item.questionId, this.editId, item.changedElementArray)
                        .subscribe((res) => {
                          if (res && res['answer']) {
                            console.log('answser created successfully for the asdfg', res, item.imageAnswers);
                            const image = item.imageAnswers;
                            if (image && image.mode !== null && image.mode !== undefined) {
                              image['answerId'] = res['answer'].Id;
                              const imageData = { image: image };
                              console.log('image to save in sign', imageData);
                              this.storeImages(imageData, fieldValue, true, true);
                            }
                          }
                        }, (err) => {
                          if (err.error && err.error.error) {
                            console.log('Error: ', err.error.error);
                          }
                        });
                    }
                  } else if (item && (item.inputTypeName === 'DynamicRadioGroupModel' ||
                    item.inputTypeName === 'DynamicSelectModel' || item.optionChoiceAnswers && item.optionChoiceAnswers.length > 0)) {
                    this.assignOptionChoiceAnswers(item.questionId, item.answer_text, item.optionGroup, item.changedElementArray);
                  } else {
                    item.elementArray = item.changedElementArray;
                    this.data.push(item);
                  }
                  //   // tslint:disable-next-line:max-line-length
                  //   fieldValue.push(item);
                  // } else {
                  //   fieldValue.push(item);
                  // }
                });
                if (window && window.cordova && this.disconnected) {
                  this.offlineStorage.updateDynamicFieldAnswers(fieldValue);
                }
                // tslint:disable-next-line:max-line-length
              } else if (question && question.inputType && question.inputType.inputTypeName === 'DynamicCustomSignatureModel' && form[question.questionName]) {

                signatureAdded = true;
                this.subscriptionObject['storeAnswerImg'] = this.reportService.storeAnswerForImages(question.id, this.editId, null)
                  .subscribe((res) => {
                    if (res && res['answer']) {
                      console.log('answser created successfully for the signature', res);
                      if (form[question.questionName].mode !== null && form[question.questionName].mode !== undefined) {
                        form[question.questionName].answerId = res['answer'].Id;
                        const imageUpload = { image: form[question.questionName] };
                        console.log('answser created successfully for the signature12');
                        this.storeImages(imageUpload, fieldValue, signatureAdded, imageAdded);
                      }
                    } else {
                      signatureAdded = false;
                    }
                  }, (err) => {
                    signatureAdded = false;
                  });
              } else {
                this.data.push({ questionId: question.id, reportId: this.editId, answer_text: form[question.questionName] });
              }
            }
          });
          if (!this.disconnected) {
            // section creation for the report created in online.
            this.subscriptionObject['createSections'] = this.reportService.createSections(this.data, this.optionChoiceAnswers, fieldValue)
              .subscribe((response) => {
                console.log('stores qus', signatureAdded, imageAdded, this.status, this.addReport);
                this.dialogInfo = element.sectionName + this.messages ? this.messages.CHANGES_SAVED : null;
                this.data = [];
                this.optionChoiceAnswers = [];
                fieldValue = [];
                console.log('details saved', this.data, this.optionChoiceAnswers, fieldValue);
                this.formSaved = true;
                // After all the sectionsaved, navigate to the  reportview page.
                if (this.status !== null && !this.addReport && !imageAdded && !signatureAdded) {
                  this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
                }
                // If addReport true then create child report(complete+) for the Master report.
                if (this.addReport && !imageAdded && !signatureAdded) {
                  this.router.navigate(['app/inspection/', this.editId, 'childreport']);
                }
              }, (err) => {
                this.data = [];
                this.optionChoiceAnswers = [];
                fieldValue = [];
                this.formSaved = true;
                if (err.error && err.error.error) {
                  this.dialogInfo = element.sectionName + this.messages.SECTION_STORE_ERROR + '\nError:' + err.error.error;
                  if (this.status !== null && !this.addReport && !imageAdded && !signatureAdded) {
                    this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
                  }
                  // If addReport true then create child report(complete+) for the Master report.
                  if (this.addReport && !imageAdded && !signatureAdded) {
                    this.router.navigate(['app/inspection/', this.editId, 'childreport']);
                  }
                }
              });
            if (this.status === 'Completed') {
              this.reportStore.changeAssignedInspectionStatus(this.editId, 3);
            }
          }
          // If network unavailable do the report creation and answer saving in the offline.
          if (window && window.cordova && this.disconnected) {
            this.offlineStorage.createSections(this.data, this.optionChoiceAnswers);
            if (this.status === 'Completed') {
              this.offlineStorage.changeAssignedInspectionStatus(this.editId, 3, 'C');
            }
            if (index === this.inspectionHeader.inspectionSections.length - 1 && this.status !== null && !this.addReport) {
              this.formSaved = true;
              this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
            }
            // If addReport true then create child report(complete+) for the Master report.
            if (this.addReport) {
              this.formSaved = true;
              this.router.navigate(['app/inspection/', this.editId, 'childreport']);
            }
          }
        }
      });
    }
  }

  storeImages(imageUpload, fieldValue, signatureAdded, imageAdded) {
    console.log('image in addition', imageUpload);
    this.reportService.storeImage(imageUpload).subscribe((response) => {
      console.log('answser created successfully for the image');
      imageAdded = false;
      signatureAdded = false;
      if (this.optionChoiceAnswers && this.status && this.optionChoiceAnswers.length === 0 &&
        this.data && this.data.length > 0 && !imageAdded && !signatureAdded) {
        console.log('emptied', this.data);
        this.data = [];
      }
      console.log('image daatas', this.status, this.data, this.optionChoiceAnswers, fieldValue, imageAdded);
      if (this.status !== null && this.data.length === 0
        && this.optionChoiceAnswers.length === 0 && fieldValue.length === 0 && !imageAdded && !signatureAdded) {
        console.log('in image saving!', this.addReport);
        this.formSaved = true;
        this.dialogInfo = this.messages.IMAGE_UPLOAD_SUCCESS;
        if (this.addReport) {
          this.router.navigate(['app/inspection/', this.editId, 'childreport']);
        } else {
          this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
        }
      }
      console.log('siganture added successfully', response);
    }, (err) => {
      if (this.status !== null && this.data.length === 0
        && this.optionChoiceAnswers.length === 0 && fieldValue.length === 0 && imageAdded) {
        this.formSaved = true;
        if (this.addReport) {
          this.router.navigate(['app/inspection/', this.editId, 'childreport']);
        } else {
          this.router.navigate(['app/inspection/', this.editId, 'report', 0]);
        }
      }

    });
  }
  assignOptionChoiceAnswers(questionId, value, optionGrp, elArray) {
    if (optionGrp) {
      optionGrp.optionChoices.find((option) => {
        if (option && option.optionChoicesValue === value) {
          // tslint:disable-next-line:max-line-length
          this.optionChoiceAnswers.push({ questionId: questionId, reportId: this.editId, optionChoiceId: option.id, elementArray: elArray });
          return true;
        }
      });
    }
  }
  /**
   * Component OnDestroy lifecycle hook.
   * And unsubscribe all the subscriptions in this component.
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
   * Method is used to inform the user when moving out from the current page without saving the data's.
   * @return {boolean}
   */
  canDeactivate(): boolean {
    return this.childSection.canDeactivate() || this.formSaved;
  }
}
