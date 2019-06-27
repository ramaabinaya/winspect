// It defines the type of actions that could be done with the groups.
import { Action } from '@ngrx/store';
/**
* Const which defines the the action prefix for groups Actions.
*/
const ACTION_PREFIX = 'groups';
/**
* ActionTypes is a constant which export the actions defined in the groupsactions.
*/
export const ActionTypes = {
  LOAD: ACTION_PREFIX + 'Load',
  LOAD_SUCCESS: ACTION_PREFIX + 'Load success',
  LOAD_FAILURE: ACTION_PREFIX + 'Load failure',

  CREATE_GROUP: ACTION_PREFIX + 'create group',
  CREATE_GROUP_SUCCESS: ACTION_PREFIX + 'create group success',
  CREATE_GROUP_FAILURE: ACTION_PREFIX + 'create group failure',

  REMOVE_GROUP: ACTION_PREFIX + 'remove group',
  REMOVE_GROUP_SUCCESS: ACTION_PREFIX + 'remove group success',
  REMOVE_GROUP_FAILURE: ACTION_PREFIX + 'remove group failure',

  EDIT_GROUP: ACTION_PREFIX + 'edit group',
  EDIT_GROUP_SUCCESS: ACTION_PREFIX + 'edit group success',
  EDIT_GROUP_FAILURE: ACTION_PREFIX + 'edit group failure',

  REMOVE_GROUP_MEMBER: ACTION_PREFIX + 'remove group member',
  REMOVE_GROUP_MEMBER_SUCCESS: ACTION_PREFIX + 'remove group member success',
  REMOVE_GROUP_MEMBER_FAILURE: ACTION_PREFIX + 'remove group member failure',

  ADD_TO_GROUP: ACTION_PREFIX + 'add to group',
  ADD_TO_GROUP_SUCCESS: ACTION_PREFIX + 'add to group success',
  ADD_TO_GROUP_FAILURE: ACTION_PREFIX + 'add to group failure',
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
  * Type which defines the actionType for LoadSuccessAction.
  */
  type = ActionTypes.LOAD_SUCCESS;
  /**
  * Constructor which defines the payload type for the LoadSuccessAction.
  * @param payload {any[]} which defines the inputpayload for the LoadSuccessAction.
  */
  constructor(public payload: any[]) { }
}
/**
* Class which defines the Load Failure Action with the corresponding actionType and the Payload for that action.
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
* Class which defines the CreateGroupAction with the corresponding actionType and the Payload for that action.
*/
export class CreateGroupAction implements Action {
  /**
  * Type which defines the actionType for CreateGroupAction
  */
  type = ActionTypes.CREATE_GROUP;
  /**
  * Constructor which defines the payload type for the CreateGroupAction.
  * @param payload {any[]} which defines the inputpayload for the CreateGroupAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the CreateGroupSuccessAction with the corresponding actionType and the Payload for that action.
*/
export class CreateGroupSuccessAction implements Action {
  /**
  * Type which defines the actionType for CreateGroupSuccessAction
  */
  type = ActionTypes.CREATE_GROUP_SUCCESS;
  /**
  * Constructor which defines the payload type for the CreateGroupSuccessAction.
  * @param payload {NotificationComments} which defines the inputpayload for the CreateGroupSuccessAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the CreateGroupFailureAction with the corresponding actionType and the Payload for that action.
*/
export class CreateGroupFailureAction implements Action {
  /**
  * Type which defines the actionType for CreateGroupFailureAction
  */
  type = ActionTypes.CREATE_GROUP_FAILURE;
  /**
  * Constructor which defines the payload type for the CreateGroupFailureAction.
  * @param payload {any} which defines the inputpayload for the CreateGroupFailureAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the RemoveGroupAction with the corresponding actionType and the Payload for that action.
*/
export class RemoveGroupAction implements Action {
  /**
  * Type which defines the actionType for RemoveGroupAction
  */
  type = ActionTypes.REMOVE_GROUP;
  /**
  * Constructor which defines the payload type for the RemoveGroupAction.
  * @param payload {any[]} which defines the inputpayload for the RemoveGroupAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the RemoveGroupSuccessAction with the corresponding actionType and the Payload for that action.
*/
export class RemoveGroupSuccessAction implements Action {
  /**
  * Type which defines the actionType for RemoveGroupSuccessAction
  */
  type = ActionTypes.REMOVE_GROUP_SUCCESS;
  /**
  * Constructor which defines the payload type for the RemoveGroupSuccessAction.
  * @param payload {NotificationComments} which defines the inputpayload for the RemoveGroupSuccessAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the RemoveGroupFailureAction with the corresponding actionType and the Payload for that action.
*/
export class RemoveGroupFailureAction implements Action {
  /**
  * Type which defines the actionType for RemoveGroupFailureAction
  */
  type = ActionTypes.REMOVE_GROUP_FAILURE;
  /**
  * Constructor which defines the payload type for the RemoveGroupFailureAction.
  * @param payload {any} which defines the inputpayload for the RemoveGroupFailureAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the EditGroupAction with the corresponding actionType and the Payload for that action.
*/
export class EditGroupAction implements Action {
  /**
  * Type which defines the actionType for EditGroupAction
  */
  type = ActionTypes.EDIT_GROUP;
  /**
  * Constructor which defines the payload type for the EditGroupAction.
  * @param payload {any[]} which defines the inputpayload for the EditGroupAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the EditGroupSuccessAction with the corresponding actionType and the Payload for that action.
*/
export class EditGroupSuccessAction implements Action {
  /**
  * Type which defines the actionType for EditGroupSuccessAction
  */
  type = ActionTypes.EDIT_GROUP_SUCCESS;
  /**
  * Constructor which defines the payload type for the EditGroupSuccessAction.
  * @param payload {NotificationComments} which defines the inputpayload for the EditGroupSuccessAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the EditGroupFailureAction with the corresponding actionType and the Payload for that action.
*/
export class EditGroupFailureAction implements Action {
  /**
  * Type which defines the actionType for EditGroupFailureAction
  */
  type = ActionTypes.EDIT_GROUP_FAILURE;
  /**
  * Constructor which defines the payload type for the EditGroupFailureAction.
  * @param payload {any} which defines the inputpayload for the EditGroupFailureAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the RemoveGroupMemberAction with the corresponding actionType and the Payload for that action.
*/
export class RemoveGroupMemberAction implements Action {
  /**
  * Type which defines the actionType for RemoveGroupMemberAction
  */
  type = ActionTypes.REMOVE_GROUP_MEMBER;
  /**
  * Constructor which defines the payload type for the RemoveGroupMemberAction.
  * @param payload {any[]} which defines the inputpayload for the RemoveGroupMemberAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the RemoveGroupMemberSuccessAction with the corresponding actionType and the Payload for that action.
*/
export class RemoveGroupMemberSuccessAction implements Action {
  /**
  * Type which defines the actionType for RemoveGroupMemberSuccessAction
  */
  type = ActionTypes.REMOVE_GROUP_MEMBER_SUCCESS;
  /**
  * Constructor which defines the payload type for the RemoveGroupMemberSuccessAction.
  * @param payload {NotificationComments} which defines the inputpayload for the RemoveGroupMemberSuccessAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the RemoveGroupMemberFailureAction with the corresponding actionType and the Payload for that action.
*/
export class RemoveGroupMemberFailureAction implements Action {
  /**
  * Type which defines the actionType for RemoveGroupMemberFailureAction
  */
  type = ActionTypes.REMOVE_GROUP_MEMBER_FAILURE;
  /**
  * Constructor which defines the payload type for the RemoveGroupMemberFailureAction.
  * @param payload {any} which defines the inputpayload for the RemoveGroupMemberFailureAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the AddToGroupAction with the corresponding actionType and the Payload for that action.
*/
export class AddToGroupAction implements Action {
  /**
  * Type which defines the actionType for AddToGroupAction
  */
  type = ActionTypes.ADD_TO_GROUP;
  /**
  * Constructor which defines the payload type for the AddToGroupAction.
  * @param payload {any[]} which defines the inputpayload for the AddToGroupAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the AddToGroupSuccessAction with the corresponding actionType and the Payload for that action.
*/
export class AddToGroupSuccessAction implements Action {
  /**
  * Type which defines the actionType for AddToGroupSuccessAction
  */
  type = ActionTypes.ADD_TO_GROUP_SUCCESS;
  /**
  * Constructor which defines the payload type for the AddToGroupSuccessAction.
  * @param payload {NotificationComments} which defines the inputpayload for the AddToGroupSuccessAction.
  */
  constructor(public payload: any) { }
}
/**
* Class which defines the AddToGroupFailureAction with the corresponding actionType and the Payload for that action.
*/
export class AddToGroupFailureAction implements Action {
  /**
  * Type which defines the actionType for AddToGroupFailureAction
  */
  type = ActionTypes.ADD_TO_GROUP_FAILURE;
  /**
  * Constructor which defines the payload type for the AddToGroupFailureAction.
  * @param payload {any} which defines the inputpayload for the AddToGroupFailureAction.
  */
  constructor(public payload: any) { }
}
/**
* The defined actionTypes are exported here.
*/
export type Actions
  = LoadAction
  | CreateGroupAction
  | CreateGroupSuccessAction
  | CreateGroupFailureAction
  | RemoveGroupAction
  | RemoveGroupSuccessAction
  | RemoveGroupFailureAction
  | EditGroupAction
  | EditGroupSuccessAction
  | EditGroupFailureAction
  | RemoveGroupMemberAction
  | RemoveGroupMemberSuccessAction
  | RemoveGroupMemberFailureAction
  | AddToGroupAction
  | AddToGroupSuccessAction
  | AddToGroupFailureAction;
