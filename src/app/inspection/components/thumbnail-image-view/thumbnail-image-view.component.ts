// ThumnailImageViewComponent displays the image as the small thumnail image.
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReportService } from '../../../shared/services/report.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { environment } from '../../../../environments/environment';
/**
 * window variable is used to define the window instance and to access the window related methods.
 * @type {any}
 */
declare var window: any;
/**
 * Component which creates and displays the image in the thumnailview.
 */
@Component({
  selector: 'app-thumbnail-image-view',
  templateUrl: './thumbnail-image-view.component.html',
  styleUrls: ['./thumbnail-image-view.component.css']
})
export class ThumbnailImageViewComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to check whether the network is connected or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable which is used to define the imageUrl that we have to uploaded.
   * @type {string}
   */
  imageUrlDb: string;
  /**
  * Variable which is used to store the subscription and unsubscribe the store subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to define the index of the image.
   * @type {number}
   */
  imgId: number;
  /**
   * Variable which is used to define the sectionName to which the images are uploaded.
   * @type {string}
   */
  sectionName: string;
  /**
   * Variable which is used to define the array of images of the particular blade section.
   */
  images = [];
  /**
   * Variable which is used to define the index of the report to which the imges are related.
   * @type {number}
   */
  reportId: number;
  /**
   * Component constructor used to inject the required services.
   * @param route To get the report id from the current activated route.
   * @param reportService To get the report details from the database.
   * @param router To navigate the user to the desired routes.
   * @param offlineStorage To get data in offline mode.
   */
  constructor(private route: ActivatedRoute,
    private reportService: ReportService,
    private router: Router,
    private offlineStorage: OfflineStorageService) { }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.imageUrlDb = environment.imageUrlDb;
    // To get network status
    this.subscriptionObject['network'] = this.offlineStorage.networkDisconnected.subscribe((value: boolean) => {
      this.disconnected = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // get the reportd from the parent route parameters.
    this.subscriptionObject['parentRoute'] = this.route.parent.params.subscribe((params: Params) => {
      if (params['report_id']) {
        this.reportId = +params['report_id'];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // get the sectionName from the current activated route parameters.
    this.subscriptionObject['route'] = this.route.params.subscribe((params: Params) => {
      if (params['sectionName']) {
        this.sectionName = params['sectionName'];
        this.imgId = +params['imgId'];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // get the report details by the given report id from the database.
    this.subscriptionObject['getReport'] = this.reportService.getReport(this.reportId).subscribe((res) => {
      const userReports = res['report'];
      if (userReports && userReports.assignInspectionUser && userReports.assignInspectionUser.inspectionHeader) {
        // inspectionsections of inspectionheader got and assigned to reportSections.
        const reportSections = userReports.assignInspectionUser.inspectionHeader.inspectionSections;
        reportSections.forEach((element) => {
          if (element && element.questions) {
            element.questions.forEach((question) => {
              if (question && question.inputTypesProperty && question.inputTypesProperty.inputType === 'image') {
                question.answers.forEach((answer) => {
                  // inspection section's image answers pushed in the images variable
                  // and the imagelocation value updated here.
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
    if (window.cordova) {
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
                              for (let secId = 0; secId < sections.rows.length; secId++) {
                                // got questions of the inspection sections from local db.
                                this.offlineStorage.getQuestions(sections.rows.item(secId).id)
                                  .then((questions) => {
                                    for (let qusId = 0; qusId < questions.rows.length; qusId++) {
                                      let inputTypesProperty: any;
                                      // got inputTypeProperties of the questions from local db.
                                      this.offlineStorage.getInputTypeProperties(questions.rows.item(qusId).inputTypePropertyId)
                                        .then((inputProperties) => {
                                          inputTypesProperty = inputProperties.rows.item(0);
                                          if (inputTypesProperty.inputType === 'image') {
                                            this.offlineStorage.getAnswersByquestionId(this.reportId, questions.rows.item(qusId).id)
                                              .then((answers) => {
                                                if (answers.rows.length > 0) {
                                                  // got imageanswers for the questions in report.
                                                  for (let ansId = 0; ansId < answers.rows.length; ansId++) {
                                                    // tslint:disable-next-line:max-line-length
                                                    if (!answers.rows.item(ansId).answer_text && !answers.rows.item(ansId).answer_yn && !answers.rows.item(ansId).answer_numeric) {
                                                      this.offlineStorage.getImageAnswers(answers.rows.item(ansId).Id)
                                                        .then((imageAnswers) => {
                                                          if (imageAnswers.rows.length > 0) {
                                                            for (let imgId = 0; imgId < imageAnswers.rows.length; imgId++) {
                                                              // tslint:disable-next-line:max-line-length
                                                              if (imageAnswers.rows.item(imgId) && imageAnswers.rows.item(imgId).sectionName) {
                                                                const sectionName = imageAnswers.rows.item(imgId).sectionName;
                                                                if (this.images.length > 0) {
                                                                  let flag = false;
                                                                  this.images.forEach((imgSection) => {
                                                                    if (imgSection && imgSection.sectionName === sectionName) {
                                                                      flag = true;
                                                                      imgSection.img.push(imageAnswers.rows.item(imgId));
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
                                                    }
                                                  }
                                                }
                                              }).catch((e) => { console.log('error in report view', e.message); });
                                          }
                                        }).catch((e) => { console.log('error in input property', e.message); });
                                      // got answers for the questions of the report.
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
  }
  /**
   * Method which is used to close the preview of the image when clicking the close icon.
   * @return {void}
   */
  closeImageModal() {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }
  /**
   * Component OnDestroy lifecycle hook.
   * And unsubscribe all the subscriptions in the component.
   */
  ngOnDestroy() {
    if (this.subscriptionObject) {
      for (const subscriptioProperty in this.subscriptionObject) {
        if (this.subscriptionObject[subscriptioProperty]) {
          this.subscriptionObject[subscriptioProperty].unsubscribe();
        }
      }
    }
  }
}
