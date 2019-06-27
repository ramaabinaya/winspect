// The class which is used for the resource related operations on database
// and also get the response and save it locally.
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import * as resourceActions from './resource.action';
import { DynamicInspectionService } from '../../services/dynamicInspection.service';
/**
 * Class which is used for resource related operations in database.
 */
@Injectable()
export class ResourceEffects {
  /**
   * Effect which is used to get the resource details from the database and load it to the
   *  application's components.
   */
  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(resourceActions.ActionTypes.LOAD).pipe(
      switchMap(() => {
        return this.dynamicInspectionService.getResourceList().pipe(
          map(response => new resourceActions.LoadSuccessAction(<any>response)),
          catchError((err: any) => {
            return observableThrowError(new resourceActions.LoadFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to add the new resource to the database and and also update it locally.
   *  application's components.
   */
  @Effect()
  addResource$: Observable<Action> = this.actions$
    .ofType(resourceActions.ActionTypes.ADD_RESOURCE).pipe(
      map((action: resourceActions.AddResourceAction) => action.payload),
      switchMap((temp) => {
        return this.dynamicInspectionService.createOptionGroup(temp).pipe(
          map(response => new resourceActions.AddResourceSuccessAction(<any>response)),
          catchError((err: any) => {
            return observableThrowError(new resourceActions.AddResourceFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to add the resource option choices to the database and also update it locally
   *  application's components.
   */
  @Effect()
  addResourceOptionChoices$: Observable<Action> = this.actions$
    .ofType(resourceActions.ActionTypes.ADD_RESOURCE_OPTION_CHOICE).pipe(
      map((action: resourceActions.AddResourceOptionChoiceAction) => action.payload),
      switchMap((temp) => {
        return this.dynamicInspectionService.addOptionChoices(temp).pipe(
          map(response => new resourceActions.AddResourceOptionChoiceSuccessAction(<any>response)),
          catchError((err: any) => {
            return observableThrowError(new resourceActions.AddResourceOptionChoiceFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to remove the optionGroup from the database and also update it locally.
   * application components.
   */
  // @Effect()
  // deleteOptionGroup$: Observable<Action> = this.actions$
  //   .ofType(resourceActions.ActionTypes.DELETE_RESOURCE).pipe(
  //     map((action: resourceActions.DeleteResourceAction) => action.payload),
  //     switchMap((temp) => {
  //       return this.dynamicInspectionService.deleteOptionGroup(temp).pipe(
  //         map((response: any) => new resourceActions.DeleteResourceSuccessAction(response)),
  //         catchError((err: any) => {
  //           return observableThrowError(new resourceActions.DeleteResourceFailureAction(err));
  //         }));
  //     }));
  /**
   * Effect which is used to remove the optionChoice from the database and also update it locally.
   * application components.
   */
  @Effect()
  deleteOptionChoice$: Observable<Action> = this.actions$
    .ofType(resourceActions.ActionTypes.DELETE_RESOURCE_OPTION_CHOICE).pipe(
      map((action: resourceActions.DeleteResourceOptionChoiceAction) => action.payload),
      switchMap((temp) => {
        return this.dynamicInspectionService.deleteOptionChoices(temp[0], temp[1]).pipe(
          map((response: any) => new resourceActions.DeleteResourceOptionChoiceSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new resourceActions.DeleteResourceOptionChoiceFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to edit the optionGroup in the database and also update it locally.
   * application components.
   */
  @Effect()
  editOptionGroup$: Observable<Action> = this.actions$
    .ofType(resourceActions.ActionTypes.EDIT_RESOURCE).pipe(
      map((action: resourceActions.EditResourceAction) => action.payload),
      switchMap((temp) => {
        return this.dynamicInspectionService.updateOptionGroup(temp).pipe(
          map((response: any) => new resourceActions.EditResourceSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new resourceActions.EditResourceFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to edit the optionChoices in the database and also update it locally.
   * application components.
   */
  @Effect()
  editOptionChoices$: Observable<Action> = this.actions$
    .ofType(resourceActions.ActionTypes.EDIT_RESOURCE_OPTION_CHOICE).pipe(
      map((action: resourceActions.EditResourceOptionChoiceAction) => action.payload),
      switchMap((temp) => {
        return this.dynamicInspectionService.updateOptions(temp).pipe(
          map((response: any) => new resourceActions.EditResourceOptionChoiceSuccessAction(response)),
          catchError((err: any) => {
            return observableThrowError(new resourceActions.EditResourceOptionChoiceFailureAction(err));
          }));
      }));
  /**
   * Constructor which is used to inject the required services.
   * @param inspectionService Service which is used to make inspection related api calls to the database.
   * @param actions$ Service which is used to define the actionType with the corresponding functionality to de done.
   */
  constructor(
    private dynamicInspectionService: DynamicInspectionService,
    private actions$: Actions) { }
}
