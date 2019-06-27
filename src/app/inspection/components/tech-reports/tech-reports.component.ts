// TechReportComponent define the display of the entered report details of the selected report.
import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReportService } from '../../../shared/services/report.service';
import { AuthService } from '../../../auth/services/auth.service';
import { DataService } from '../../services/data.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { DocumentViewerOptions, DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
// For notify the loading progress, while create pdf.
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
/**
 * window variable is used to define the window instance and to access the window related methods.
 * @type {any}
 */
declare var window: any;
/**
 * Component which is used to display the report preview
 */
@Component({
  selector: 'app-tech-reports',
  templateUrl: './tech-reports.component.html',
  styleUrls: ['./tech-reports.component.css']
})
export class TechReportsComponent implements OnInit, OnDestroy, DoCheck {
  /**
   * Variable which is used to define the image url.
   */
  imageUrlDb = environment.imageUrlDb;
  /**
  * Variable which is used to store the subscription and unsubscribe the store subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to decide whether the report for the current reportview is archived or not.
   * @type {boolean}
   */
  archived: boolean;
  /**
   * Variable which is used to decide whether the network available or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which is used to define the sections of the report.
   */
  reportSections = [];
  /**
   * Variable which is used to define the report index.
   * @type {number}
   */
  reportId: number;
  /**
   * Variable which is used to define the current user details.
   */
  user;
  /**
  * Variable which is used to define the title of the report.
  * @type {string}
  */
  reportTitle: string;
  /**
   * Variable which is used to define the images that uploaded to display.
   */
  images = [];
  /**
   * Variable which is used to store the dynamic field questions list details.
   * @type {any[]}
   */
  dynamicFieldQuestions = [];
  /**
   *  Variable which is used to decide whether to display the form view component or not
   */
  mobileView: boolean;
  /**
  * Variable which is used to display the contents of the top nav bar.
  */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Reports',
    'rightIcon': '', 'rightheader': ''
  };
  /**
    * Variable which is used to check whether the reportexist or not.
    * @type {boolean}
    */
  reportExist: boolean;
  /**
   * Variable which is used to define the sendEmail Form details
   */
  sendEmailForm: FormGroup;
  /**
   * Variable which is used to display the message when the PDF is sent to the mail.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to decide whether to display the loader or not.
   */
  displayLoader: boolean;
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
   * Component constructor to inject the required services.
   * @param route To get the report index from the route params.
   * @param reportService To get the reportdetails from the database.
   * @param dataService To create pdf with the current report details.
   * @param auth To get the current user details.
   * @param router To navigate the user to the desired routes.
   * @param file To save the pdf file.
   * @param document To view a pdf file in the document viewer.
   * @param spinnerDialog To show the loading status during the pdf generation.
   * @param offlineStorage To display the reportview in offline mode.
   * @param modalService To made the dialog box display.
   */
  constructor(private route: ActivatedRoute,
    private reportService: ReportService,
    private dataService: DataService,
    private auth: AuthService,
    private router: Router,
    private file: File,
    private document: DocumentViewer,
    private spinnerDialog: SpinnerDialog,
    private offlineStorage: OfflineStorageService,
    private modalService: NgbModal) {
  }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.subscriptionObject['messages'] = this.auth.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // After hiding the bottom navbar during the inspection to display that back.
    this.offlineStorage.focusMode.next(false);
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Preview';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-chevron-left';
        this.navbarDetails.rightIcon = 'assets/symbol-defs.svg#icon-pdf';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // getting reportId from the current route's parameters.
    this.subscriptionObject['routeParams'] = this.route.params.subscribe((params: Params) => {
      if (params['report_id']) {
        this.reportId = +params['report_id'];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // getting the report displayed is archived or not from the querparameter.
    this.subscriptionObject['params'] = this.route.params.subscribe((params: Params) => {
      if (params && params['archived']) {
        const isArchived = +params['archived'];
        this.archived = isArchived === 1 ? true : false;
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (!this.disconnected) {
      // get the report details from the aws database with the given report id.
      this.subscriptionObject['getReport'] = this.reportService.getReport(this.reportId).subscribe((res) => {
        const userReports = res['report'];
        if (userReports && userReports.assignInspectionUser && userReports.assignInspectionUser.inspectionHeader) {
          this.reportSections = userReports.assignInspectionUser.inspectionHeader.inspectionSections;
          this.reportSections.forEach((element) => {
            if (element && element.questions && element.questions.length > 0) {
              element.questions.forEach((question, qusId) => {
                if (question) {
                  this.reportExist = true;
                }
                // tslint:disable-next-line:max-line-length
                if (question && question.dynamicFieldQuestionId === null && (question.inputTypesProperty && (question.inputTypesProperty.inputType === 'image' ||
                  question.inputTypesProperty.inputType === 'signature'))) {
                  question.answers.forEach((answer) => {
                    if (answer && answer.imageAnswers) {
                      answer.imageAnswers.forEach((image) => {
                        if (image && image.sectionName) {
                          const sectionName = image.sectionName;
                          if (this.images.length > 0) {
                            let flag = false;
                            this.images.find((imgSection) => {
                              if (imgSection && imgSection.sectionName === sectionName) {
                                flag = true;
                                imgSection.img.push(image);
                                return true;
                              }
                            });
                            if (!flag) {
                              this.images.push({ sectionName: sectionName, img: [image] });
                            }
                          } else {
                            this.images.push({ sectionName: sectionName, img: [image] });
                          }
                        }
                      });
                    }
                  });
                } else if (question && (question.dynamicFieldQuestionId !== null
                  && question.dynamicFieldQuestionId !== undefined)) {
                  this.displayDynamicFieldQuestions(element);
                }
              });
            } else if (this.reportExist !== true) {
              this.reportExist = false;
            }
          });
        }
      }, (err) => {
        if (err.error && err.error.error) {
          this.display = true;
          this.dialogBoxDetails = {
            header: this.messages.HEADER_MESSAGE,
            content: err.error.error,
            action: [{ label: 'Okay', value: 'navigate' }]
          };
        }
      });
    }
    // If the device is not connected with the internet, then get the report details
    // (inspectionHeader,sections,questions,answers) from the local database.
    if (window.cordova) {
      this.subscriptionObject['network'] = this.offlineStorage.networkDisconnected.subscribe((value: boolean) => {
        this.disconnected = value;
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
      if (this.disconnected) {
        // get report details from the local db with the given reportId.
        this.offlineStorage.getReport(this.reportId)
          .then((reportdetails) => {
            for (let i = 0; i < reportdetails.rows.length; i++) {
              // get report details from the local db with the report's assignInspectionUserId.
              this.offlineStorage.getAssignedInspectiondetails(reportdetails.rows.item(i).assignedInspectionUserId)
                .then((assignedDetails) => {
                  for (let j = 0; j < assignedDetails.rows.length; j++) {
                    // got the inspectionHeader details by the headerId from local db.
                    this.offlineStorage.getInspection(assignedDetails.rows.item(i).inspectionHeaderId)
                      .then((inspections) => {
                        for (let inspectionId = 0; inspectionId < inspections.rows.length; inspectionId++) {
                          // got inspection sections of the inspectionHeader from local db.
                          this.offlineStorage.getInspectionSections(inspections.rows.item(inspectionId).id)
                            .then((sections) => {
                              this.reportSections = [];
                              for (let secId = 0; secId < sections.rows.length; secId++) {
                                this.reportSections.push(sections.rows.item(secId));
                                // got questions of the inspection sections from local db.
                                this.offlineStorage.getQuestionsWithDynamicField(sections.rows.item(secId).id)
                                  .then((questions) => {
                                    const questionsArray = [];
                                    if (questions && questions.rows && questions.rows.length > 0) {
                                      this.reportExist = true;
                                    } else if (this.reportExist !== true) {
                                      this.reportExist = false;
                                    }
                                    for (let qusId = 0; qusId < questions.rows.length; qusId++) {
                                      let inputTypesProperty: any;
                                      // got inputTypeProperties of the questions from local db.
                                      this.offlineStorage.getInputTypeProperties(questions.rows.item(qusId).inputTypePropertyId)
                                        .then((inputProperties) => {
                                          inputTypesProperty = inputProperties.rows.item(0);
                                        }).catch((e) => { console.log('error in input property', e.message); });
                                      // got answers for the questions of the report.
                                      this.offlineStorage.getAnswersByquestionId(this.reportId, questions.rows.item(qusId).id)
                                        .then((answers) => {
                                          if (answers.rows.length > 0) {
                                            questionsArray.push(questions.rows.item(qusId));
                                            const questionId = questionsArray.length - 1;
                                            questionsArray[questionId].answers = [];
                                            questionsArray[questionId].inputTypesProperty = inputTypesProperty;
                                            if (questions.rows.length - 1 === qusId) {
                                              this.reportSections[secId].questions = questionsArray;
                                              this.displayDynamicFieldQuestions(this.reportSections[secId]);
                                            }
                                            // got imageanswers for the questions in report.
                                            for (let ansId = 0; ansId < answers.rows.length; ansId++) {
                                              questionsArray[questionId].answers.push(answers.rows.item(ansId));
                                              this.offlineStorage.getImageAnswers(answers.rows.item(ansId).Id)
                                                .then((imageAnswers) => {
                                                  if (imageAnswers.rows.length > 0) {
                                                    questionsArray[questionId].answers[ansId].imageAnswers = [];
                                                    for (let imgId = 0; imgId < imageAnswers.rows.length; imgId++) {
                                                      if (imageAnswers.rows.item(imgId) && imageAnswers.rows.item(imgId).sectionName) {
                                                        const sectionName = imageAnswers.rows.item(imgId).sectionName;
                                                        if (this.images.length > 0) {
                                                          let flag = false;
                                                          this.images.find((imgSection) => {
                                                            if (imgSection && imgSection.sectionName === sectionName) {
                                                              flag = true;
                                                              imgSection.img.push(imageAnswers.rows.item(imgId));
                                                              return true;
                                                            }
                                                          });
                                                          if (!flag) {
                                                            // tslint:disable-next-line:max-line-length
                                                            this.images.push({ sectionName: sectionName, img: [imageAnswers.rows.item(imgId)] });
                                                          }
                                                        } else {
                                                          // tslint:disable-next-line:max-line-length
                                                          this.images.push({ sectionName: sectionName, img: [imageAnswers.rows.item(imgId)] });
                                                        }
                                                      }
                                                    }
                                                  }
                                                }).catch((e) => { console.log('error in image got in report view', e.message); });
                                              // got optionChoiceanswers for the questions in report.
                                              this.offlineStorage.getOptionChoiceAnswers(answers.rows.item(ansId).Id)
                                                .then((options) => {
                                                  questionsArray[questionId].answers[ansId].optionChoiceAnswers = [];
                                                  for (let optId = 0; optId < options.rows.length; optId++) {
                                                    // tslint:disable-next-line:max-line-length
                                                    questionsArray[questionId].answers[ansId].optionChoiceAnswers.push(options.rows.item(optId));
                                                    // tslint:disable-next-line:max-line-length
                                                    this.offlineStorage.getOptionChoicesById(options.rows.item(optId).optionChoiceId).then((optionValue) => {
                                                      for (let optValueId = 0; optValueId < optionValue.rows.length; optValueId++) {
                                                        // tslint:disable-next-line:max-line-length
                                                        questionsArray[questionId].answers[ansId].optionChoiceAnswers[optId].optionChoice = optionValue.rows.item(optValueId);
                                                      }
                                                    }).catch((e) => {
                                                      console.log('error in options choce value got', e.message);
                                                    });
                                                  }
                                                }).catch((e) => { console.log('error in options got report view', e.message); });
                                            }
                                          } else {
                                            if (questions.rows.length - 1 === qusId) {
                                              this.reportSections[secId].questions = questionsArray;
                                              this.displayDynamicFieldQuestions(this.reportSections[secId]);
                                            }
                                          }
                                        }).catch((e) => { console.log('error in report view', e.message); });
                                    }

                                  }).catch((e) => {
                                    console.log('error in question report view', e.message);
                                  });
                              }
                            }).catch((e) => { console.log('error in section of report view', e.message); });
                        }
                      }).catch((e) => { console.log('error in inspection detail in report view', e.message); });
                  }
                }).catch((error) => {
                  console.log('error in assignInspect in report view', error.message);
                });
            }

          });
      }
    }
    // The current logged in user informations got.
    this.subscriptionObject['user'] = this.auth.user.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }
  /**
  * Component docheck lifecycle hook.
  */
  ngDoCheck() {
    if (this.reportExist === true) {
      this.navbarDetails.rightIcon = 'assets/symbol-defs.svg#icon-pdf';
    }
  }
  /**
   * Method which is used to display a model for send the email.
   * @param group local reference variable.
   */
  openEmailModel(sendEmail) {
    this.sendEmailForm = new FormGroup({
      'to': new FormControl(null, [Validators.email, Validators.required]),
      'subject': new FormControl(null),
      'message': new FormControl(null)
    });
    this.modalService.open(sendEmail, { centered: true });
  }
  /**
   * Method which is used to create pdf file of the report.
   * @return {void}
   */
  createPdf(emailDetails?, mailNotification?): void {
    this.displayLoader = true;
    let filepath;
    if (emailDetails) {
      this.dialogBoxDetails.action = [];
      this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
      this.dialogBoxDetails.action.push({ label: 'Okay' });
      this.subscriptionObject['createPDF'] = this.dataService.createPDF(this.reportId, emailDetails).subscribe((res) => {
        this.displayLoader = false;
        if (res['emailSend']) {
          console.log('email', res['emailSend']);
          this.dialogBoxDetails.content = res['emailSend'];
          this.display = true;
        }
      }, (err) => {
        this.displayLoader = false;
        this.dialogBoxDetails.content = err.error.error;
        this.display = true;
      });
    } else {
      this.displayLoader = true;
      this.spinnerDialog.show();
      this.subscriptionObject['pdf'] = this.dataService.createPDF(this.reportId).subscribe((res) => {
        filepath = res ? res['filePath'] : '';
        // after creating the pdf download the pdf with the filepath.
        if (filepath) {
          // const pdfUrl = this.dataService.downoadPDF(filepath);
          if (window && window.cordova) {
            const options = {
              documentSize: 'A4',
              type: 'base64'
            };
            window.pdf.fromURL(filepath, options)
              .then((base64) => {
                // To define the type of the Blob
                const contentType = 'application/pdf';
                const fileName = filepath.substr(filepath.lastIndexOf('/') + 1);
                this.reportTitle = fileName;
                // if cordova.file is not available use instead :
                // var folderpath = "file:///storage/emulated/0/Download/";
                this.savebase64AsPDF(this.file.documentsDirectory, fileName, base64, contentType);
              })
              .catch((err) => console.error(err));
            // const browser = this.iab.create(pdfUrl, '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
            // browser.show();
          } else {
            this.displayLoader = false;
            window.open(filepath);
          }
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
  }

  /**
   * Method which is used to show the document.
   * @return {void}
   */
  onShow() {
    console.log('document can be shown');
    // e.g. track document usage
  }

  /**
   * Method which is used to close the document.
   * @return {void}
   */
  onClose(that: any) {
    // e.g. remove temp files
    that.file.removeFile(that.file.documentsDirectory, that.reportTitle)
      .then(status => {
        console.log('File Removed', status);
      });
  }
  /**
   * Method which is used to save the dynamic field questions in array.
   * @param sections which is used to define the inspection section with questions
   */
  displayDynamicFieldQuestions(sections: any) {
    if (sections && sections.questions) {
      sections.questions.forEach((question, qusId) => {
        // Check question have dynamic field question id
        if (question && ((question.dynamicFieldQuestionId !== null &&
          question.dynamicFieldQuestionId !== undefined))) {
          const dynamicQuestion = question;
          sections.questions[qusId] = null;
          let flag: boolean;
          dynamicQuestion.answers.forEach((answer) => {
            if (answer) {
              answer.questionName = dynamicQuestion.questionName;
              answer.value = answer.answer_text;
              if (answer.imageAnswers) {
                answer.imageAnswers.forEach((image) => {
                  answer.value = image.thumnailImage;
                });
              }
              this.dynamicFieldQuestions.forEach((fieldQuestion) => {
                if (fieldQuestion && fieldQuestion.dynamicFieldQuestionId === dynamicQuestion.dynamicFieldQuestionId) {
                  flag = true;
                  const value = fieldQuestion.answers.find((fieldAnswer) => {
                    if (fieldAnswer && answer.elementArray === fieldAnswer.elementArray && answer.updateIndicator !== 'D') {
                      fieldAnswer.value.push(answer);
                      return fieldAnswer;
                    }
                  });
                  if (value === null || value === undefined && answer.updateIndicator !== 'D') {
                    fieldQuestion.answers.push({
                      elementArray: answer.elementArray,
                      value: [answer]
                    });
                  }
                }
              });
              if (!flag && answer.updateIndicator !== 'D') {
                const answers = [];
                answers.push({
                  elementArray: answer.elementArray,
                  value: [answer]
                });
                this.dynamicFieldQuestions.push({
                  dynamicFieldQuestionId: dynamicQuestion.dynamicFieldQuestionId,
                  answers: answers
                });
                if (!this.disconnected) {
                  // tslint:disable-next-line:max-line-length
                  this.subscriptionObject['getDynamicField'] = this.reportService.getDynamicFieldElementQuestionById(dynamicQuestion.dynamicFieldQuestionId)
                    .subscribe((questionRes) => {
                      if (questionRes && questionRes['question']) {
                        this.dynamicFieldQuestions.forEach((item, index) => {
                          if (item && item.dynamicFieldQuestionId === questionRes['question'].id) {
                            questionRes['question'].dynamicFieldQuestionId = item.dynamicFieldQuestionId;
                            this.dynamicFieldQuestions[index] = Object.assign({}, item, questionRes['question']);
                            sections.questions.push(this.dynamicFieldQuestions[index]);
                            sections.questions.sort(function (a, b) {
                              if (a && b) {
                                return a.displayPositionIndex - b.displayPositionIndex;
                              } else if (a) {
                                return 1;
                              } else if (b) {
                                return -1;
                              }
                            });
                            return item;
                          }
                        });
                      }
                    }, (err) => {
                      if (err.error && err.error.error) {
                        console.log('Error: ', err.error.error);
                      }
                    });
                } else {
                  this.offlineStorage.getDynamicFieldElementQuestionById(dynamicQuestion.dynamicFieldQuestionId).then((questions) => {
                    for (let id = 0; id < questions.rows.length; id++) {
                      let inputTypesProperty: any;
                      // got inputTypeProperties of the questions from local db.
                      this.offlineStorage.getInputTypeProperties(questions.rows.item(id).inputTypePropertyId)
                        .then((inputProperties) => {
                          inputTypesProperty = inputProperties.rows.item(0);
                          questions.rows.item(id).inputTypesProperty = inputTypesProperty;
                          this.dynamicFieldQuestions.forEach((item, index) => {
                            if (item && item.dynamicFieldQuestionId === questions.rows.item(id).id) {
                              questions.rows.item(id).dynamicFieldQuestionId = item.dynamicFieldQuestionId;
                              this.dynamicFieldQuestions[index] = Object.assign({}, item, questions.rows.item(id));
                              sections.questions.push(this.dynamicFieldQuestions[index]);
                              sections.questions.sort(function (a, b) {
                                if (a && b) {
                                  return a.displayPositionIndex - b.displayPositionIndex;
                                } else if (a) {
                                  return 1;
                                } else if (b) {
                                  return -1;
                                }
                              });
                              return item;
                            }
                          });
                        }).catch((e) => { console.log('error in input property', e.message); });
                    }
                  }).catch((e) => {
                    console.log('error in get dynamic field element question', e.message);
                  });
                }
              }
            }
          });
        }
      });
    }
  }

  /**
   * If pdfviewer not installed, ask want to install the pdfviewer in android devices.
   * @return {void}
   */
  onMissingApp(appId: number, installer: any) {
    if (confirm('Do you want to install the free PDF Viewer App ' + appId + ' for Android?')) {
      installer();
    }
  }

  /**
   * Error when can't open the document.
   * @return {void}
   */
  onError(error) {
    console.log(error);
    alert('Sorry! Cannot view document.');
  }
  /**
   * Method which is used to display the uploaded images in the inspection on section basis.
   * @param sectionName {string} Section name to which the images are uploaded.
   * @param index {number} The index of the image.
   * @return {void}
   */
  imageGallery(sectionName: string, index: number) {
    if (!this.mobileView) {
      this.router.navigate([sectionName, index, 'image'], { relativeTo: this.route });
    }
  }
  /**
   * Method which is used to decide the path while navigation.
   */
  onNavigate() {
    if (this.user && this.user.role === 'Admin') {
      this.router.navigate(['/app/inspection/reports']);
    } else {
      this.router.navigate(['/app/inspection/technicianreports']);
    }
  }
  /**
  * Convert a base64 string in a Blob according to the data and contentType.
  *
  * @param b64Data {String} Pure base64 string without contentType
  * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
  * @param sliceSize {Int} SliceSize to process the byteCharacters
  * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  * @return Blob
  */
  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  /**
  * Create a PDF file according to its database64 content only.
  *
  * @param folderpath {String} The folder where the file will be created
  * @param filename {String} The name of the file that will be created
  * @param content {Base64 String} Important : The content can't contain the following string
  * (data:application/pdf;base64). Only the base64 string is expected.
  */
  savebase64AsPDF(folderpath, filename, content, contentType) {
    // Convert the base64 string in a Blob
    const DataBlob = this.b64toBlob(content, contentType);
    // If the pdf is less than 20 mb only the pdf will be displayed in the devices.

    if (DataBlob && DataBlob.size < 20322656) {
      window.resolveLocalFileSystemURL(folderpath, (dir) => {
        dir.getFile(filename, { create: true }, (file) => {
          file.createWriter((fileWriter) => {
            fileWriter.write(DataBlob);
            fileWriter.onwriteend = (evt) => {
              const option: DocumentViewerOptions = {
                title: filename,
                documentView: {
                  closeLabel: 'Done'
                },
                navigationView: {
                  closeLabel: 'Done'
                },
                email: {
                  enabled: true
                },
                print: {
                  enabled: true
                },
                openWith: {
                  enabled: true
                },
                bookmarks: {
                  enabled: false
                },
                search: {
                  enabled: true
                },
                autoClose: {
                  onPause: true
                }
              };
              this.document.viewDocument(folderpath + filename, 'application/pdf', option,
                this.onShow, () => this.onClose(this), this.onMissingApp, this.onError);
              this.spinnerDialog.hide();
            };
          }, () => {
            this.spinnerDialog.hide();
            alert('Unable to save file in path ' + folderpath);
          });
        });
      });
    } else {
      this.spinnerDialog.hide();
      alert('This pdf file is too large to open in this device!');
    }
  }
  /**
  * Method which is used to define which action is triggered.
  * @param event event {any} To define the event value.
  */
  dialogBoxAction(event) {
    this.display = false;
    if (event === 'navigate') {
      this.router.navigate(['/signin']);
    }
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.display = event;
  }
  /**
   * Component OnDestroy life cycle hook
   * And unsubscribe all the subscriptions inside the component.
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
