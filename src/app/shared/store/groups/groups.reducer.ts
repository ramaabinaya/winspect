// Reducer function, which is used to do the transformation of states based on the dispatched action's success and failures.
import * as groupsActions from './groups.action';
import * as _ from 'lodash';
import { initialGroups, Groups } from '../../../common/models/groups.models';
import { store } from '@angular/core/src/render3';
/**
* Function which has the initial state and do transformations on the state
* based on each success and failure actions.
* @param state The State which defines the current state of the inspection details.
* @param action The action which defines the current dispatched action.
* @return {Groups[]}
*/
export function GroupsReducer(state = initialGroups, action: groupsActions.Actions): Groups[] {
  /**
  * It maps the current triggered action with the corresponding function.
  */
  switch (action.type) {
    /**
    * The case defines the action to be performed on the loadSuccessAction and returns the resulted state of the comments.
    */
    case groupsActions.ActionTypes.LOAD_SUCCESS: {
      const storeAction = <groupsActions.LoadSuccessAction>action;
      return _.cloneDeep(storeAction.payload);
    }
    /**
    * The case defines the action to be performed on the CreateGroupSuccessAction
    * and returns the resulted state of the comments.
    */
    case groupsActions.ActionTypes.CREATE_GROUP_SUCCESS: {
      const storeAction = <groupsActions.CreateGroupSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const groups = storeAction.payload;
      groups.groupMembers = [];
      clonedState.push(groups);
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the RemoveGroupSuccessAction
     * and returns the resulted state of the comments.
     */
    case groupsActions.ActionTypes.REMOVE_GROUP_SUCCESS: {
      const storeAction = <groupsActions.RemoveGroupSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const groupId = storeAction.payload.id;
      clonedState.find((item, index) => {
        if (item && item.id === groupId) {
          clonedState.splice(index, 1);
          return true;
        }
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the EditGroupSuccessAction
     * and returns the resulted state of the comments.
     */
    case groupsActions.ActionTypes.EDIT_GROUP_SUCCESS: {
      const storeAction = <groupsActions.EditGroupSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const id = storeAction.payload.id;
      const data = storeAction.payload.editgroup;
      clonedState.find((groups) => {
        if (groups.id === id) {
          groups.name = data.name;
          groups.description = data.description;
          return true;
        }
      });
      return clonedState;
    }
    /**
      * The case defines the action to be performed on the RemoveGroupMemberSuccessAction
      * and returns the resulted state of the comments.
      */
    case groupsActions.ActionTypes.REMOVE_GROUP_MEMBER_SUCCESS: {
      const storeAction = <groupsActions.RemoveGroupMemberSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const groupId = storeAction.payload.groupId;
      const memberId = storeAction.payload.technicianId;
      clonedState.find((group) => {
        if (group && group.id === groupId) {
          group.groupMembers.find((member, id) => {
            if (memberId === member.memberId) {
              group.groupMembers.splice(id, 1);
              return true;
            }
          });
          return true;
        }
      });
      return clonedState;
    }
    /**
      * The case defines the action to be performed on the AddToGroupSuccessAction
      * and returns the resulted state of the comments.
      */
    case groupsActions.ActionTypes.ADD_TO_GROUP_SUCCESS: {
      const storeAction = <groupsActions.AddToGroupSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const member = storeAction.payload;
      clonedState.find((item) => {
        if (item && member && item.id === member.groupId) {
          item.groupMembers.push(member);
          return true;
        }
      });
      return clonedState;
    }
    case groupsActions.ActionTypes.LOAD_FAILURE:
    /**
    * If the dispatched action doesn't match with any case It return the initial state of that action.
    */
    default: {
      return state;
    }
  }
}
