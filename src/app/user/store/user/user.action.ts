// It defines the type of actions that could be done with the users.
import { Action } from '@ngrx/store';
import { User } from '../../model/user.model';
/**
 * Const which defines the the action prefix for userActions.
 */
const ACTION_PREFIX = '[user] ';
/**
 * ActionTypes is a constant which export the actions defined in the userActions.
 */
export const ActionTypes = {
  LOAD: ACTION_PREFIX + 'load users',
  LOAD_SUCCESS: ACTION_PREFIX + 'load users success',
  LOAD_FAILURE: ACTION_PREFIX + 'load users failure',

  CREATE_USER: ACTION_PREFIX + 'create user',
  CREATE_USER_SUCCESS: ACTION_PREFIX + 'create user success',
  CREATE_USER_FAILURE: ACTION_PREFIX + 'create user failure',

  EDIT_USER: ACTION_PREFIX + 'edit user',
  EDIT_USER_SUCCESS: ACTION_PREFIX + 'edit user success',
  EDIT_USER_FAILURE: ACTION_PREFIX + 'edit user failure',

  CHANGE_USER_STATUS: ACTION_PREFIX + 'change user status',
  CHANGE_USER_STATUS_SUCCESS: ACTION_PREFIX + ' change user status success',
  CHANGE_USER_STATUS_FAILURE: ACTION_PREFIX + ' change user status failure'
};
/**
 * Class which defines the Load Action with the corresponding actionType and the Payload for that action.
 */
export class LoadAction implements Action {
  /**
   * Type which defines the actionType for LoadAction
   */
  type = ActionTypes.LOAD;
  /**
   * Constructor for the loadAction.
   */
  constructor() { }
}
/**
 * Class which defines the LoadSuccessAction with the corresponding actionType and the Payload for that action.
 */
export class LoadSuccessAction implements Action {
  /**
   * Type which defines the actionType for LoadSuccessAction
   */
  type = ActionTypes.LOAD_SUCCESS;
  /**
   * Constructor which defines the payload type for the LoadSuccessAction.
   * @param payload {User[]} which defines the inputpayload for the LoadSuccessAction.
   */
  constructor(public payload: User[]) { }
}
/**
 * Class which defines the LoadFailureAction with the corresponding actionType and the Payload for that action.
 */
export class LoadFailureAction implements Action {
  /**
   * Type which defines the actionType for LoadFailureAction
   */
  type = ActionTypes.LOAD_FAILURE;
  /**
   * Constructor which defines the payload type for the LoadFailureAction.
   * @param payload {any[]} which defines the inputpayload for the LoadFailureAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the CreateUserAction with the corresponding actionType and the Payload for that action.
 */
export class CreateUserAction implements Action {
  /**
   * Type which defines the actionType for CreateUserAction
   */
  type = ActionTypes.CREATE_USER;
  /**
   * Constructor which defines the payload type for the CreateUserAction.
   * @param payload {any[]} which defines the inputpayload for the CreateUserAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the CreateUserSuccessAction with the corresponding actionType and the Payload for that action.
 */
export class CreateUserSuccessAction implements Action {
  /**
   * Type which defines the actionType for CreateUserSuccessAction
   */
  type = ActionTypes.CREATE_USER_SUCCESS;
  /**
   * Constructor which defines the payload type for the CreateUserSuccessAction.
   * @param payload {User} which defines the inputpayload for the CreateUserSuccessAction.
   */
  constructor(public payload: User) { }
}
/**
 * Class which defines the CreateUserFailureAction with the corresponding actionType and the Payload for that action.
 */
export class CreateUserFailureAction implements Action {
  /**
   * Type which defines the actionType for CreateUserFailureAction
   */
  type = ActionTypes.CREATE_USER_FAILURE;
  /**
   * Constructor which defines the payload type for the CreateUserFailureAction.
   * @param payload {any} which defines the inputpayload for the CreateUserFailureAction
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the ChangeUserStatusAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeUserStatusAction implements Action {
  /**
   * Type which defines the actionType for ChangeUserStatusAction
   */
  type = ActionTypes.CHANGE_USER_STATUS;
  /**
   * Constructor which defines the payload type for the ChangeUserStatusAction.
   * @param payload {User} which defines the inputpayload for the ChangeUserStatusAction.
   */
  constructor(public payload: User) { }
}
/**
 * Class which defines the ChangeUserStatusSuccessAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeUserStatusSuccessAction implements Action {
  /**
   * Type which defines the actionType for ChangeUserStatusSuccessAction
   */
  type = ActionTypes.CHANGE_USER_STATUS_SUCCESS;
  /**
   * Constructor which defines the payload type for the ChangeUserStatusSuccessAction.
   * @param payload {User} which defines the inputpayload for the ChangeUserStatusSuccessAction.
   */
  constructor(public payload: User) { }
}
/**
 * Class which defines the ChangeUserStatusFailureAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeUserStatusFailureAction implements Action {
  /**
   * Type which defines the actionType for ChangeUserStatusFailureAction
   */
  type = ActionTypes.CHANGE_USER_STATUS_FAILURE;
  /**
   * Constructor which defines the payload type for the ChangeUserStatusFailureAction.
   * @param payload {any[]} which defines the inputpayload for the ChangeUserStatusFailureAction
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the EditUserAction with the corresponding actionType and the Payload for that action.
 */
export class EditUserAction implements Action {
  /**
   * Type which defines the actionType for EditUserAction
   */
  type = ActionTypes.EDIT_USER;
  /**
   * Constructor which defines the payload type for the EditUserAction.
   * @param payload { any[]} which defines the inputpayload for the EditUserAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the EditUserSuccessAction with the corresponding actionType and the Payload for that action.
 */
export class EditUserSuccessAction implements Action {
  /**
   * Type which defines the actionType for EditUserSuccessAction
   */
  type = ActionTypes.EDIT_USER_SUCCESS;
  /**
   * Constructor which defines the payload type for the EditUserSuccessAction.
   * @param payload { any[]} which defines the inputpayload for the EditUserSuccessAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the EditUserFailureAction with the corresponding actionType and the Payload for that action.
 */
export class EditUserFailureAction implements Action {
  /**
   * Type which defines the actionType for EditUserFailureAction
   */
  type = ActionTypes.EDIT_USER_FAILURE;
  /**
   * Constructor which defines the payload type for the EditUserFailureAction.
   * @param payload { any[]} which defines the inputpayload for the EditUserFailureAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * The defined actionTypes are exported here.
 */
export type Actions
  = LoadAction
  | LoadSuccessAction
  | LoadFailureAction
  | CreateUserAction
  | CreateUserSuccessAction
  | CreateUserFailureAction
  | ChangeUserStatusAction
  | ChangeUserStatusSuccessAction
  | ChangeUserStatusFailureAction
  | EditUserAction
  | EditUserSuccessAction
  | EditUserFailureAction;
