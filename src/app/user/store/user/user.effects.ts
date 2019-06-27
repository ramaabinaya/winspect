import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
// The class which is used for the user related operations on database
// and also get the response and save it locally.
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as userActions from './user.action';
import { Action } from '@ngrx/store';
import { UserService } from '../../services/users.service';
/**
 * The class which is used for the user related operations on database
 * and also get the response and save it locally.
 */
@Injectable()
export class UserEffects {
  /**
   * Effect which is used to get the user details from the database and load it to the
   * application components.
   */
  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(userActions.ActionTypes.LOAD).pipe(
      switchMap(() => {
        return this.userService.getUsers().pipe(
          map(response => new userActions.LoadSuccessAction(<any>response)),
          catchError((err: any) => {
            return observableThrowError(new userActions.LoadFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to change the status of the user in the database and also update it locally.
   * application components.
   */
  @Effect()
  changeUserStatus$: Observable<Action> = this.actions$
    .ofType(userActions.ActionTypes.CHANGE_USER_STATUS).pipe(
      map((action: userActions.ChangeUserStatusAction) => action.payload),
      switchMap((temp) => {
        return this.userService.changeUserStatus(temp).pipe(
          map(response => new userActions.ChangeUserStatusSuccessAction(<any>response)),
          catchError((err: any) => {
            return observableThrowError(new userActions.ChangeUserStatusFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to edit the user information in the database and also update it locally.
   * application components.
   */
  @Effect()
  editUser$: Observable<Action> = this.actions$
    .ofType(userActions.ActionTypes.EDIT_USER).pipe(
      map((action: userActions.EditUserAction) => action.payload),
      switchMap((temp) => {
        return this.userService.editUser(temp[0], temp[1]).pipe(
          map(response => new userActions.EditUserSuccessAction(<any>response)),
          catchError((err: any) => {
            return observableThrowError(new userActions.EditUserFailureAction(err));
          }));
      }));
  /**
   * Class constructor to inject the required services.
   * @param userService
   * @param actions$
   */
  constructor(
    private userService: UserService,
    private actions$: Actions) { }
}
