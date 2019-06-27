// The class which is used for the groups related operations on database
// and also get the response and save it locally.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as groupsActions from './groups.action';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { GroupService } from '../../../common/services/group.service';
// import * as appAction from '../../../app.action';
/**
* The class which is used for the groups related operations on database
* and also get the response and save it locally.
*/
@Injectable()
export class GroupsEffects {
  /**
  * Effect which is used to get the groups details from the database and load it to the
  * application components.
  */
  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(groupsActions.ActionTypes.LOAD).pipe(
      switchMap(() => {
        return this.groupService.getAllGroups().pipe(
          map(response => new groupsActions.LoadSuccessAction(<any>response)),
          catchError((err: any) => {
            return Observable.throw(new groupsActions.LoadFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to create the new group in the database and also update it locally.
   * application components.
   */
  @Effect()
  createGroup$: Observable<Action> = this.actions$
    .ofType(groupsActions.ActionTypes.CREATE_GROUP).pipe(
      map((action: groupsActions.CreateGroupAction) => action.payload),
      switchMap((temp) => {
        return this.groupService.createGroup(temp).pipe(
          map((response: any) => new groupsActions.CreateGroupSuccessAction(response)),
          catchError((err: any) => {
            return Observable.throw(new groupsActions.CreateGroupFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to remove the group from the database and also update it locally.
   * application components.
   */
  @Effect()
  removeGroup$: Observable<Action> = this.actions$
    .ofType(groupsActions.ActionTypes.REMOVE_GROUP).pipe(
      map((action: groupsActions.RemoveGroupAction) => action.payload),
      switchMap((temp) => {
        return this.groupService.removeGroup(temp).pipe(
          map((response: any) => new groupsActions.RemoveGroupSuccessAction(response)),
          catchError((err: any) => {
            return Observable.throw(new groupsActions.RemoveGroupFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to edit the group in the database and also update it locally.
   * application components.
   */
  @Effect()
  editGroup$: Observable<Action> = this.actions$
    .ofType(groupsActions.ActionTypes.EDIT_GROUP).pipe(
      map((action: groupsActions.EditGroupAction) => action.payload),
      switchMap((temp) => {
        return this.groupService.editGroup(temp).pipe(
          map((response: any) => new groupsActions.EditGroupSuccessAction(response)),
          catchError((err: any) => {
            return Observable.throw(new groupsActions.EditGroupFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to remove the group members in the database and also update it locally.
   * application components.
   */
  @Effect()
  removeGroupMember$: Observable<Action> = this.actions$
    .ofType(groupsActions.ActionTypes.REMOVE_GROUP_MEMBER).pipe(
      map((action: groupsActions.RemoveGroupMemberAction) => action.payload),
      switchMap((temp) => {
        return this.groupService.removeMember(temp).pipe(
          map((response: any) => new groupsActions.RemoveGroupMemberSuccessAction(response)),
          catchError((err: any) => {
            return Observable.throw(new groupsActions.RemoveGroupMemberFailureAction(err));
          }));
      }));
  /**
   * Effect which is used to add the member into group in the database and also update it locally.
   * application components.
   */
  @Effect()
  addToGroup$: Observable<Action> = this.actions$
    .ofType(groupsActions.ActionTypes.ADD_TO_GROUP).pipe(
      map((action: groupsActions.AddToGroupAction) => action.payload),
      switchMap((temp) => {
        return this.groupService.addtoGroup(temp).pipe(
          map((response: any) => new groupsActions.AddToGroupSuccessAction(response)),
          catchError((err: any) => {
            return Observable.throw(new groupsActions.AddToGroupFailureAction(err));
          }));
      }));
  /**
  * Constructor which is used to inject the required services.
  * @param groupService Service which is used to make groups related api calls to the database.
  * @param actions$ Service which is used to define the actionType with the corresponding functionality to de done.
  */
  constructor(
    private groupService: GroupService,
    private actions$: Actions) { }
}
