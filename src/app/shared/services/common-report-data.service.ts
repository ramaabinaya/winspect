// CommonReportDataService is used to Find the common questions in the sections and to store that common fields answers
// and used that stored values in the upcoming sections with the same questions.
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OfflineStorageService } from '../../common/services/offlineStorage.service';
import { HttpRoutingService } from '../../common/services/httpRouting.service';
/**
 * Service which is used to Find the common questions in the sections and to store that common fields answers
 * and used that stored values in the upcoming sections with the same questions.
 */
@Injectable()
export class CommonReportDataService {
  /**
   * Variable which is used to emit the data with the commonquestion's answers.
   * @type {any}
   */
  dataChanged = new Subject<any>();
  /**
   * Variable which is used to define the structure of the commonfield's data object.
   */
  data: {
    windMillFormId: number,
    windturbineId: number,
    reportId: number,
    bladeType: string,
    answers: { [key: string]: string }
  };
  /**
   * Service constructor to inject the other needed services here.
   * @param http Service to send the api request to the server.
   * @param offlineStorage Service to store the commondata in the offline mode.
   */
  constructor(private http: HttpRoutingService,
    private offlineStorage: OfflineStorageService) {
  }
  /**
   * Method which is used to set the common field's data with the provided report's details.
   * @param reportId {number} The index of the report to which the commonField's data to be stored.
   */
  setData(reportId: number) {
    const reqData = { reportId: reportId };
    // set the common field's data with the provided report's details from the aws database in online.
    this.http.postMethod('getreport', reqData).subscribe((res) => {
      if (res && res['report']) {
        const report = res['report'];
        if (report && report.assignInspectionUser && this.data) {
          this.data.windMillFormId = report.assignInspectionUser.windMillFormId;
          this.data.windturbineId = report.windturbineId;
          this.data.reportId = report.id;
          this.data.bladeType = report.bladeType;
        }
        this.dataChanged.next(this.data);
      }
    }, (err) => {
      console.log('error', err);
      // set the common field's data with the provided report's details from the local database in offline.
      this.offlineStorage.getReport(reportId)
        .then((reportdetails) => {
          for (let i = 0; i < reportdetails.rows.length; i++) {
            this.offlineStorage.getAssignedInspectiondetails(reportdetails.rows.item(i).assignedInspectionUserId)
              .then((assignedDetails) => {
                for (let j = 0; j < assignedDetails.rows.length; j++) {
                  this.data.windMillFormId = assignedDetails.rows.item(j).windMillFormId;
                }
                this.data.windturbineId = reportdetails.rows.item(i).windturbineId;
                this.data.reportId = reportdetails.rows.item(i).id;
                this.data.bladeType = reportdetails.rows.item(i).bladeType;
                this.dataChanged.next(this.data);
              });

          }
        });
    });
  }
  /**
   * Method which is used to create the answerData object with the provided questionName and value.
   * @param questionName {string} The name of the question which is common for more than one section.
   * @param value {string} The anwer value provided to that question.
   */
  setAnswersData(questionName: string, value: string) {
    if (this.data && this.data.answers) {
      if (this.data.answers.hasOwnProperty(questionName)) {
        this.data.answers[questionName] = value;
      } else {
        this.data.answers[questionName] = value;
      }
    } else {
      this.data.answers = { [questionName]: value };
    }
  }
  /**
   * Method which is used to empty the data object before the new section's data is being stored.
   * @return {void}
   */
  emptyData() {
    this.data = {
      windMillFormId: null,
      windturbineId: null,
      reportId: null,
      bladeType: '',
      answers: {}
    };
  }
}


