
// ReportService which is used to create, delete, edit and retrieve report and create sections and store images inside the report.
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { HttpRoutingService } from '../../common/services/httpRouting.service';
/**
 * Service which is used to do all the report related functionalities like create,edit,delete and retrieve reports
 * and create sections and store images inside the report.
 */
@Injectable()
export class ReportService {
  /**
   * Service constructor to inject the other needed services here.
   * @param http Service to send the api request to the server.
   * @param auth Service instance to get the current user details.
   */
  constructor(private http: HttpRoutingService,
    private auth: AuthService) {
  }
  /**
   * Method which is used to create the report with the provided informations.
   * @param assignedInspectionId {number} The index of the assigned inspection, on which the report to be created.
   * @param turbineId {number} The index of the report to which turbine the inspection report to be created.
   * @param reportName {string} The name of the report to be created.
   * @param status {number} The statuscode of the report whether it is active or not.
   * @param bladeType The bladeType which defines whether the created report is 'turbine' or 'blade' report.
   * @return {Observable<Object>}
   */
  createReport(assignedInspectionId: number, turbineId: number, reportName: string, status: number, bladeType: string) {
    const data = {
      report: {
        assignedInspectionUserId: assignedInspectionId,
        windturbineId: turbineId,
        name: reportName,
        bladeType: bladeType
      },
      status: status
    };
    return this.http.postMethod('create', data);
  }
  /**
   * Method which is used to get the report details by the given report id.
   * @param id {number} The index of the report.
   * @return {Observable<Object>}
   */
  getReport(id: number) {
    const data = { reportId: id };
    return this.http.postMethod('getreport', data);
  }
  /**
   * Method which is used to get the report details by the given turbine id.
   * @param turbineId {number} The index of the turbine.
   * @return {Observable<Object>}
   */
  getTurbineReportDetails(turbineId: number) {
    const data = { turbineId: turbineId };
    return this.http.postMethod('getturbinereport', data);
  }
  /**
   * Method which is used to create the sections inside the inspection report with the provided details.
   * @param answers answers for the questions in the section to be created.
   * @param optionChoiceAnswers The OptionChoiceAnswers for the questions in the section to be created.
   * @return {Observable<Object>}
   */
  createSections(answers, optionChoiceAnswers, dynamicFieldAnswers) {
    const data = {
      answers: answers,
      optionChoiceAnswers: optionChoiceAnswers,
      dynamicFieldAnswers: dynamicFieldAnswers
    };
    return this.http.postMethod('createSection', data);
  }
  /**
   * Method which is used to store the images uploaded in the inspection reports.
   * @param data The imagedata with the sectionName.
   * @return {Observable<Object>}
   */
  storeImage(data) {
    console.log('data in response', data);
    return this.http.postMethod('storeImage', data);
  }
  /**
   * Method which is used to change the status{active,inactive} of the selected report.
   * @param details {details} The details which is used to store the reportId and report status.
   * @return {Observable<Object>}
   */
  changeReportStatus(details) {
    const data = details;
    return this.http.postMethod('report/status', data).pipe(map((res) => {
      return res;
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to delete the selected report.
   * @param assignInspecUserId {number} The assignedInspectionId of the report to be deleted.
   * @return {Observable<any>}
   */
  deleteReport(assignInspecUserId: number) {
    const data = { assignedInspectionUserId: assignInspecUserId };
    return this.http.postMethod('deletereport', data).pipe(map((res) => {
      return assignInspecUserId;
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to create the list of all the reports from the database.
   * @return {Observable<Object>}
   */
  getallreports(data) {
    console.log('data in service: ', data);
    return this.http.postMethod('getallreports', data)
      .pipe(map((res) => {
        if (res && res['assignInspectionUsers']) {
          console.log('assignInspectinUsers', res['assignInspectionUsers']);
          return res['assignInspectionUsers'];
        }
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to change the status {assigned,inprogress,completed} of the assigned inspection.
   * @param reportId {number} the index of the report to which the assignInspectionstaus to be changed.
   * @param statusId {number} the status code which defines the status value to be changed.
   * @return {Observable<Object>}
   */
  changeAssignedInspectionStatus(reportId: number, statusId: number) {
    const data = { reportId: reportId, statusId: statusId };
    return this.http.postMethod('changeAssignedInspectionStatus', data).pipe(map((res) => {
      if (res && res['assignInspectionUsers']) {
        console.log('response report', res);
        return res['assignInspectionUsers'];
      }
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to get the inspectionStatus table information from the database.
   * @return {Observable<Object>}
   */
  getAllInspectionStatus() {
    return this.http.getMethod('getInspectionStatus');
  }
  /**
   * Method which is used to get the report information with the given tuebineId.
   * @param turbineId {number} The index of the turbine.
   * @return {Observable<Object>}
   */
  // getTurbineReport(turbineId: number) {
  //   const data = { turbineId: turbineId };
  //   return this.http.postMethod('getturbinebladetype', data);
  // }
  /**
  * Method which is  used to get the dynamic field element questions for the given dynamic field id.
  * @param id {number} which is used to define dynamic field id.
  */
  getDynamicFieldElementQuestionById(id: number) {
    const data = { id: id };
    return this.http.postMethod('getDynamicFieldElementQuestion', data);
  }
  /**
  * Method which is  used to store the answer row for the uploaded images.
  * @param questionId {number} which is used to define the question id.
  * @param reportId {number} which is used to define report id.
  */
  storeAnswerForImages(questionId: number, reportId: number, elArray) {
    const data = {
      reportId: reportId,
      questionId: questionId,
      elementArray: elArray
    };
    return this.http.postMethod('storeAnswerForImages', data);
  }
  /**
   * Method which is used to change the duedate of the assigned inspection.
   * @param reportId {number} the index of the report to which the assignInspection duedate to be changed.
   * @param dueDate {date} new duedate for assignedInspection.
   */
  changeAssignedInspectionDueDate(reportId, dueDate) {
    const data = { reportId: reportId, dueDate: dueDate };
    return this.http.postMethod('changeAssignedInspectionDueDate', data).pipe(map((res) => {
      if (res) {
        return data;
      }
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to reassign the assignedInspection from one technician to another technician
   * @param inspectionId {number} The index of the assignedInspection.
   * @param technicianId {number} The index of the technicianId.
   */
  reassignInspection(inspectionId, technicianId) {
    const data = { inspectionId: inspectionId, technicianId: technicianId };
    return this.http.postMethod('reassignedinspection', data).pipe(map((res) => {
      if (res) {
        return data;
      }
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to change the report status active or deactive.
   * @param archId {number} The index of the reportId.
   */
  changeReportStatusAll(archId: number[]) {
    const data = {
      archId: archId,
      active: 1
    };
    return this.http.postMethod('allreport/status', data).pipe(map((res) => {
      if (res) {
        return archId;
      }
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
  * Method which is  used to convert image url to base64string.
  * @param imageUrl {string} which is used to define the url of the image.
  */
  convertImageToBase64String(url: string) {
    const data = { imageUrl: url };
    return this.http.postMethod('convertImageToBase64String', data);
  }
  getAssignedInspections() {
    return this.http.getMethod('getAssignedInspection').pipe(map((response) => {
      if (response && response['assignedInspections']) {
        console.log('assignedInspections', response['assignedInspections']);
        return response['assignedInspections'];
      }
    }),
      catchError(err => {
        return err;
      }));
  }
}
