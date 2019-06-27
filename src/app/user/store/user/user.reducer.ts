// Reducer function, which is used to do the transformation of states based on the dispatched action's success and failures.
import * as userActions from './user.action';
import * as _ from 'lodash';
import { initialUserModel, User } from '../../model/user.model';
/**
 * Function which has the initial state and do transformations on the state
 * based on each success and failure actions.
 * @param state The State which defines the current state of the inspection details.
 * @param action The action which defines the current dispatched action.
 * @return {AssignInspectionUsers[]}
 */
export function UserReducer(state = initialUserModel, action: userActions.Actions): User[] {
  /**
   * It maps the current triggered action with the corresponding function to be performed.
   */
  switch (action.type) {
    /**
     * The case which defines the action to be performed on the loadSuccessAction and returns the resulted state of the report.
     */
    case userActions.ActionTypes.LOAD_SUCCESS: {
      const storeAction = <userActions.LoadSuccessAction>action;
      return _.cloneDeep(storeAction.payload);
    }
    /**
     * The case which defines the action to be performed on the createuserSuccessAction
     * and returns the resulted state of the report.
     */
    case userActions.ActionTypes.CREATE_USER: {
      const storeAction = <userActions.CreateUserAction>action;
      const clonedState = _.cloneDeep(state);
      const user = storeAction.payload[0];
      const userRole = storeAction.payload[1];
      if (user) {
        user.userRole = { name: userRole };
      }
      clonedState.push(user);
      return clonedState;
    }
    /**
     * The case which defines the action to be performed on the changeUserStatusSuccessAction
     * and returns the resulted state of the report.
     */
    case userActions.ActionTypes.CHANGE_USER_STATUS_SUCCESS: {
      const storeAction = <userActions.ChangeUserStatusSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const data = storeAction.payload;
      clonedState.find(
        (item, index) => {
          if (item && item.id === data.id) {
            clonedState[index].active = data.active;
            clonedState[index].modified = new Date(Date.now()).toISOString();
            return true;
          }
        }
      );
      return clonedState;
    }
    /**
     * The case which defines the action to be performed on the EditUserSuccessAction
     * and returns the resulted state of the report.
     */
    case userActions.ActionTypes.EDIT_USER_SUCCESS: {
      const storeAction = <userActions.EditUserSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const id = storeAction.payload[0];
      const user = storeAction.payload[1];
      clonedState.find(
        (item, index) => {
          if (item && item.id === id) {
            Object.assign(clonedState[index], user);
            return true;
          }
        }
      );
      return clonedState;
    }
    /**
     * If the dispatched action doesn't match with any case It return the initial state of that action.
     */
    case userActions.ActionTypes.LOAD_FAILURE: {
      return [];
    }
    case userActions.ActionTypes.CHANGE_USER_STATUS_FAILURE:
    case userActions.ActionTypes.EDIT_USER_FAILURE:
    default: {
      return state;
    }
  }
}
