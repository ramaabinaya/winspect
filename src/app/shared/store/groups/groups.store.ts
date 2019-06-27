// commentsStore is used to store the all groups details locally.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as groupsActions from '../groups/groups.action';
import { Groups } from '../../../common/models/groups.models';
/**
* Class which is used to store the groups details locally in the application.
*/
@Injectable()
export class GroupsStore {
  /**
  * Variable which is used to define the groups details.
  * @type {Observable<Groups[]>}
  */
  groups: Observable<Groups[]>;
  /**
  * Class constructor to inject the required services.
  * @param store To define the store.
  */
  constructor(private store: Store<any>) {
    this.groups = this.store.select(s => s.SharedModule.Groups);
  }
  /**
  * Method which is used to dispatch the action for load groups.
  * @return {void}
  */
  load() {
    this.store.dispatch({ type: groupsActions.ActionTypes.LOAD });
  }
  /**
   * Method which is used to dispatch the action for create new group.
   * @param group The group details to save.
   */
  createGroup(group) {
    this.store.dispatch({ type: groupsActions.ActionTypes.CREATE_GROUP, payload: group });
  }
  /**
   * Method which is used to dispatch the action for remove the group.
   * @param id {number} The index of the selected group.
   */
  removeGroup(id) {
    this.store.dispatch({ type: groupsActions.ActionTypes.REMOVE_GROUP, payload: id });
  }
  /**
   * Method which is used to dispatch the action for editing the group details.
   * @param id {number} The index of the selected group.
   * @param editgroup The editgroup which is define the edit group form details.
   */
  editGroup(id, editgroup) {
    const temp = {
      id: id,
      editgroup: editgroup
    };
    this.store.dispatch({ type: groupsActions.ActionTypes.EDIT_GROUP, payload: temp });
  }
  /**
   * Method which is used to dispatch the action for remove the group member.
   * @param groupId {number} The index of the selected group id.
   * @param technicianId {number} The index of the selected technician id.
   */
  removeMember(groupId, technicianId) {
    const temp = {
      groupId: groupId,
      technicianId: technicianId
    };
    this.store.dispatch({ type: groupsActions.ActionTypes.REMOVE_GROUP_MEMBER, payload: temp });
  }
  /**
   * Method which is used to dispatch the action for add the member into group.
   * @param groupId {number} The index of the selected group id.
   * @param technicianId {number} The index of the selected technician id.
   */
  addToGroup(groupId, technicianId) {
    const temp = {
      groupId: groupId,
      memberId: technicianId
    };
    this.store.dispatch({ type: groupsActions.ActionTypes.ADD_TO_GROUP, payload: temp });
  }
}
