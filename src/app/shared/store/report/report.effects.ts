// The class which is used for the report related operations on database
// and also get the response and save it locally.
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import * as reportActions from './report.action';
import { ReportService } from '../../services/report.service';
/**
 * The class which is used for the report related operations on database
 * and also get the response and save it locally.
 */
@Injectable()
export class ReportEffects {
  /**
   * Effect which is used to get the report details from the database and load it to the
   * application components.
   */
  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(reportActions.ActionTypes.LOAD).pipe(
      switchMap(() => {
        const data = { active: 1 };
        return this.reportService.getallreports(data).pipe(
          map(response => new reportActions.LoadSuccessAction(<any>response)),
          catchError((err: any) => {
            return observableThrowError(new reportActions.LoadFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to change status for the report in the database and also update it locally.
   */
  @Effect()
  changeReportStatus$: Observable<Action> = this.actions$
    .ofType(reportActions.ActionTypes.CHANGE_REPORT_STATUS).pipe(
      map((action: reportActions.ChangeReportStatusAction) => action.payload),
      switchMap((temp) => {
        return this.reportService.changeReportStatus(temp).pipe(
          map((response: any) => new reportActions.ChangeReportStatusSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new reportActions.ChangeReportStatusFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to delete the report in the database and also update it locally.
   * application components.
   */
  @Effect()
  deleteReport$: Observable<Action> = this.actions$
    .ofType(reportActions.ActionTypes.DELETE_REPORT).pipe(
      map((action: reportActions.DeleteReportAction) => action.payload),
      switchMap((temp) => {
        return this.reportService.deleteReport(temp).pipe(
          map((response: any) => new reportActions.DeleteReportSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new reportActions.DeleteReportFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to change the assign inspection user status in the database and also update it locally.
   * application components.
   */
  @Effect()
  changeAssignedInspectionStatus$: Observable<Action> = this.actions$
    .ofType(reportActions.ActionTypes.CHANGE_ASSIGNED_INSPECTION_STATUS).pipe(
      map((action: reportActions.ChangeAssignedInspectionStatusAction) => action.payload),
      switchMap((temp) => {
        return this.reportService.changeAssignedInspectionStatus(temp[0], temp[1]).pipe(
          map((response: any) => new reportActions.ChangeAssignedInspectionStatusSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new reportActions.ChangeAssignedInspectionStatusFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to change the assign inspection user duedate in the database and also update it locally.
   * application components.
   */
  @Effect()
  changeDuedate$: Observable<Action> = this.actions$
    .ofType(reportActions.ActionTypes.CHANGE_DUE_DATE).pipe(
      map((action: reportActions.ChangeDuedateAction) => action.payload),
      switchMap((temp) => {
        return this.reportService.changeAssignedInspectionDueDate(temp[0], temp[1]).pipe(
          map((response: any) => new reportActions.ChangeDuedateSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new reportActions.ChangeDuedateFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to reassign the assignedInspection from one technician to another technician and also update it locally.
   * application components.
   */
  @Effect()
  reAssign$: Observable<Action> = this.actions$
    .ofType(reportActions.ActionTypes.REASSIGN_INSPECTION).pipe(
      map((action: reportActions.ReassignInspectionAction) => action.payload),
      switchMap((temp) => {
        return this.reportService.reassignInspection(temp[0], temp[1]).pipe(
          map((response: any) => new reportActions.ReassignInspectionSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new reportActions.ReassignInspectionFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to change the report status active or deactive in the database and also update it locally.
   * application components.
   */
  @Effect()
  changeAllReportStatus$: Observable<Action> = this.actions$
    .ofType(reportActions.ActionTypes.CHANGE_ALL_REPORT_STATUS).pipe(
      map((action: reportActions.ChangeReportStatusAction) => action.payload),
      switchMap((temp) => {
        return this.reportService.changeReportStatusAll(temp).pipe(
          map((response: any) => new reportActions.ChangeAllReportStatusSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new reportActions.ChangeAllReportStatusFailureAction(err));
          }));
      }));
  /**
  * Constructor which is used to inject the required services.
  * @param reportService Service which is used to make report related api calls to the database.
  * @param actions$ Service which is used to define the actionType with the corresponding functionality to de done.
  */
  constructor(
    private reportService: ReportService,
    private actions$: Actions) { }
}
