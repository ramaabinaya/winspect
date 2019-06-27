// home component, which is used to display the dashboard, which contains the navbar,homebutton and the usericon.
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { UserStore } from '../../../user/store/user/user.store';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { ReportService } from '../../../shared/services/report.service';
import { InspectionService } from '../../../shared/services/inspection.service';
import { MatomoService } from '../../services/matomo.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { GroupsStore } from '../../../shared/store/groups/groups.store';
import { ResourceStore } from '../../../shared/store/resource/resource.store';
import { Store } from '@ngrx/store';
import { User } from '../../../user/model/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
/**
 * variable which is used to define the window screen
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used to display the dashboard,
 * which contains the navbar,homebutton and the usericon.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to subscribe and unsubscribe the network status subscription.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /** Variable which is used to display dialog when error occured.
   * @type {boolean}
   */
  error: boolean;
  /**
   * Variable which is used to display the error message.
   * @type {any}
   */
  errorMsg: any;
  /**
   * Variable which is used to display the dialog box.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to define the current user details.
   * @type {any}
   */
  user: User;
  /**
   * Variable which is used to check whether the network is connected or not.
   * @type {boolean}
   */
  networkIsAvailable: boolean;
  /**
   * Variable which is used to define the number of report updated in offline.
   * @type {boolean}
   */
  counter = 0;
  /**
   * Variable which is used to display the screen in mobile view.
   */
  mobileView: boolean;
  /**
   * Variable which is used to specify the screen size.
   */
  screenWidth;
  /**
   * Variable which is used to store login informations.
   */
  loginCredentials = {
    email: null,
    password: null
  };
  /**
   * Variable which is used to refer the login modal dialog box.
   */
  @ViewChild('login') loginModal;
  /**
   * Variable which is used to refer the error display modal box.
   */
  @ViewChild('error') errorModal;
  /**
   * Variable which is used to refer the bootstrap modal dialog box.
   */
  modalReference = null;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle: string = "HOME";
  /**
  * Component constructor used to inject the required services and stores.
   * @param auth To get the current user information from the user login.
   * @param userStore To load the users from the database to the local application's store.
   * @param reportStore To load the report from the database.
   * @param reportService To create report and update report for aws database.
   * @param offlinestorage To get and update offline database data to the aws database.
   * @param inspectionStore To load the inspections from the application's store.
   * @param inspectionService To add new inspection to the aws database.
   * @param router To navigate to provided route.
   * @param network To find network status.
   * @param matomoService to perform metric operation on this component.
   */
  constructor(private auth: AuthService,
    private userStore: UserStore,
    private reportStore: ReportStore,
    private reportService: ReportService,
    private offlinestorage: OfflineStorageService,
    private inspectionStore: InspectionStore,
    private inspectionService: InspectionService,
    private router: Router,
    private headerService: HeaderService,
    private matomoService: MatomoService,
    private store: Store<any>,
    private groupsStore: GroupsStore,
    private resourceStore: ResourceStore,
    private modalService: NgbModal) {
    this.screenWidth = window.screen.width;
  }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {

    // To get current user
    this.subscriptionObject['user'] = this.auth.user.subscribe((user) => {
      if (user) {
        this.user = user;
        this.matomoService.setUserId(this.user.email); // Setting the userId in metric tool.
        this.matomoService.initialize(this.pageTitle); // Setting the component as page to track.
      }
      if (user && user.role === 'Admin') {
        this.groupsStore.load();
        this.resourceStore.load();
      }
      this.inspectionStore.load();
      this.reportStore.load();
      this.userStore.load();
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (this.auth.isAuthenticated() && !this.user) {
      this.auth.getUser();
    }

    this.subscriptionObject['networkStatus'] = this.offlinestorage.networkDisconnected.subscribe((value) => {
      this.networkIsAvailable = !value;
      if (!this.networkIsAvailable && window && window.cordova && this.user) {
        this.offlinestorage.getUserByEmailId(this.user.email)
          .then((user) => {
            if (user && user.rows.length > 0) {
              // If user row is return then navigate to home page
              for (let i = 0; i < user.rows.length; i++) {
                const userdetails = user.rows.item(i);
                // Store the token and user datails into local storage.
                localStorage.setItem('currentUser', JSON.stringify({ token: null, user: userdetails, isAuthenticated: true }));
                this.router.navigate(['app/home']);
              }
            }
          }).catch((e) => {
            console.log('error in retrieving current user data!', e.message);
          });
      }
      // this.display = !value && !this.auth.getToken();
      if (!value && !this.auth.getToken()) {
        this.openLoginModal(this.loginModal);
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (window && window.cordova) {
      this.mobileView = true;
      this.offlinestorage.applicationMode.next(true);
      this.updateOfflineData();
      console.log('Cordova Is Available!');
    } else if (this.screenWidth < 500) {
      this.mobileView = true;
      this.offlinestorage.applicationMode.next(true);
    } else {
      this.offlinestorage.applicationMode.next(false);
      console.log('Cordova Not Available!');
    }
  }
  /**
   * Method which is used to update the offline database data to the aws database.
   */
  updateOfflineData() {
    this.counter = 0;
    // To get updated assignedInspectionUsers from the offline Database
    if (this.networkIsAvailable) {
      this.offlinestorage.restoreDataInAssignInspectionUserssDB().then((inspection) => {
        for (let i = 0; i < inspection.rows.length; i++) {
          // If updateIndicator 'I' means newly inserted row
          // or updateIndicator 'C' means row updated with completed status
          // or updateIndicator 'Y' means updated row.
          if (inspection.rows.item(i).updateIndicator === 'I') {
            const index = inspection.rows.item(i).id;
            inspection.rows.item(i).id = null;
            // To add new inspection to the aws database
            // tslint:disable-next-line:max-line-length
            this.subscriptionObject['addNewInspection'] = this.inspectionService.assignInspection(inspection.rows.item(i)).subscribe((res) => {
              console.log('successfully assigned', JSON.stringify(res));
              this.reportStore.createNewAssignInspection(res['assignedInspection']);
              // To get updated report list for the given id
              this.offlinestorage.restoreDataInReportsDB(index).then((report) => {
                for (let reportId = 0; reportId < report.rows.length; reportId++) {
                  report.rows.item(reportId).name = 'Report ' + res['assignedInspection'].id;
                  // To add new report to the aws database
                  this.subscriptionObject['createReport'] = this.reportService.createReport(res['assignedInspection'].id,
                    report.rows.item(reportId).windturbineId, report.rows.item(reportId).name, inspection.rows.item(i).inspectionStatusId,
                    report.rows.item(reportId).bladeType).subscribe((reportRes) => {
                      // tslint:disable-next-line:max-line-length
                      this.reportStore.createReport(res['assignedInspection'].id, inspection.rows.item(i).inspectionStatusId, reportRes['report']);
                      console.log('successfully reportRes', JSON.stringify(reportRes));
                      // To get updated answer list for given report id
                      this.offlinestorage.restoreReportAnswer(report.rows.item(reportId).reportIndex).then((answer) => {
                        if (answer.rows.length > 0) {
                          this.counter++;
                          this.updateAnswers(answer, reportRes['report'].id, index);
                        }
                      }).catch((e) => {
                        console.log('error in ans restore', e.message);
                      });
                    }, (err) => {
                      console.log('error in update report', JSON.stringify(err));
                    });
                }
              });
            }, (err) => {
              console.log('error in asigned updata', err.err.error);
            });
          } else if (inspection.rows.item(i).updateIndicator === 'C') {
            this.offlinestorage.getReportsByInspectionId(inspection.rows.item(i).id).then((report) => {
              for (let reportId = 0; reportId < report.rows.length; reportId++) {
                // To change assignedInspection users details in aws database
                this.reportStore.changeAssignedInspectionStatus(report.rows.item(reportId).id,
                  inspection.rows.item(i).inspectionStatusId);
                console.log('sucessfully completed');
                // To get updated answer list for given report id
                this.offlinestorage.restoreReportAnswer(report.rows.item(reportId).id).then((answer) => {
                  if (answer.rows.length > 0) {
                    this.counter++;
                    this.updateAnswers(answer, null, inspection.rows.item(i).id);
                  }
                }).catch((e) => {
                  console.log('error in ans restore', e.message);
                });
                // this.offlinestorage.deleteAssignInspectionUsers(inspection.rows.item(i).id);
              }
            }).catch((e) => {
              console.log('error in change assigned report ', e.message);
            });
          } else if (inspection.rows.item(i) && inspection.rows.item(i).updateIndicator === 'U') {
            this.offlinestorage.getReportsByInspectionId(inspection.rows.item(i).id).then((report) => {
              for (let reportId = 0; reportId < report.rows.length; reportId++) {
                // To get updated answer list for given report id
                this.offlinestorage.restoreReportAnswer(report.rows.item(reportId).id).then((answer) => {
                  if (answer.rows.length > 0) {
                    this.counter++;
                    this.updateAnswers(answer, null, inspection.rows.item(i).id);
                  }
                }).catch((e) => {
                  console.log('error in ans restore', e.message);
                });
                // this.offlinestorage.deleteAssignInspectionUsers(inspection.rows.item(i).id);
              }
            }).catch((e) => {
              console.log('error in change assigned report ', e.message);
            });
          } else {
            // To get updated report list for the given id
            this.offlinestorage.restoreDataInReportsDB(inspection.rows.item(i).id).then((report) => {
              for (let reportId = 0; reportId < report.rows.length; reportId++) {
                report.rows.item(reportId).name = 'Report ' + inspection.rows.item(i).id;
                // To add new report to the aws database
                this.subscriptionObject['createReport'] = this.reportService.createReport(inspection.rows.item(i).id,
                  report.rows.item(reportId).windturbineId, report.rows.item(reportId).name, inspection.rows.item(i).inspectionStatusId,
                  report.rows.item(reportId).bladeType).subscribe((reportRes) => {
                    // tslint:disable-next-line:max-line-length
                    this.reportStore.createReport(inspection.rows.item(i).id, inspection.rows.item(i).inspectionStatusId, reportRes['report']);
                    console.log('successfully reportRes', JSON.stringify(reportRes));
                    this.offlinestorage.restoreReportAnswer(report.rows.item(reportId).reportIndex).then((answer) => {
                      if (answer.rows.length > 0) {
                        this.counter++;
                        this.updateAnswers(answer, reportRes['report'].id, inspection.rows.item(i).id);
                      }
                    }).catch((e) => {
                      console.log('error in ans restore', e.message);
                    });
                  }, (err) => {
                    console.log('error in update report', JSON.stringify(err));
                  });
              }
            });
          }
        }
      }).catch((e) => {
        console.log('error in assign restore', e.message);
      });
    }
  }
  /**
   * Method which is used to update answers to aws database for the updated report.
   * @param answer {any} To define the updated answer list.
   * @param reportId {number} To define the report id.
   * @param assignedId {number} To define the assignedInspectionUser id.
   */
  updateAnswers(answer: any, reportId: number, assignedId: number) {
    const answers = [];
    let optionAnswers = [];
    const that = this;
    const fieldValue = [];
    let imageAdded = false;
    let sectionSaved = false;
    for (let i = 0; i < answer.rows.length; i++) {
      if (reportId !== null) {
        // To change the reportId property value to aws report id value
        answer.rows.item(i).reportId = reportId;
      }
      if (answer.rows.item(i).changedElementArray === null || answer.rows.item(i).changedElementArray === undefined) {
        answers.push(answer.rows.item(i));
        // To get updated optionChoiceAnswers for given id
        this.offlinestorage.restoreDataInOptionChoiceAnswerDB(answer.rows.item(i).ansId).then((optionAnswer) => {
          optionAnswers = [];
          for (let j = 0; j < optionAnswer.rows.length; j++) {
            optionAnswers.push({
              reportId: answer.rows.item(i).reportId,
              questionId: answer.rows.item(i).questionId,
              optionChoiceId: optionAnswer.rows.item(j).optionChoiceId
            });
          }
          if (optionAnswers.length > 0) {
            // To stored the updated optionChoiceAnswers to aws database
            this.subscriptionObject['createSections'] = this.reportService.createSections({}, optionAnswers, null).subscribe((response) => {
              console.log('sucessfully uploaded option to aws', JSON.stringify(response));
              if (answer.rows.length - 1 === i && assignedId !== null) {
                // To delete assignInspectionUsers in offline database
                this.offlinestorage.deleteAssignInspectionUsers(assignedId);
              }
            }, (err) => {
              console.log('error in option answer report', JSON.stringify(err));
            });
          } else {
            if (answer.rows.length - 1 === i && assignedId !== null) {
              // To delete assignInspectionUsers row in offline database for given id
              this.offlinestorage.deleteAssignInspectionUsers(assignedId);
            }
          }
        }).catch((e) => {
          console.log('error in optionAnswer restore', e.message);
        });
        // To get updated optionChoiceAnswers for given id
        if (answer.rows.item(i).updateIndicator === 'I') {
          imageAdded = true;
          this.offlinestorage.restoreDataInImageAnswersDB(answer.rows.item(i).ansId).then((imageAnswer) => {
            // tslint:disable-next-line:max-line-length
            this.subscriptionObject['image'] = this.reportService.storeAnswerForImages(answer.rows.item(i).questionId, answer.rows.item(i).reportId, null).subscribe((res) => {
              if (res && res['answer']) {
                console.log('in image store from off to ons');
                let imageCounter = 0;
                for (let j = 0; j < imageAnswer.rows.length; j++) {
                  imageAnswer.rows.item(j).answerId = res['answer'].Id;
                  if (imageAnswer.rows.item(j).imageFileUri) {
                    imageAnswer.rows.item(j).id = null;
                    // Get the base64 string for given image file
                    window.resolveLocalFileSystemURL(imageAnswer.rows.item(j).imageFileUri, function gotFile(fileEntry) {
                      fileEntry.file(function (file) {
                        const reader = new FileReader();
                        reader.onloadend = function (event) {
                          const content = this.result;
                          that.compressImage(content).then((thumnailImgCopy) => {
                            // });
                            imageAnswer.rows.item(j).thumnailImage = thumnailImgCopy;
                            console.log('thumnailImg in home', imageAnswer.rows.item(j).thumnailImg);
                            imageAnswer.rows.item(j).imageLocation = content;
                            const data = {
                              image: imageAnswer.rows.item(j)
                            };
                            // To store the image details to aws database
                            that.subscriptionObject['image'] = that.reportService.storeImage(data).subscribe((response) => {
                              imageCounter++;
                              console.log('sucessfully uploaded imageAnswer to aws', data, JSON.stringify(response));
                              if (assignedId !== null && imageAnswer.rows.length === imageCounter && sectionSaved) {
                                that.counter--;
                                if (that.counter === 0) {
                                  that.reportStore.load();
                                }
                                // To delete assignInspectionUsers row in offline database for given id
                                that.offlinestorage.deleteAssignInspectionUsers(assignedId);
                              } else if (assignedId !== null && imageAnswer.rows.length === imageCounter) {
                                imageAdded = false;
                              }
                            }, (err) => {
                              imageCounter++;
                              if (assignedId !== null && imageAnswer.rows.length === imageCounter && sectionSaved) {
                                that.counter--;
                                if (that.counter === 0) {
                                  that.reportStore.load();
                                }
                                // To delete assignInspectionUsers row in offline database for given id
                                that.offlinestorage.deleteAssignInspectionUsers(assignedId);
                              } else if (assignedId !== null && imageAnswer.rows.length === imageCounter) {
                                imageAdded = false;
                              }
                              console.log('error in imageAnswers report', JSON.stringify(err));
                            });
                          });
                        };
                        // The most important point, use the readAsDataURL Method from the file plugin
                        reader.readAsDataURL(file);
                      });
                    }, function fail(err) {
                      console.log('error:', err);
                      imageCounter++;
                      if (assignedId !== null && imageAnswer.rows.length === imageCounter && sectionSaved) {
                        that.counter--;
                        if (that.counter === 0) {
                          that.reportStore.load();
                        }
                        // To delete assignInspectionUsers row in offline database for given id
                        that.offlinestorage.deleteAssignInspectionUsers(assignedId);
                      } else if (assignedId !== null && imageAnswer.rows.length === imageCounter) {
                        imageAdded = false;
                      }
                      alert('Cannot found requested file');
                    });
                  } else {
                    imageAnswer.rows.item(j).mode = imageAnswer.rows.item(j).updateIndicator;
                    const data = {
                      image: imageAnswer.rows.item(j)
                    };
                    console.log('data to upload', data);
                    // To store the image details to aws database
                    this.subscriptionObject['image'] = this.reportService.storeImage(data).subscribe((response) => {
                      imageCounter++;
                      console.log('sucessfullt uploaded image else updated to aws', JSON.stringify(response));
                      if (assignedId !== null && imageAnswer.rows.length === imageCounter && sectionSaved) {
                        this.counter--;
                        if (this.counter === 0) {
                          this.reportStore.load();
                        }
                        // To delete assignInspectionUsers row in offline database for given id
                        this.offlinestorage.deleteAssignInspectionUsers(assignedId);
                      } else if (assignedId !== null && imageAnswer.rows.length === imageCounter) {
                        imageAdded = false;
                      }
                    }, (err) => {
                      imageCounter++;
                      if (assignedId !== null && imageAnswer.rows.length === imageCounter && sectionSaved) {
                        this.counter--;
                        if (this.counter === 0) {
                          this.reportStore.load();
                        }
                        // To delete assignInspectionUsers row in offline database for given id
                        this.offlinestorage.deleteAssignInspectionUsers(assignedId);
                      } else if (assignedId !== null && imageAnswer.rows.length === imageCounter) {
                        imageAdded = false;
                      }
                      console.log('error in imageAnswers report', JSON.stringify(err));
                    });
                  }
                }
              } else {
                imageAdded = false;
              }
            }, (err) => {
              imageAdded = false;
            });
          }).catch((e) => {
            imageAdded = false;
            console.log('error in retrieve image answers', e.message);
          });
        }
      } else {
        if (answer.rows.item(i).updateIndicator !== 'I') {
          answer.rows.item(i).Id = answer.rows.item(i).ansId;
          answer.rows.item(i).mode = answer.rows.item(i).updateIndicator;
          fieldValue.push(answer.rows.item(i));
        } else {
          fieldValue.push(answer.rows.item(i));
        }
      }
    }
    if (answers.length > 0) {
      // To store the answers to aws database
      this.subscriptionObject['createSections'] = this.reportService.createSections(answers, {}, fieldValue).subscribe((response) => {
        sectionSaved = true;
        if (assignedId !== null && !imageAdded) {
          this.counter--;
          if (this.counter === 0) {
            this.reportStore.load();
          }
          // To delete assignInspectionUsers row in offline database for given id
          this.offlinestorage.deleteAssignInspectionUsers(assignedId);
        }
        console.log('sucessfullt uploaded to aws in section', JSON.stringify(response), this.counter, imageAdded);
      }, (err) => {
        sectionSaved = true;
        if (assignedId !== null && !imageAdded) {
          this.counter--;
          if (this.counter === 0) {
            this.reportStore.load();
          }
          // To delete assignInspectionUsers row in offline database for given id
          this.offlinestorage.deleteAssignInspectionUsers(assignedId);
        }
        console.log('error in update answer report in section', JSON.stringify(err), this.counter, imageAdded);
      });
    } else {
      if (!imageAdded) {
        this.counter--;
        if (this.counter === 0) {
          this.reportStore.load();
        }
      }
      sectionSaved = true;
    }
  }
  compressImage(content): Promise<any> {
    const imgData = new Image();
    imgData.src = content;
    return new Promise((resolve, reject) => {
      imgData.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 80;
        canvas.height = 80;
        ctx.drawImage(imgData, 0, 0, 80, 80);
        const thumnailImg = canvas.toDataURL('image/jpeg');
        resolve(thumnailImg);
      };
    });
  }
  /**
   * method which is used to login the application when network status changed from offline to online.
   * @param email {string} To define the emailid
   * @param password {string} To define the password
   */
  onLogin() {
    if (this.loginCredentials && this.loginCredentials.email && this.loginCredentials.password) {
      this.subscriptionObject['auth'] = this.auth.signinUser(this.loginCredentials.email, this.loginCredentials.password, null, null)
        .subscribe((res) => {
          this.display = false;
          if (this.modalReference) {
            this.modalReference.close();
          }
          if (window.cordova && this.user.role === 'Technician') {
            const token = this.auth.getToken();
            if (token) {
              // Set the request headers with authentication details.
              this.headerService.setHeaders('default', 'Authorization', token);
              this.inspectionStore.load();
              this.reportStore.load();
              this.updateOfflineData();
            }
          }
          this.router.navigate(['app/home']);
          this.loginCredentials.email = null;
          this.loginCredentials.password = null;
        }, (err) => {
          if (err.error && err.error.error) {
            this.errorMsg = err.error.error;
            this.error = true;
            this.openErrorModal(this.errorModal);
          }
        });
    }
  }
  /**
   * Method which is used to display the modal box for login details.
   * @param login local reference variable.
   */
  openLoginModal(login) {
    this.modalReference = this.modalService.open(login, { centered: true });
  }
  /**
   * Method which is used to display the modal box error message.
   * @param error local reference variable.
   */
  openErrorModal(error) {
    this.modalService.open(error, { centered: true });
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
