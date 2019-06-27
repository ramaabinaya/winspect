
import { throwError as observableThrowError, Observable } from 'rxjs';
// The class which is used for the inspection related operations on database
// and also get the response and save it locally.
import { map, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import * as inspectionActions from './inspection.action';
import { InspectionService } from '../../services/inspection.service';
import { DynamicInspectionService } from '../../services/dynamicInspection.service';
// import * as appAction from '../../../app.action';
/**
 * The class which is used for the inspection related operations on database
 * and also get the response and save it locally.
 */
@Injectable()
export class InspectionEffects {
  /**
   * Effect which is used to get the inspection details from the database and load it to the
   *  application's components.
   */
  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(inspectionActions.ActionTypes.LOAD).pipe(
      switchMap(() => {
        return this.inspectionService.getInspections().pipe(
          map(response => new inspectionActions.LoadSuccessAction(<any>response)),
          catchError((err: any) => {
            return observableThrowError(new inspectionActions.LoadFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to get the inspection details from the user and add it to the
   *  database.
   */
  @Effect()
  AddSection$: Observable<Action> = this.actions$
    .ofType(inspectionActions.ActionTypes.ADD_SECTION).pipe(
      map((action: inspectionActions.AddSectionAction) => action.payload),
      switchMap((section) => {
        return this.dynamicInspectionService.addInspectionSection(section).pipe(
          map((response: any) => new inspectionActions.AddSectionSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new inspectionActions.AddSectionFailureAction(err));
          }));
      }));

  // @Effect()
  // AddInspection$: Observable<Action> = this.actions$
  //   .ofType(inspectionActions.ActionTypes.ADD_INSPECTION).pipe(
  //   map((action: inspectionActions.AddInspectionAction) => action.payload),
  //   switchMap((temp) => {
  //     const name = temp[0];
  //     const type = temp[1];
  //     const desc = temp[2];
  //     return this.dynamicInspectionService.addInspectionHeader(name, type, desc).pipe(
  //       map((response: any) => new inspectionActions.AddInspectionSuccessAction(response)));
  //   }));
  /**
   * Effect which is used to add the new inputProperties details in database.
   */
  @Effect()
  AddInputProperties$: Observable<Action> = this.actions$
    .ofType(inspectionActions.ActionTypes.ADD_INPUT_PROPERTIES).pipe(
      map((action: inspectionActions.AddInputPropertiesAction) => action.payload),
      switchMap((inputProperties) => {
        return this.dynamicInspectionService.addInputTypeProperties(inputProperties).pipe(
          map((response: any) => new inspectionActions.AddInspectionSuccessAction(response))
          // catchError((err: any, caught) => {
          //   return Observable.throw(new inspectionActions.AddInspectionFailureAction(err));
          // })
        );
      }));

  /**
   * Effect which is used to edit the section name for the given section id in
   *  database.
   */
  @Effect()
  EditSectionName$: Observable<Action> = this.actions$
    .ofType(inspectionActions.ActionTypes.EDIT_SECTION_NAME).pipe(
      map((action: inspectionActions.EditSectionNameAction) => action.payload),
      switchMap((temp) => {
        const headerId = temp[0];
        const sectionId = temp[1];
        const name = temp[2];
        return this.dynamicInspectionService.editSectionName(headerId, sectionId, name).pipe(
          map((response: any) => new inspectionActions.EditSectionNameSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new inspectionActions.EditSectionNameFailureAction(err));
          }));
      }));
  /**
 * Effect which is used to delete the section for the given section id in
 *  database.
 */
  @Effect()
  DeleteSection$: Observable<Action> = this.actions$
    .ofType(inspectionActions.ActionTypes.DELETE_SECTION).pipe(
      map((action: inspectionActions.DeleteSectionAction) => action.payload),
      switchMap((temp) => {
        const sectionId = temp;
        return this.dynamicInspectionService.deleteSection(sectionId).pipe(
          map((response: any) => new inspectionActions.DeleteSectionSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new inspectionActions.DeleteSectionFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to edit the inspection name for the given inspection header id in
   *  database.
   */
  @Effect()
  editInspection$: Observable<Action> = this.actions$
    .ofType(inspectionActions.ActionTypes.EDIT_INSPECTION).pipe(
      map((action: inspectionActions.EditInspectionAction) => action.payload),
      switchMap((inspection) => {
        return this.dynamicInspectionService.editInspectionHeader(inspection).pipe(
          map((response: any) => new inspectionActions.EditInspectionSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new inspectionActions.EditInspectionFailureAction(err));
          }));
      }));
  /**
  * Effect which is used to delete inspection header for the given inspection header id in
  *  database.
  */
  @Effect()
  deleteInspection$: Observable<Action> = this.actions$
    .ofType(inspectionActions.ActionTypes.DELETE_INSPECTION).pipe(
      map((action: inspectionActions.DeleteInspectionAction) => action.payload),
      switchMap((headerId) => {
        return this.dynamicInspectionService.deleteInspection(headerId).pipe(
          map((response: any) => new inspectionActions.DeleteInspectionSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new inspectionActions.DeleteInspectionFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to archive inspection header for the given inspection header id in database.
   */
  @Effect()
  changeInspectionStatus$: Observable<Action> = this.actions$
    .ofType(inspectionActions.ActionTypes.CHANGE_INSPECTION_STATUS).pipe(
      map((action: inspectionActions.ChangeInspectionStatusAction) => action.payload),
      switchMap((temp) => {
        return this.dynamicInspectionService.changeInspectionStatus(temp).pipe(
          map((response: any) => new inspectionActions.ChangeInspectionStatusSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new inspectionActions.ChangeInspectionStatusFailureAction(err));
          }));
      }));
  /**
   * Constructor which is used to inject the required services.
   * @param inspectionService Service which is used to make inspection related api calls to the database.
   * @param actions$ Sercve which is used to define the actionType with the corresponding functionality to de done.
   */
  constructor(
    private inspectionService: InspectionService,
    private dynamicInspectionService: DynamicInspectionService,
    private actions$: Actions) { }
}
