// It defines the type of actions that could be done with the inspections.
import { Action } from '@ngrx/store';
import { Inspection } from '../../../inspection/model/inspection.model';
/**
 * Const which defines the the action prefix for inspectionActions.
 */
const ACTION_PREFIX = 'inspection';
/**
 * ActionTypes is a constant which export the actions defined in the inspectionActions.
 */
export const ActionTypes = {
  LOAD: ACTION_PREFIX + 'Load',
  LOAD_SUCCESS: ACTION_PREFIX + 'Load success',
  LOAD_FAILURE: ACTION_PREFIX + 'Load failure',

  SELECT_INSPECTION: ACTION_PREFIX + 'select inspection',

  ADD_INSPECTION: ACTION_PREFIX + 'add inspection',
  ADD_INSPECTION_SUCCESS: ACTION_PREFIX + 'add inspection success',
  ADD_INSPECTION_FAILURE: ACTION_PREFIX + 'add inspection failure',



  ADD_INPUT_PROPERTIES: ACTION_PREFIX + 'add input properties',
  ADD_INPUT_PROPERTIES_SUCCESS: ACTION_PREFIX + 'add input properties success',
  ADD_INPUT_PROPERTIES_FAILURE: ACTION_PREFIX + 'add input properties failure',

  EDIT_SECTION_NAME: ACTION_PREFIX + 'edit section name',
  EDIT_SECTION_NAME_SUCCESS: ACTION_PREFIX + 'edit section name success',
  EDIT_SECTION_NAME_FAILURE: ACTION_PREFIX + 'edit section name failure',

  ADD_SECTION: ACTION_PREFIX + 'add section',
  ADD_SECTION_SUCCESS: ACTION_PREFIX + 'add section success',
  ADD_SECTION_FAILURE: ACTION_PREFIX + 'add section failure',

  DELETE_INSPECTION: ACTION_PREFIX + 'delete inspection',
  DELETE_INSPECTION_SUCCESS: ACTION_PREFIX + 'delete inspection success',
  DELETE_INSPECTION_FAILURE: ACTION_PREFIX + 'delete inspection failure',

  DELETE_SECTION: ACTION_PREFIX + 'delete section',
  DELETE_SECTION_SUCCESS: ACTION_PREFIX + 'delete section success',
  DELETE_SECTION_FAILURE: ACTION_PREFIX + 'delete section failure',

  EDIT_INSPECTION: ACTION_PREFIX + 'edit inspection',
  EDIT_INSPECTION_SUCCESS: ACTION_PREFIX + 'edit inspection success',
  EDIT_INSPECTION_FAILURE: ACTION_PREFIX + 'edit inspection failure',

  CHANGE_INSPECTION_STATUS: ACTION_PREFIX + 'change inspection status',
  CHANGE_INSPECTION_STATUS_SUCCESS: ACTION_PREFIX + 'change inspection status success',
  CHANGE_INSPECTION_STATUS_FAILURE: ACTION_PREFIX + 'change inspection status failure',
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
   * @param payload {Inspection[]} which defines the inputpayload for the LoadSuccessAction.
   */
  constructor(public payload: Inspection[]) { }
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
 * Class which defines the SelectInspectionAction with the corresponding actionType and the Payload for that action.
 */
export class SelectInspectionAction implements Action {
  /**
   * Type which defines the actionType for SelectInspectionAction
   */
  type = ActionTypes.SELECT_INSPECTION;
  /**
   * Constructor which defines the payload type for the selectInspectionAction.
   * @param payload {number} which defines the inputpayload for the selectInspectionAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the AddInspection Action with the corresponding actionType and the Payload for that action.
 */
export class AddInspectionAction implements Action {
  /**
   * Type which defines the actionType for  AddInspectionAction.
   */
  type = ActionTypes.ADD_INSPECTION;
  /**
   * Constructor which defines the payload type for the AddInspectionAction.
   * @param payload {any} which defines the inputpayload for the AddInspectionAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add Inspection Success Action with the corresponding actionType and the Payload for that action.
 */
export class AddInspectionSuccessAction implements Action {
  /**
   * Type which defines the actionType for  AddInspectionSuccessAction.
   */
  type = ActionTypes.ADD_INSPECTION_SUCCESS;
  /**
   * Constructor which defines the payload type for the AddInspectionSuccessAction.
   * @param payload {any} which defines the inputpayload for the AddInspectionSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add Inspection Failure Action with the corresponding actionType and the Payload for that action.
 */
export class AddInspectionFailureAction implements Action {
  /**
   * Type which defines the actionType for  AddInspectionFailureAction.
   */
  type = ActionTypes.ADD_INSPECTION_FAILURE;
  /**
   * Constructor which defines the payload type for the AddInspectionFailureAction.
   * @param payload {any} which defines the inputpayload for the AddInspectionFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add input properties Action with the corresponding actionType and the Payload for that action.
 */
export class AddInputPropertiesAction implements Action {
  /**
   * Type which defines the actionType for  AddInputPropertiesAction.
   */
  type = ActionTypes.ADD_INPUT_PROPERTIES;
  /**
   * Constructor which defines the payload type for the AddInputPropertiesAction.
   * @param payload {any} which defines the inputpayload for the AddInputPropertiesAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add input success properties Action with the corresponding actionType and the Payload for that action.
 */
export class AddInputPropertiesSuccessAction implements Action {
  /**
   * Type which defines the actionType for  AddInputPropertiesSuccessAction.
   */
  type = ActionTypes.ADD_INPUT_PROPERTIES_SUCCESS;
  /**
   * Constructor which defines the payload type for the AddInputPropertiesSuccessAction.
   * @param payload {any} which defines the inputpayload for the AddInputPropertiesSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Add input failure properties Action with the corresponding actionType and the Payload for that action.
 */
export class AddInputPropertiesFailureAction implements Action {
  /**
   * Type which defines the actionType for  AddInputPropertiesFailureAction.
   */
  type = ActionTypes.ADD_INPUT_PROPERTIES_FAILURE;
  /**
   * Constructor which defines the payload type for the AddInputPropertiesFailureAction.
   * @param payload {any} which defines the inputpayload for the AddInputPropertiesFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Edit Section Name Action with the corresponding actionType and the Payload for that action.
 */
export class EditSectionNameAction implements Action {
  /**
   * Type which defines the actionType for  EditSectionNameACtion.
   */
  type = ActionTypes.EDIT_SECTION_NAME;
  /**
   * Constructor which defines the payload type for the EditSectionNameAction.
   * @param payload {any} which defines the inputpayload for the EditSectionNameAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Edit Section Name Success Action with the corresponding actionType and the Payload for that action.
 */
export class EditSectionNameSuccessAction implements Action {
  /**
   * Type which defines the actionType for  EditSectionNameSuccessAction.
   */
  type = ActionTypes.EDIT_SECTION_NAME_SUCCESS;
  /**
   * Constructor which defines the payload type for the EditSectionNameSuccessAction.
   * @param payload {any} which defines the inputpayload for the EditSectionNameSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the Edit Section Name Failure Action with the corresponding actionType and the Payload for that action.
 */
export class EditSectionNameFailureAction implements Action {
  /**
   * Type which defines the actionType for  EditSectionNameFailureAction.
   */
  type = ActionTypes.EDIT_SECTION_NAME_FAILURE;
  /**
   * Constructor which defines the payload type for the EditSectionNameFailureAction.
   * @param payload {any} which defines the inputpayload for the EditSectionNameFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the add Section Action with the corresponding actionType and the Payload for that action.
 */
export class AddSectionAction implements Action {
  /**
   * Type which defines the actionType for  AddSectionAction.
   */
  type = ActionTypes.ADD_SECTION;
  /**
   * Constructor which defines the payload type for the AddSectionAction.
   * @param payload {any} which defines the inputpayload for the AddSectionAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the add Section Success Action with the corresponding actionType and the Payload for that action.
 */
export class AddSectionSuccessAction implements Action {
  /**
   * Type which defines the actionType for  AddSectionSuccessAction.
   */
  type = ActionTypes.ADD_SECTION_SUCCESS;
  /**
   * Constructor which defines the payload type for the AddSectionSuccessAction.
   * @param payload {any} which defines the inputpayload for the AddSectionSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the add Section Failure Action with the corresponding actionType and the Payload for that action.
 */
export class AddSectionFailureAction implements Action {
  /**
   * Type which defines the actionType for  AddSectionFailureAction.
   */
  type = ActionTypes.ADD_SECTION_FAILURE;
  /**
   * Constructor which defines the payload type for the AddSectionFailureAction.
   * @param payload {any} which defines the inputpayload for the AddSectionFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the delete Section Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteSectionAction implements Action {
  /**
   * Type which defines the actionType for  DeleteSectionAction.
   */
  type = ActionTypes.DELETE_SECTION;
  /**
   * Constructor which defines the payload type for the DeleteSectionAction.
   * @param payload {any} which defines the inputpayload for the DeleteSectionAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the delete Section Success Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteSectionSuccessAction implements Action {
  /**
   * Type which defines the actionType for  DeleteSectionSuccessAction.
   */
  type = ActionTypes.DELETE_SECTION_SUCCESS;
  /**
   * Constructor which defines the payload type for the DeleteSectionSuccessAction.
   * @param payload {any} which defines the inputpayload for the DeleteSectionSuccessAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the delete Section failure Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteSectionFailureAction implements Action {
  /**
   * Type which defines the actionType for  DeleteSectionFailureAction.
   */
  type = ActionTypes.DELETE_SECTION_FAILURE;
  /**
   * Constructor which defines the payload type for the DeleteSectionFailureAction.
   * @param payload {any} which defines the inputpayload for the DeleteSectionFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the EditInspection Action with the corresponding actionType and the Payload for that action.
 */
export class EditInspectionAction implements Action {
  /**
   * Type which defines the actionType for  EditInspectionAction.
   */
  type = ActionTypes.EDIT_INSPECTION;
  /**
   * Constructor which defines the payload type for the EditInspectionAction.
   * @param payload {any} which defines the inputpayload for the EditInspectionAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the EditInspection Success Action with the corresponding actionType and the Payload for that action.
 */
export class EditInspectionSuccessAction implements Action {
  /**
   * Type which defines the actionType for  EditInspectionSuccessAction.
   */
  type = ActionTypes.EDIT_INSPECTION_SUCCESS;
  /**
   * Constructor which defines the payload type for the EditInspectionSuccessAction.
   * @param payload {any} which defines the inputpayload for the EditInspectionSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the EditInspection Failure Action with the corresponding actionType and the Payload for that action.
 */
export class EditInspectionFailureAction implements Action {
  /**
   * Type which defines the actionType for  EditInspectionFailureAction.
   */
  type = ActionTypes.EDIT_INSPECTION_FAILURE;
  /**
   * Constructor which defines the payload type for the EditInspectionFailureAction.
   * @param payload {any} which defines the inputpayload for the EditInspectionFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the DeleteInspection Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteInspectionAction implements Action {
  /**
   * Type which defines the actionType for  DeleteInspectionAction.
   */
  type = ActionTypes.DELETE_INSPECTION;
  /**
   * Constructor which defines the payload type for the DeleteInspectionAction.
   * @param payload {any} which defines the inputpayload for the DeleteInspectionAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the DeleteInspection Success Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteInspectionSuccessAction implements Action {
  /**
   * Type which defines the actionType for  DeleteInspectionSuccessAction.
   */
  type = ActionTypes.DELETE_INSPECTION_SUCCESS;
  /**
   * Constructor which defines the payload type for the DeleteInspectionSuccessAction.
   * @param payload {any} which defines the inputpayload for the DeleteInspectionSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the DeleteInspection Failure Action with the corresponding actionType and the Payload for that action.
 */
export class DeleteInspectionFailureAction implements Action {
  /**
   * Type which defines the actionType for  DeleteInspectionFailureAction.
   */
  type = ActionTypes.DELETE_INSPECTION_FAILURE;
  /**
   * Constructor which defines the payload type for the DeleteInspectionFailureAction.
   * @param payload {any} which defines the inputpayload for the DeleteInspectionFailureAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the ArchiveInspection Action with the corresponding actionType and the Payload for that action.
 */
export class ChangeInspectionStatusAction implements Action {
  /**
   * Type which defines the actionType for  ChangeInspectionStatusAction.
   */
  type = ActionTypes.CHANGE_INSPECTION_STATUS;
  /**
   * Constructor which defines the payload type for the ChangeInspectionStatusAction.
   * @param payload {any} which defines the inputpayload for the ChangeInspectionStatusAction.
   */
  constructor(public payload: number) { }
}
/**
 * Class which defines the ArchiveInspection Success Action with the corresponding actionType and the Payload for that action.
 */
export class ChangeInspectionStatusSuccessAction implements Action {
  /**
   * Type which defines the actionType for  ChangeInspectionStatusSuccessAction.
   */
  type = ActionTypes.CHANGE_INSPECTION_STATUS_SUCCESS;
  /**
   * Constructor which defines the payload type for the ChangeInspectionStatusSuccessAction.
   * @param payload {any} which defines the inputpayload for the ChangeInspectionStatusSuccessAction.
   */
  constructor(public payload: any) { }
}
/**
 * Class which defines the ArchiveInspection Failure Action with the corresponding actionType and the Payload for that action.
 */
export class ChangeInspectionStatusFailureAction implements Action {
  /**
   * Type which defines the actionType for  ChangeInspectionStatusFailureAction.
   */
  type = ActionTypes.CHANGE_INSPECTION_STATUS_FAILURE;
  /**
   * Constructor which defines the payload type for the ChangeInspectionStatusFailureAction.
   * @param payload {any} which defines the inputpayload for the ChangeInspectionStatusFailureAction.
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
  | SelectInspectionAction
  | AddInspectionAction
  | AddInspectionSuccessAction
  | AddInspectionFailureAction
  | AddSectionAction
  | AddSectionSuccessAction
  | AddSectionFailureAction
  | AddInputPropertiesAction
  | AddInputPropertiesSuccessAction
  | AddInputPropertiesFailureAction
  | EditSectionNameAction
  | EditSectionNameSuccessAction
  | EditSectionNameFailureAction
  | DeleteSectionAction
  | DeleteSectionSuccessAction
  | DeleteSectionFailureAction
  | EditInspectionAction
  | EditInspectionSuccessAction
  | EditInspectionFailureAction
  | DeleteInspectionAction
  | DeleteInspectionSuccessAction
  | DeleteInspectionFailureAction
  | ChangeInspectionStatusAction
  | ChangeInspectionStatusSuccessAction
  | ChangeInspectionStatusFailureAction;
