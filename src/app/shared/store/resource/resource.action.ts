// It defines the type of actions that could be done with option group.
import { Action } from '@ngrx/store';
import { Resource } from '../../../common/models/create-resources-model';
/**
 * Const which defines the the action prefix for inspectionActions.
 */
const ACTION_PREFIX = 'resource';
/**
 * ActionTypes is a constant which export the actions defined in the inspectionActions.
 */
export const ActionTypes = {
  LOAD: ACTION_PREFIX + 'Load',
  LOAD_SUCCESS: ACTION_PREFIX + 'Load success',
  LOAD_FAILURE: ACTION_PREFIX + 'Load failure',

  ADD_RESOURCE: ACTION_PREFIX + 'add resource',
  ADD_RESOURCE_SUCCESS: ACTION_PREFIX + 'add resource success',
  ADD_RESOURCE_FAILURE: ACTION_PREFIX + 'add resource failure',

  ADD_RESOURCE_OPTION_CHOICE: ACTION_PREFIX + 'add option choice',
  ADD_RESOURCE_OPTION_CHOICE_SUCCESS: ACTION_PREFIX + 'add option choice success',
  ADD_RESOURCE_OPTION_CHOICE_FAILURE: ACTION_PREFIX + 'add option choice failure',

  ADD_MORE_RESOURCE_OPTION_CHOICE: ACTION_PREFIX + 'add more option choice',
  ADD_MORE_RESOURCE_OPTION_CHOICE_SUCCESS: ACTION_PREFIX + 'add more option choice success',
  ADD_MORE_RESOURCE_OPTION_CHOICE_FAILURE: ACTION_PREFIX + 'add more option choice failure',

  DELETE_RESOURCE: ACTION_PREFIX + 'delete resource',
  DELETE_RESOURCE_SUCCESS: ACTION_PREFIX + 'delete resource success',
  DELETE_RESOURCE_FAILURE: ACTION_PREFIX + 'delete resource failure',

  DELETE_RESOURCE_OPTION_CHOICE: ACTION_PREFIX + 'delete resource option choice',
  DELETE_RESOURCE_OPTION_CHOICE_SUCCESS: ACTION_PREFIX + 'delete resource option choice success',
  DELETE_RESOURCE_OPTION_CHOICE_FAILURE: ACTION_PREFIX + 'delete resource option choice failure',

  EDIT_RESOURCE: ACTION_PREFIX + 'edit resource',
  EDIT_RESOURCE_SUCCESS: ACTION_PREFIX + 'edit resource success',
  EDIT_RESOURCE_FAILURE: ACTION_PREFIX + 'edit resource failure',

  EDIT_RESOURCE_OPTION_CHOICE: ACTION_PREFIX + 'edit resource option choice',
  EDIT_RESOURCE_OPTION_CHOICE_SUCCESS: ACTION_PREFIX + 'edit resource option choice success',
  EDIT_RESOURCE_OPTION_CHOICE_FAILURE: ACTION_PREFIX + 'edit resource option choice failure',
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
 * Class which defines the Load Success Action with the corresponding actionType and the Payload for that action.
 */
export class LoadSuccessAction implements Action {
  /**
   * Type which defines the actionType for LoadSuccessAction
   */
  type = ActionTypes.LOAD_SUCCESS;
  /**
   * Constructor which defines the payload type for the loadSuccessAction.
   * @param payload {any[]} which defines the inputpayload for the LoadSuccessAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the Load Failure Action with the corresponding actionType and the Payload for that action.
 */
export class LoadFailureAction implements Action {
  /**
   * Type which defines the actionType for  LoadFailureAction
   */
  type = ActionTypes.LOAD_FAILURE;
  /**
   * Constructor which defines the payload type for the loadFailureAction.
   * @param payload {any[]} which defines the inputpayload for the LoadFailureAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the AddResourceAction Action with the corresponding actionType and the Payload for that action.
 */
export class AddResourceAction implements Action {
  /**
   * Type which defines the actionType for  AddResourceAction.
   */
  type = ActionTypes.ADD_RESOURCE;
  /**
   * Constructor which defines the payload type for the AddResourceAction.
   * @param payload {any} which defines the inputpayload for the AddResourceAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add Resource SuccessAction Action with the corresponding actionType and the Payload for that action.
 */
export class AddResourceSuccessAction implements Action {
  /**
   * Type which defines the actionType for  AddResourceSuccessAction.
   */
  type = ActionTypes.ADD_RESOURCE_SUCCESS;
  /**
   * Constructor which defines the payload type for the AddResourceSuccessAction.
   * @param payload {any} which defines the inputpayload for the AddResourceSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add Resource FailureAction Action with the corresponding actionType and the Payload for that action.
 */
export class AddResourceFailureAction implements Action {
  /**
   * Type which defines the actionType for  AddResourceFailureAction.
   */
  type = ActionTypes.ADD_RESOURCE_FAILURE;
  /**
   * Constructor which defines the payload type for the AddResourceFailureAction.
   * @param payload {any} which defines the inputpayload for the AddResourceFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the AddResourceOptionChoiceAction with the corresponding actionType and the Payload for that action.
 */
export class AddResourceOptionChoiceAction implements Action {
  /**
   * Type which defines the actionType for  AddResourceOptionChoiceAction.
   */
  type = ActionTypes.ADD_RESOURCE_OPTION_CHOICE;
  /**
   * Constructor which defines the payload type for the AddResourceOptionChoiceAction.
   * @param payload {any} which defines the inputpayload for the AddResourceOptionChoiceAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add ResourceOptionChoice Success Action with the corresponding actionType and the Payload for that action.
 */
export class AddResourceOptionChoiceSuccessAction implements Action {
  /**
   * Type which defines the actionType for  AddResourceOptionChoiceSuccessAction.
   */
  type = ActionTypes.ADD_RESOURCE_OPTION_CHOICE_SUCCESS;
  /**
   * Constructor which defines the payload type for the AddResourceOptionChoiceSuccessAction.
   * @param payload {any} which defines the inputpayload for the AddResourceOptionChoiceSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add ResourceOptionChoice Failure Action with the corresponding actionType and the Payload for that action.
 */
export class AddResourceOptionChoiceFailureAction implements Action {
  /**
   * Type which defines the actionType for  AddResourceOptionChoiceFailureAction.
   */
  type = ActionTypes.ADD_RESOURCE_OPTION_CHOICE_FAILURE;
  /**
   * Constructor which defines the payload type for the AddResourceOptionChoiceFailureAction.
   * @param payload {any} which defines the inputpayload for the AddResourceOptionChoiceFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add MoreResourceOptionChoice Action with the corresponding actionType and the Payload for that action.
 */
export class AddMoreResourceOptionChoiceAction implements Action {
  /**
   * Type which defines the actionType for  AddMoreResourceOptionChoiceAction.
   */
  type = ActionTypes.ADD_MORE_RESOURCE_OPTION_CHOICE;
  /**
   * Constructor which defines the payload type for the AddMoreResourceOptionChoiceAction.
   * @param payload {any} which defines the inputpayload for the AddMoreResourceOptionChoiceAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add MoreResourceOptionChoice Success Action with the corresponding actionType and the Payload for that action.
 */
export class AddMoreResourceOptionChoiceSuccessAction implements Action {
  /**
   * Type which defines the actionType for  AddMoreResourceOptionChoiceSuccessAction.
   */
  type = ActionTypes.ADD_MORE_RESOURCE_OPTION_CHOICE_SUCCESS;
  /**
   * Constructor which defines the payload type for the AddMoreResourceOptionChoiceSuccessAction.
   * @param payload {any} which defines the inputpayload for the AddMoreResourceOptionChoiceSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add MoreResourceOptionChoice Failure Action with the corresponding actionType and the Payload for that action.
 */
export class AddMoreResourceOptionChoiceFailureAction implements Action {
  /**
   * Type which defines the actionType for  AddMoreResourceOptionChoiceFailureAction.
   */
  type = ActionTypes.ADD_MORE_RESOURCE_OPTION_CHOICE_FAILURE;
  /**
   * Constructor which defines the payload type for the AddMoreResourceOptionChoiceFailureAction.
   * @param payload {any} which defines the inputpayload for the AddMoreResourceOptionChoiceFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Delete Resource Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteResourceAction implements Action {
  /**
   * Type which defines the actionType for DeleteResourceAction.
   */
  type = ActionTypes.DELETE_RESOURCE;
  /**
   * Constructor which defines the payload type for the DeleteResourceAction.
   * @param payload {any} which defines the inputpayload for the DeleteResourceAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the Delete Resource Success Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteResourceSuccessAction implements Action {
  /**
   * Type which defines the actionType for  DeleteResourceSuccessAction.
   */
  type = ActionTypes.DELETE_RESOURCE_SUCCESS;
  /**
   * Constructor which defines the payload type for the DeleteResourceSuccessAction.
   * @param payload {any} which defines the inputpayload for the DeleteResourceSuccessAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the Delete Resource Failure Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteResourceFailureAction implements Action {
  /**
   * Type which defines the actionType for DeleteResourceFailureAction.
   */
  type = ActionTypes.DELETE_RESOURCE_FAILURE;
  /**
   * Constructor which defines the payload type for the DeleteResourceFailureAction.
   * @param payload {any} which defines the inputpayload for the DeleteResourceFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Delete Resource Failure Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteResourceOptionChoiceAction implements Action {
  /**
   * Type which defines the actionType for  DeleteResourceFailureAction.
   */
  type = ActionTypes.DELETE_RESOURCE_OPTION_CHOICE;
  /**
   * Constructor which defines the payload type for the DeleteResourceFailureAction.
   * @param payload {any} which defines the inputpayload for the DeleteResourceFailureAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the Delete ResourceOptionChoice Success Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteResourceOptionChoiceSuccessAction implements Action {
  /**
   * Type which defines the actionType for DeleteResourceOptionChoiceSuccessAction.
   */
  type = ActionTypes.DELETE_RESOURCE_OPTION_CHOICE_SUCCESS;
  /**
   * Constructor which defines the payload type for the DeleteResourceOptionChoiceSuccessAction.
   * @param payload {any} which defines the inputpayload for the DeleteResourceOptionChoiceSuccessAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the Delete ResourceOptionChoice FailureAction with the corresponding actionType and the Payload for that action.
 */
export class DeleteResourceOptionChoiceFailureAction implements Action {
  /**
   * Type which defines the actionType for DeleteResourceOptionChoiceFailureAction.
   */
  type = ActionTypes.DELETE_RESOURCE_OPTION_CHOICE_FAILURE;
  /**
   * Constructor which defines the payload type for the DeleteResourceOptionChoiceFailureAction.
   * @param payload {any} which defines the inputpayload for the DeleteResourceOptionChoiceFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the EditResourceAction with the corresponding actionType and the Payload for that action.
 */
export class EditResourceAction implements Action {
  /**
   * Type which defines the actionType for EditResourceAction.
   */
  type = ActionTypes.EDIT_RESOURCE;
  /**
   * Constructor which defines the payload type for the EditResourceAction.
   * @param payload {any} which defines the inputpayload for the EditResourceAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Edit Resource Success Action with the corresponding actionType and the Payload for that action.
 */
export class EditResourceSuccessAction implements Action {
  /**
   * Type which defines the actionType for EditResourceSuccessAction.
   */
  type = ActionTypes.EDIT_RESOURCE_SUCCESS;
  /**
   * Constructor which defines the payload type for the EditResourceSuccessAction.
   * @param payload {any} which defines the inputpayload for the EditResourceSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Edit Resource Failure Action with the corresponding actionType and the Payload for that action.
 */
export class EditResourceFailureAction implements Action {
  /**
   * Type which defines the actionType for EditResourceFailureAction.
   */
  type = ActionTypes.EDIT_RESOURCE_FAILURE;
  /**
   * Constructor which defines the payload type for the EditResourceFailureAction.
   * @param payload {any} which defines the inputpayload for the EditResourceFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Edit ResourceOptionChoice Action with the corresponding actionType and the Payload for that action.
 */
export class EditResourceOptionChoiceAction implements Action {
  /**
   * Type which defines the actionType for  EditResourceOptionChoiceAction.
   */
  type = ActionTypes.EDIT_RESOURCE_OPTION_CHOICE;
  /**
   * Constructor which defines the payload type for the EditResourceOptionChoiceAction.
   * @param payload {any} which defines the inputpayload for the EditResourceOptionChoiceAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Edit ResourceOptionChoice Success Action with the corresponding actionType and the Payload for that action.
 */
export class EditResourceOptionChoiceSuccessAction implements Action {
  /**
   * Type which defines the actionType for  EditResourceOptionChoiceSuccessAction.
   */
  type = ActionTypes.EDIT_RESOURCE_OPTION_CHOICE_SUCCESS;
  /**
   * Constructor which defines the payload type for the EditResourceOptionChoiceSuccessAction.
   * @param payload {any} which defines the inputpayload for the EditResourceOptionChoiceSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Edit ResourceOptionChoice Failure Action with the corresponding actionType and the Payload for that action.
 */
export class EditResourceOptionChoiceFailureAction implements Action {
  /**
   * Type which defines the actionType for  EditResourceOptionChoiceFailureAction.
   */
  type = ActionTypes.EDIT_RESOURCE_OPTION_CHOICE_FAILURE;
  /**
   * Constructor which defines the payload type for the EditResourceOptionChoiceFailureAction.
   * @param payload {any} which defines the inputpayload for the EditResourceOptionChoiceFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * The defined actionTypes are exported here.
 */
export type Actions
  = LoadAction
  | LoadSuccessAction
  | LoadFailureAction
  | AddResourceAction
  | AddResourceSuccessAction
  | AddResourceFailureAction
  | AddResourceOptionChoiceAction
  | AddResourceOptionChoiceSuccessAction
  | AddResourceOptionChoiceFailureAction
  | AddMoreResourceOptionChoiceAction
  | AddMoreResourceOptionChoiceSuccessAction
  | AddMoreResourceOptionChoiceFailureAction
  | DeleteResourceAction
  | DeleteResourceSuccessAction
  | DeleteResourceFailureAction
  | DeleteResourceOptionChoiceAction
  | DeleteResourceOptionChoiceSuccessAction
  | DeleteResourceOptionChoiceFailureAction
  | EditResourceAction
  | EditResourceSuccessAction
  | EditResourceFailureAction
  | EditResourceOptionChoiceAction
  | EditResourceOptionChoiceSuccessAction
  | EditResourceOptionChoiceFailureAction;
