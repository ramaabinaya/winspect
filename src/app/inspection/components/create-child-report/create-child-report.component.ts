// CreateChildReportComponent is for creating child report, that is Blabe Inspection report
// to the corresponding turbine Reports.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReportService } from '../../../shared/services/report.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AssignInspectionUsers } from '../../model/assignInspectionUsers.model';
import { InspectionService } from '../../../shared/services/inspection.service';
import { DynamicFormGroupService } from '../../../common/services/dynamic-form-group.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { CommonReportDataService } from '../../../shared/services/common-report-data.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { Inspection } from '../../model/inspection.model';
import { User } from '../../../user/model/user.model';
import { filter, mergeMap } from 'rxjs/operators';
/**
 * window variable to access the window related methods.
 * @type {any}
 */
declare let window: any;

/**
 * CreateChildReportComponent is for creating child report, that is Blabe Inspection report
 * to the corresponding turbine Reports.
 */
@Component({
  selector: 'app-create-child-report',
  templateUrl: './create-child-report.component.html',
  styleUrls: ['./create-child-report.component.css']
})
export class CreateChildReportComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to subscribe or unsubscribe the formDetails.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to decide whether the network is available or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which is used to define the id of the report for which we are going to create the child report.
   * @type {number}
   */
  reportId: number;
  /**
   * Variable which is used to define the common question's data in the child report creation.
   * @type {any}
   */
  commonQuestionData;
  /**
   * Variable which is used to decide whether the create report dialog needs to be display or not.
   * @type {boolean}
   */
  displayDialog: boolean;
  /**
   * Variable which is used to define the bladeType(.i.e Master or child).
   * @type {string}
   */
  bladeDetails;
  /**
   * Variable which is used to define the current user information.
   * @type {any}
   */
  currentUser: User;
  /**
   * Variable which is used to define the formdetails of the selected inspection.
   * @type {any}
   */
  inspectionHeader: Inspection;
  /**
   * Variable which is used to define the id of the report.
   * @type {number}
   */
  editId: number;
  /**
   * Variable which is used to decide whether to display the dialog for getting the BladeReport type.
   * @type {boolean}
   */
  dialogVisible: boolean;

  /**
   * Component constructor used to inject the required services.
   * @param route To get the current activated route and route params.
   * @param commonReportDataService To set the common question's datas to the section's questions.
   * @param reportService To create report with the given needed informations.
   * @param offlineStorage To make the child report creation functionality in offline.
   * @param authService To get the current user details.
   * @param inspectionService To assign the inspection for creating complete+ child reports.
   * @param dynamicFormGroupService To get the inspection details for displaying the form properly.
   * @param router To navigate the user to the provided path.
   * @param reportStore To get all report details.
   */
  constructor(private route: ActivatedRoute,
    private commonReportDataService: CommonReportDataService,
    private reportService: ReportService,
    private offlineStorage: OfflineStorageService,
    private authService: AuthService,
    private inspectionService: InspectionService,
    private dynamicFormGroupService: DynamicFormGroupService,
    private router: Router,
    private reportStore: ReportStore) { }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    // Route subscription for accessing the currently activated route's parameters.
    this.subscriptionObject['route'] = this.route.params.subscribe((params: Params) => {
      this.reportId = +params['reportid'];
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });

    // Set data for setting the common fields values to the variable data.
    this.commonReportDataService.setData(this.reportId);

    if (!this.disconnected) {
      // datasubscription to get that common field's datas and check whether the current report is 'Master report' or 'child report'.
      this.subscriptionObject['changedData'] = this.commonReportDataService.dataChanged.subscribe((data) => {
        this.commonQuestionData = data;
        this.bladeDetails = {};
        if (data && data.bladeType) {
          this.bladeDetails['bladeType'] = data.bladeType;
          this.bladeDetails['bladeView'] = data.bladeType === 'M';
          this.dialogVisible = data.bladeType !== 'M';
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
  }

  /**
   * Method which is used to get the current formdetails.
   * @param name {string} Parameter which defines the inspectionName.
   * @return {void}
   */
  getFormDetails(name: string) {
    this.displayDialog = false;
    if (!this.disconnected) {
      this.subscriptionObject['form'] = this.dynamicFormGroupService.getFormDetails(name).subscribe((res) => {
        if (res && res['inspectionHeader']) {
          this.inspectionHeader = res['inspectionHeader'];
          if (this.inspectionHeader) {
            this.createChildReport();
          }
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
    // Offline Functionality of child report creation in the case of error response.
    // If cordova is exist then found whether network is available or not.
    if (window && window.cordova) {
      this.subscriptionObject['network'] = this.offlineStorage.networkDisconnected.subscribe((value: boolean) => {
        this.disconnected = value;
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
      // If the network is unavailable, then create the child report in offline.
      // here we get the inspection details by the given Inspectionname and with that details create the child report.
      if (this.disconnected) {
        this.offlineStorage.getInspectionHeader(name)
          .then((inspection) => {
            for (let i = 0; i < inspection.rows.length; i++) {
              this.inspectionHeader = inspection.rows.item(i);
              // get the inspection sections by using inspectionHeader id.
              this.offlineStorage.getInspectionSections(inspection.rows.item(i).id)
                .then((inspectionSection) => {
                  this.inspectionHeader.inspectionSections = [];
                  for (let sectionId = 0; sectionId < inspectionSection.rows.length; sectionId++) {
                    this.inspectionHeader.inspectionSections.push(inspectionSection.rows.item(sectionId));
                    // get the questions for each section with the sectionId.
                    this.offlineStorage.getQuestions(inspectionSection.rows.item(sectionId).id)
                      .then((question) => {
                        const questions = [];
                        for (let questionId = 0; questionId < question.rows.length; questionId++) {
                          questions.push(question.rows.item(questionId));
                          // get the inputtypeProperties for the questions.
                          this.offlineStorage.getInputTypeProperties(question.rows.item(questionId).inputTypePropertyId)
                            .then((inputTypesProperties) => {
                              questions[questionId].inputTypesProperty = {};
                              if (inputTypesProperties && inputTypesProperties.rows.length > 0) {

                                // tslint:disable-next-line:max-line-length
                                for (let inputTypePropertyId = 0; inputTypePropertyId < inputTypesProperties.rows.length; inputTypePropertyId++) {
                                  questions[questionId].inputTypesProperty = (inputTypesProperties.rows.item(inputTypePropertyId));
                                }
                                // tslint:disable-next-line:max-line-length
                                if (question && question.rows.item.length - 1 === questionId && question.rows.item(questionId).optionGroupId === null) {
                                  if (inspectionSection && inspectionSection.rows.length - 1 === sectionId) {
                                    this.createChildReport();
                                  }
                                }
                              }

                            }).catch((errorMessage) => {
                              console.log('error got in the inputTypes  in for', errorMessage.message);

                            });
                          // get optiongroups of the questions by the questionId.
                          this.offlineStorage.getOptionGroups(question.rows.item(questionId).optionGroupId)
                            .then((optionGroup) => {
                              questions[questionId].optionGroup = {};
                              for (let optionGroupId = 0; optionGroupId < optionGroup.rows.length; optionGroupId++) {
                                questions[questionId].optionGroup = (optionGroup.rows.item(optionGroupId));
                                this.offlineStorage.getOptionChoices(optionGroup.rows.item(optionGroupId).id)
                                  .then((optionChoice) => {
                                    const optionChoices = [];
                                    if (optionChoice && optionChoice.rows.length > 0) {
                                      for (let optionChoiceId = 0; optionChoiceId < optionChoice.rows.length; optionChoiceId++) {
                                        optionChoices.push(optionChoice.rows.item(optionChoiceId));
                                      }
                                      if (question && question.rows.item.length - 1 === questionId) {
                                        if (inspectionSection && inspectionSection.rows.length - 1 === sectionId) {
                                          this.createChildReport();
                                        }
                                      }

                                    }
                                    questions[questionId].optionGroup.optionChoices = optionChoices;


                                  }).catch((e) => {
                                    console.log('error in optionChoice in for', e.message);
                                  });
                              }
                            }).catch((error) => {
                              console.log('error in optiongroup in for', error.message);
                            });
                        }
                        this.inspectionHeader.inspectionSections[sectionId]['questions'] = questions;
                      }).catch((error1) => {
                        console.log('error in question in getfrms for', error1.message);
                      });
                  }
                }).catch((e) => { console.log('error in inspection sections', e.message); });
            }
          }).catch((e) => {
            console.log('error in get forms inspection header', e.message);
          });
      }
    }
  }

  /**
   * Method which is used to create the child report.
   * @return {void}
   */
  createChildReport() {
    let assignedInspection;
    // current user details got.
    let userId;
    this.subscriptionObject['user'] = this.authService.user.subscribe((user) => {
      const currentUser = user;
      userId = currentUser ? currentUser.id : null;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    const inspectionHeaderId = this.inspectionHeader ? this.inspectionHeader.id : null;
    // assign the inspection to the user for creating child report.
    assignedInspection = new AssignInspectionUsers(userId, inspectionHeaderId, 2, null, this.commonQuestionData.windMillFormId, null, '');
    if (!this.disconnected) {
      let assignedInspectionId, reportName, status;
      this.subscriptionObject['inspection'] = this.inspectionService.assignInspection(assignedInspection).pipe(filter((response) => {
        this.reportStore.createNewAssignInspection(response['assignedInspection']);
        assignedInspectionId = response['assignedInspection'].id;
        reportName = 'Report ' + assignedInspectionId;
        status = 2;
        return true;
      }), mergeMap(() => {
        return this.reportService.createReport(assignedInspectionId, this.commonQuestionData.windturbineId, reportName, status,
          this.bladeDetails['bladeType']);
      })).subscribe((res) => {
        if (res && res['report']) {
          this.reportStore.createReport(assignedInspectionId, status, res['report']);
          this.editId = res['report'].id;
          this.saveCommonSectionDetails(inspectionHeaderId);
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
    // child report creation in offline.Here we check whether cordova is available.

    if (window && window.cordova) {
      // And check whether the network conected or disconnected.If disconnected do the functionality in offline.
      if (this.disconnected) {
        // Inspection assigned locally in offlinemode.
        this.offlineStorage.assignInspection(assignedInspection).then((assignedInspections) => {
          const assignedInspectionId = assignedInspections.insertId;
          const reportName = 'Report ' + assignedInspectionId;
          const status = 2;
          // create the child report with the available information in offline.
          this.offlineStorage.createReport(assignedInspectionId, this.commonQuestionData.windturbineId, reportName, status,
            this.bladeDetails['bladeType'])
            .then((report) => {
              this.editId = report.insertId;
              this.saveCommonSectionDetails(inspectionHeaderId);
            }).catch((e) => {
              console.log('error in crete child report inspection', e.message);
            });
        }).catch((e) => {
          console.log('error in assign inspection', e.message);
        });
      }
    }
  }
  /**
   * Method which is used to save common questions in created report.
   * @param inspectionHeaderId {number} which is used to define the header id.
   */

  saveCommonSectionDetails(inspectionHeaderId: number) {
    let answers = [];
    let optionChoiceAnswers = [];
    let sectionAdded = false;
    if (this.inspectionHeader && this.inspectionHeader.inspectionSections) {
      this.inspectionHeader.inspectionSections.forEach((element, index) => {
        answers = [];
        optionChoiceAnswers = [];
        if (element && element.isCommon && element['questions']) {
          sectionAdded = true;
          element['questions'].forEach((question, qid) => {
            if (question && this.commonQuestionData && this.commonQuestionData.answers &&
              this.commonQuestionData.answers.hasOwnProperty(question.questionName)) {
              if (question && question.inputTypesProperty && question.inputTypesProperty.inputType === 'text') {
                // tslint:disable-next-line:max-line-length
                answers.push({ questionId: question.id, reportId: this.editId, answer_text: this.commonQuestionData.answers[question.questionName] });
              } else if (question && question.inputTypesProperty && question.inputTypesProperty.inputType === 'number') {
                // tslint:disable-next-line:max-line-length
                answers.push({ questionId: question.id, reportId: this.editId, answer_numeric: this.commonQuestionData.answers[question.questionName] });
              } else if (question && question.optionGroupId && question.optionGroup && question.optionGroup.optionChoices) {
                const optionGroup = question.optionGroup;
                optionGroup.optionChoices.forEach((option) => {
                  if (option && option.optionChoicesValue === this.commonQuestionData.answers[question.questionName]) {
                    // tslint:disable-next-line:max-line-length
                    optionChoiceAnswers.push({ questionId: question.id, reportId: this.editId, optionChoiceId: option.id });
                  }
                });
                // tslint:disable-next-line:max-line-length
              } else {
                answers.push({
                  questionId: question.id,
                  reportId: this.editId,
                  answer_text: this.commonQuestionData.answers[question.questionName]
                });
              }
            }
          });
          if (!this.disconnected) {
            // create sections for the created reports in online.
            this.subscriptionObject['section'] = this.reportService.createSections(answers, optionChoiceAnswers, null)
              .subscribe((sectionsAnswer) => {
                sectionAdded = false;
                this.router.navigate(['app/inspection', inspectionHeaderId, this.editId, 'editinspection']);
              }, (err) => {
                sectionAdded = false;
                this.router.navigate(['app/inspection', inspectionHeaderId, this.editId, 'editinspection']);
              });
          } else if (window && window.cordova && this.disconnected) {
            this.offlineStorage.createSections(answers, optionChoiceAnswers);
            // The child report sections displayed by navigating to that inspectionform.
            this.router.navigate(['app/inspection', inspectionHeaderId, this.editId, 'editinspection']);
          }
          // tslint:disable-next-line:max-line-length
        } else if (!sectionAdded && this.inspectionHeader && this.inspectionHeader.inspectionSections && this.inspectionHeader.inspectionSections.length - 1 === index) {
          this.router.navigate(['app/inspection', inspectionHeaderId, this.editId, 'editinspection']);
        }

      });
    }
  }

  /**
   * Component OnDestroy life cycle hook.
   * The unsubscribe of the subscriptions are done.
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
   * Method which is used to close the dialog box while clicking cancel button.
   */
  onCloseDialog() {
    if (this.bladeDetails['bladeView']) {
      this.bladeDetails['bladeView'] = false;
    }
    this.displayDialog = false;
    this.router.navigate(['app/inspection', this.reportId, 'report', 0]);
  }
}
