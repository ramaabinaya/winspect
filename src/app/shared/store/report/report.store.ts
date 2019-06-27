// reportStore is used to store the report details locally.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as reportActions from './report.action';
import { AssignInspectionUsers } from '../../../inspection/model/assignInspectionUsers.model';
/**
 * Class which is used to store the report details locally in the application.
 */
@Injectable()
export class ReportStore {
  /**
   * Variable which is used to define the report details.
   * @type {Observable<AssignInspectionUsers[]>}
   */
  assignInspectionUsers: Observable<AssignInspectionUsers[]>;
  /**
   * Class constructor to inject the required services.
   * @param store To define the store.
   */
  constructor(private store: Store<any>) {
    this.assignInspectionUsers = this.store.select(s => s.SharedModule.Report);
  }
  /**
   * Method which is used to dispatch the action for load reports.
   * @return {void}
   */
  load() {
    this.store.dispatch({ type: reportActions.ActionTypes.LOAD });
  }
  /**
   * Method which is used to dispatch the action for changing the status of the reports.
   * @param reportId {number} The index of the report.
   * @param active {number} The statusCode to be changed.
   * @return {void}
   */
  changeReportStatus(reportId: number, active: number) {
    const temp = {
      reportId: reportId,
      active: active
    };
    this.store.dispatch({ type: reportActions.ActionTypes.CHANGE_REPORT_STATUS, payload: temp });
  }
  /**
   * Method which is used to dispatch the action for delete reports.
   * @param assignedinspectionid {number} The index of the assignInspection.
   * @return {void}
   */
  deleteReport(assignedinspectionid: number) {
    this.store.dispatch({ type: reportActions.ActionTypes.DELETE_REPORT, payload: assignedinspectionid });
  }
  /**
   * Method which is used to dispatch the action for change assigned inspection duedate.
   * @param id {number} The index of the assigned inspection id.
   * @param toDate {date} new duedate for assignedInspection.
   */
  changeAssignedInspectionDueDate(id, toDate) {
    const temp = [];
    temp.push(id);
    temp.push(toDate);
    this.store.dispatch({ type: reportActions.ActionTypes.CHANGE_DUE_DATE, payload: temp });
  }
  /**
   * Method which is used to reassign the assignedInspection from one technician to another technician
   * @param inspectionId {number} The index of the assignedInspection.
   * @param technicianId {number} The index of the technicianId.
   */
  reAssignInspection(inspectionId, technicianId) {
    const temp = [];
    temp.push(inspectionId);
    temp.push(technicianId);
    this.store.dispatch({ type: reportActions.ActionTypes.REASSIGN_INSPECTION, payload: temp });
  }
  /**
   * Method which is used to change the report status active or deactive.
   * @param selectedId {number} The index of the reportId.
   */
  changeReportStatusAll(selectedId) {
    const temp = selectedId;
    this.store.dispatch({ type: reportActions.ActionTypes.CHANGE_ALL_REPORT_STATUS, payload: temp });
  }
  /**
   * Method which is used to dispatch the action for change assigned inspection status.
   * @param reportId {number} The index of the report id.
   * @param statusId {number} The index of the status id.
   * @return {void}
   */
  changeAssignedInspectionStatus(reportId: number, statusId: number) {
    const temp = [];
    temp.push(reportId);
    temp.push(statusId);
    this.store.dispatch({ type: reportActions.ActionTypes.CHANGE_ASSIGNED_INSPECTION_STATUS, payload: temp });
  }
  /**
   * Method which is used to create the report with the provided informations.
   * @param assignedInspectionId {number} The index of the assigned inspection, on which the report to be created.
   * @param status {number} The statuscode of the report whether it is active or not.
   * @param report which defines the report details.
   */
  createReport(assignedInspectionId: number, status: number, report) {
    const temp = [];
    temp.push(assignedInspectionId);
    temp.push(status);
    temp.push(report);
    this.store.dispatch({ type: reportActions.ActionTypes.CREATE_REPORT, payload: temp });
  }
  /**
   * Method which is used to create new assign inspection to the technician.
   * @param inspection The Inspection which is to be assigned to the technician.
   * @return {Observable<Object>}
   */
  createNewAssignInspection(inspection) {
    this.store.dispatch({ type: reportActions.ActionTypes.CREATE_NEW_ASSIGN_INSPECTION, payload: inspection });
  }

  groupAssignInspection(inspectionObj) {
    this.store.dispatch({ type: reportActions.ActionTypes.CREATE_NEW_GROUP_ASSIGNMENT, payload: inspectionObj });
  }
}
