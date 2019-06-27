// It defines the type of actions that could be done with the reports.
import { Action } from '@ngrx/store';
import { AssignInspectionUsers } from '../../../inspection/model/assignInspectionUsers.model';
/**
 * Const which defines the the action prefix for report Actions.
 */
const ACTION_PREFIX = 'report';
/**
 * ActionTypes is a constant which export the actions defined in the reportactions.
 */
export const ActionTypes = {
  LOAD: ACTION_PREFIX + 'Load',
  LOAD_SUCCESS: ACTION_PREFIX + 'Load success',
  LOAD_FAILURE: ACTION_PREFIX + 'Load failure',

  CREATE_REPORT: ACTION_PREFIX + 'create report',

  CREATE_NEW_ASSIGN_INSPECTION: ACTION_PREFIX + 'create new assign inspection',
  CREATE_NEW_GROUP_ASSIGNMENT: ACTION_PREFIX + 'create new group assignment',

  CHANGE_REPORT_STATUS: ACTION_PREFIX + 'change report status',
  CHANGE_REPORT_STATUS_SUCCESS: ACTION_PREFIX + 'change report status success',
  CHANGE_REPORT_STATUS_FAILURE: ACTION_PREFIX + 'change report status failure',

  DELETE_REPORT: ACTION_PREFIX + 'delete report',
  DELETE_REPORT_SUCCESS: ACTION_PREFIX + 'delete report success',
  DELETE_REPORT_FAILURE: ACTION_PREFIX + 'delete report failure',

  CHANGE_ASSIGNED_INSPECTION_STATUS: ACTION_PREFIX + 'change assigned inspection status',
  CHANGE_ASSIGNED_INSPECTION_SUCCESS: ACTION_PREFIX + 'change assigned inspection success',
  CHANGE_ASSIGNED_INSPECTION_FAILURE: ACTION_PREFIX + 'change assigned inspection failure',

  CHANGE_DUE_DATE: ACTION_PREFIX + 'change duedate',
  CHANGE_DUE_DATE_SUCCESS: ACTION_PREFIX + 'change duedate success',
  CHANGE_DUE_DATE_FAILURE: ACTION_PREFIX + 'change duedate failure',

  REASSIGN_INSPECTION: ACTION_PREFIX + 'reassign inspection',
  REASSIGN_INSPECTION_SUCCESS: ACTION_PREFIX + 'reassign inspection success',
  REASSIGN_INSPECTION_FAILURE: ACTION_PREFIX + 'reassign inspection failure',

  CHANGE_ALL_REPORT_STATUS: ACTION_PREFIX + 'change allreport status',
  CHANGE_ALL_REPORT_STATUS_SUCCESS: ACTION_PREFIX + 'change allreport status success',
  CHANGE_ALL_REPORT_STATUS_FAILURE: ACTION_PREFIX + 'change allreport status failure',
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
   * @param payload {AssignInspectionUsers[]} which defines the inputpayload for the LoadSuccessAction.
   */
  constructor(public payload: AssignInspectionUsers[]) { }
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
 * Class which defines the ChangeReportStatusAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeReportStatusAction implements Action {
  /**
   * Type which defines the actionType for ChangeReportStatusAction
   */
  type = ActionTypes.CHANGE_REPORT_STATUS;
  /**
   * Constructor which defines the payload type for the ChangeReportStatusAction.
   * @param payload {any[]} which defines the inputpayload for the ChangeReportStatusAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the ChangeReportStatusSuccessAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeReportStatusSuccessAction implements Action {
  /**
   * Type which defines the actionType for ChangeReportStatusSuccessAction
   */
  type = ActionTypes.CHANGE_REPORT_STATUS_SUCCESS;
  /**
   * Constructor which defines the payload type for the ChangeReportStatusSuccessAction.
   * @param payload {any[]} which defines the inputpayload for the ChangeReportStatusSuccessAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the ChangeReportStatusFailureAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeReportStatusFailureAction implements Action {
  /**
   * Type which defines the actionType for ChangeReportStatusFailureAction
   */
  type = ActionTypes.CHANGE_REPORT_STATUS_FAILURE;
  /**
   * Constructor which defines the payload type for the ChangeReportStatusFailureAction.
   * @param payload {any} which defines the inputpayload for the ChangeReportStatusFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Load Action with the corresponding actionType and the Payload for that action.
 */
export class ChangeDuedateAction implements Action {
  /**
   * Type which defines the actionType for LoadAction
   */
  type = ActionTypes.CHANGE_DUE_DATE;
  /**
   * Constructor for the loadAction.
   * @param payload {AssignInspectionUsers[]} which defines the inputpayload for the LoadAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the Load Success Action with the corresponding actionType and the Payload for that action.
 */
export class ChangeDuedateSuccessAction implements Action {
  /**
   * Type which defines the actionType for LoadSuccessAction.
   */
  type = ActionTypes.CHANGE_DUE_DATE_SUCCESS;
  /**
   * Constructor which defines the payload type for the LoadSuccessAction.
   * @param payload {AssignInspectionUsers[]} which defines the inputpayload for the LoadSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Load Failure Action with the corresponding actionType and the Payload for that action.
 */
export class ChangeDuedateFailureAction implements Action {
  /**
   * Type which defines the actionType for LoadFailureAction
   */
  type = ActionTypes.CHANGE_DUE_DATE_FAILURE;
  /**
   * Constructor which defines the payload type for the LoadFailureAction.
   * @param payload {any[]} which defines the inputpayload for the LoadFailureAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the DeleteReportAction with the corresponding actionType and the Payload for that action.
 */
export class DeleteReportAction implements Action {
  /**
   * Type which defines the actionType for DeleteReportAction.
   */
  type = ActionTypes.DELETE_REPORT;
  /**
   * Constructor which defines the payload type for the DeleteReportAction.
   * @param payload {number} which defines the inputpayload for the DeleteReportAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the DeleteReportSuccessAction with the corresponding actionType and the Payload for that action.
 */
export class DeleteReportSuccessAction implements Action {
  /**
   * Type which defines the actionType for DeleteReportSuccessAction.
   */
  type = ActionTypes.DELETE_REPORT_SUCCESS;
  /**
   * Constructor which defines the payload type for the DeleteReportSuccessAction.
   * @param payload {number} which defines the inputpayload for the DeleteReportSuccessAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the DeleteReportFailureAction with the corresponding actionType and the Payload for that action.
 */
export class DeleteReportFailureAction implements Action {
  /**
   * Type which defines the actionType for DeleteReportFailureAction
   */
  type = ActionTypes.DELETE_REPORT_FAILURE;
  /**
   * Constructor which defines the payload type for the DeleteReportFailureAction.
   * @param payload {any[]} which defines the inputpayload for the DeleteReportFailureAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the ReassignInspectionAction with the corresponding actionType and the Payload for that action.
 */
export class ReassignInspectionAction implements Action {
  /**
  * Type which defines the actionType for ReassignInspectionAction
  */
  type = ActionTypes.REASSIGN_INSPECTION;
  /**
   * Constructor for the ReassignInspectionAction.
   * @param payload {any[]} which defines the inputpayload for the ReassignInspectionAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the ChangeAssignedInspectionStatusAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeAssignedInspectionStatusAction implements Action {
  /**
   * Type which defines the actionType for ChangeAssignedInspectionStatusAction
   */
  type = ActionTypes.CHANGE_ASSIGNED_INSPECTION_STATUS;
  /**
   * Constructor which defines the payload type for the ChangeAssignedInspectionStatusAction.
   * @param payload {any[]} which defines the inputpayload for the ChangeAssignedInspectionStatusAction.
  */
  constructor(public payload: any[]) {
  }
}
/**
 * Class which defines the ChangeAssignedInspectionStatusSuccessAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeAssignedInspectionStatusSuccessAction implements Action {
  /**
   * Type which defines the actionType for ChangeAssignedInspectionStatusSuccessAction
   */
  type = ActionTypes.CHANGE_ASSIGNED_INSPECTION_SUCCESS;
  /**
   * Constructor which defines the payload type for the ChangeAssignedInspectionStatusSuccessAction.
   * @param payload {any[]} which defines the inputpayload for the ChangeAssignedInspectionStatusSuccessAction.
  */
  constructor(public payload: any[]) {
  }
}
/**
 * Class which defines the ReassignInspectionSuccessAction with the corresponding actionType and the Payload for that action.
 */
export class ReassignInspectionSuccessAction implements Action {
  /**
   * Type which defines the actionType for ReassignInspectionSuccessAction.
   */
  type = ActionTypes.REASSIGN_INSPECTION_SUCCESS;
  /**
   * Constructor which defines the payload type for the ReassignInspectionSuccessAction.
   * @param payload {any[]} which defines the inputpayload for the ReassignInspectionSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
  * Class which defines the ReassignInspectionFailureAction with the corresponding actionType and the Payload for that action.
  */
export class ReassignInspectionFailureAction implements Action {
  /**
 * Type which defines the actionType for ReassignInspectionFailureAction
 */
  type = ActionTypes.REASSIGN_INSPECTION_FAILURE;
  /**
   * Constructor which defines the payload type for the ReassignInspectionFailureAction.
   * @param payload {any[]} which defines the inputpayload for the ReassignInspectionFailureAction.
   */
  constructor(public payload: any[]) { }
}
/**
 * Class which defines the ChangeAssignedInspectionStatusFailureAction with the corresponding actionType and the Payload for that action.
 */
export class ChangeAssignedInspectionStatusFailureAction implements Action {
  /**
   * Type which defines the actionType for ChangeAssignedInspectionStatusFailureAction
   */
  type = ActionTypes.CHANGE_ASSIGNED_INSPECTION_FAILURE;
  /**
   * Constructor which defines the payload type for the ChangeAssignedInspectionStatusFailureAction.
   * @param payload {any} which defines the inputpayload for the ChangeAssignedInspectionStatusFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the CreateNewAssignInspectionAction with the corresponding actionType and the Payload for that action.
 */
export class CreateNewAssignInspectionAction implements Action {
  /**
   * Type which defines the actionType for CreateNewAssignInspectionAction
   */
  type = ActionTypes.CREATE_NEW_ASSIGN_INSPECTION;
  /**
   * Constructor which defines the payload type for the CreateNewAssignInspectionAction.
   * @param payload {any} which defines the inputpayload for the CreateNewAssignInspectionAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the CreateReportAction with the corresponding actionType and the Payload for that action.
 */
export class CreateReportAction implements Action {
  /**
   * Type which defines the actionType for CreateReportAction
   */
  type = ActionTypes.CREATE_REPORT;
  /**
   * Constructor which defines the payload type for the CreateReportAction.
   * @param payload {any[]} which defines the inputpayload for the CreateReportAction.
   */
  constructor(public payload: any[]) { }
}
/**
* Class which defines the Load Action with the corresponding actionType and the Payload for that action.
*/
export class ChangeAllReportStatusAction implements Action {
  /**
 * Type which defines the actionType for LoadAction
 */
  type = ActionTypes.CHANGE_ALL_REPORT_STATUS;
  /**
   * Constructor for the loadAction.
   * @param payload {AssignInspectionUsers[]} which defines the inputpayload for the LoadAction.
   */
  constructor(public payload: any[]) { }
}
/**
* Class which defines the Load Success Action with the corresponding actionType and the Payload for that action.
*/
export class ChangeAllReportStatusSuccessAction implements Action {
  /**
 * Type which defines the actionType for LoadSuccessAction.
 */
  type = ActionTypes.CHANGE_ALL_REPORT_STATUS_SUCCESS;
  /**
 * Constructor which defines the payload type for the LoadSuccessAction.
 * @param payload {AssignInspectionUsers[]} which defines the inputpayload for the LoadSuccessAction.
 */
  constructor(public payload: any[]) { }
}
/**
* Class which defines the Load Failure Action with the corresponding actionType and the Payload for that action.
*/
export class ChangeAllReportStatusFailureAction implements Action {
  /**
 * Type which defines the actionType for ChangeAllReportStatusFailureAction
 */
  type = ActionTypes.CHANGE_ALL_REPORT_STATUS_FAILURE;
  /**
 * Constructor which defines the payload type for the ChangeAllReportStatusFailureAction.
 * @param payload {any[]} which defines the inputpayload for the ChangeAllReportStatusFailureAction.
 */
  constructor(public payload: any) { }
}
export class CreateNewGroupAssignment implements Action {
  /**
 * Type which defines the actionType for createNewGroupAssignment
 */
  type = ActionTypes.CREATE_NEW_GROUP_ASSIGNMENT;
  /**
 * Constructor which defines the payload type for the createNewGroupAssignment.
 * @param payload {any[]} which defines the inputpayload for the createNewGroupAssignment.
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
  | ChangeReportStatusAction
  | ChangeReportStatusSuccessAction
  | ChangeReportStatusFailureAction
  | ChangeDuedateAction
  | ChangeDuedateSuccessAction
  | ChangeDuedateFailureAction
  | DeleteReportAction
  | DeleteReportSuccessAction
  | DeleteReportFailureAction
  | ChangeAssignedInspectionStatusAction
  | ChangeAssignedInspectionStatusSuccessAction
  | ChangeAssignedInspectionStatusFailureAction
  | CreateReportAction
  | CreateNewAssignInspectionAction
  | ReassignInspectionAction
  | ReassignInspectionSuccessAction
  | ReassignInspectionFailureAction
  | ChangeAllReportStatusAction
  | ChangeAllReportStatusSuccessAction
  | ChangeAllReportStatusFailureAction
  | CreateNewGroupAssignment;


