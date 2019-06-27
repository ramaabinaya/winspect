// Reducer function, which is used to do the transformation of states based on the dispatched action's success and failures.
import * as inspectionActions from './inspection.action';
import * as _ from 'lodash';
import { initialInspectionModel, Inspection } from '../../../inspection/model/inspection.model';
/**
 * Function which has the initial state and do transformations on the state
 * based on each success and failure actions.
 * @param state The State which defines the current state of the inspection details.
 * @param action The action which defines the current dispatched action.
 * @return {Inspection[]}
 */
export function InspectionReducer(state = initialInspectionModel, action: inspectionActions.Actions): Inspection[] {
  switch (action.type) {
    case inspectionActions.ActionTypes.LOAD_SUCCESS: {
      const storeAction = <inspectionActions.LoadSuccessAction>action;
      return _.cloneDeep(storeAction.payload);
    }
    case inspectionActions.ActionTypes.ADD_INSPECTION: {
      const storeAction = <inspectionActions.AddInspectionSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const inspection = storeAction.payload;
      clonedState.push(inspection);
      return clonedState;
    }
    case inspectionActions.ActionTypes.ADD_SECTION_SUCCESS: {
      const storeAction = <inspectionActions.AddSectionSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const section = storeAction.payload;
      clonedState.find((item) => {
        if (item && item.id === section.inspectionHeaderId) {
          if (!item.inspectionSections) {
            item.inspectionSections = [];
          }
          item.inspectionSections.push(section);
          return true;
        }
      });
      return clonedState;
    }
    case inspectionActions.ActionTypes.EDIT_SECTION_NAME_SUCCESS: {
      const storeAction = <inspectionActions.EditSectionNameSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const headerId = storeAction.payload[0];
      const sectionId = storeAction.payload[1];
      const name = storeAction.payload[2];
      clonedState.find((inspection) => {
        if (inspection && inspection.id === headerId && inspection.inspectionSections) {
          inspection.inspectionSections.find((item) => {
            if (item && item.id === sectionId) {
              item.sectionName = name;
              return true;
            }
          });
          return true;
        }
      });
      return clonedState;
    }
    case inspectionActions.ActionTypes.DELETE_SECTION_SUCCESS: {
      const storeAction = <inspectionActions.DeleteSectionSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const sectionId = storeAction.payload;
      clonedState.filter((inspection) => {
        if (inspection && inspection.inspectionSections) {
          inspection.inspectionSections.find((section, id) => {
            if (section.id === sectionId) {
              inspection.inspectionSections.splice(id, 1);
              return true;
            }
          });
        }
      });
      return clonedState;
    }
    case inspectionActions.ActionTypes.EDIT_INSPECTION_SUCCESS: {
      const storeAction = <inspectionActions.EditInspectionSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const inspectionHeader = storeAction.payload;
      clonedState.find((inspection) => {
        if (inspection && inspectionHeader && inspection.id === inspectionHeader.id) {
          inspection.name = inspectionHeader.name;
          inspection.instructions = inspectionHeader.desc;
          inspection.inspectionReportType = inspectionHeader.type;
          return true;
        }
      });
      return clonedState;
    }
    case inspectionActions.ActionTypes.DELETE_INSPECTION_SUCCESS: {
      const storeAction = <inspectionActions.DeleteInspectionSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const inspectionHeaderId = storeAction.payload;
      return clonedState.filter((inspection) => inspection.id !== inspectionHeaderId);
    }
    case inspectionActions.ActionTypes.CHANGE_INSPECTION_STATUS: {
      const storeAction = <inspectionActions.ChangeInspectionStatusSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const data = storeAction.payload;
      clonedState.filter((item) => {
        if (item.id === data.inspectionHeaderId) {
          item.isActive = data.isActive;
          item.modified = new Date(Date.now()).toISOString();
        }
      });
      return clonedState;
    }
    case inspectionActions.ActionTypes.LOAD_FAILURE: {
      return [];
    }
    default: {
      return state;
    }
  }
}

