// Reducer function, which is used to do the transformation of states based on the dispatched action's success and failures.
import * as reportActions from './report.action';
import * as _ from 'lodash';
import { AssignInspectionUsers, initialAssignInspectionUsers } from '../../../inspection/model/assignInspectionUsers.model';
/**
 * Function which has the initial state and do transformations on the state
 * based on each success and failure actions.
 * @param state The State which defines the current state of the inspection details.
 * @param action The action which defines the current dispatched action.
 * @return {AssignInspectionUsers[]}
 */
export function ReportReducer(state = initialAssignInspectionUsers, action: reportActions.Actions): AssignInspectionUsers[] {
  /**
   * It maps the current triggered action with the corresponding function.
   */
  switch (action.type) {
    /**
     * The case defines the action to be performed on the loadSuccessAction and returns the resulted state of the report.
     */
    case reportActions.ActionTypes.LOAD_SUCCESS: {
      const storeAction = <reportActions.LoadSuccessAction>action;
      return _.cloneDeep(storeAction.payload);
    }
    /**
     * The case defines the action to be performed on the changeReportStatusSuccessAction
     * and returns the resulted state of the report.
     */
    case reportActions.ActionTypes.CHANGE_REPORT_STATUS_SUCCESS: {
      const storeAction = <reportActions.ChangeReportStatusSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const data = storeAction.payload[0];
      clonedState.find((item) => {
        if (item && item.report && item.report.id === data.reportId) {
          item.report.active = data.active;
          item.report.modified = new Date(Date.now()).toISOString();
          return true;
        }
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the deleteReportSuccessAction
     * and returns the resulted state of the report.
     */
    case reportActions.ActionTypes.DELETE_REPORT_SUCCESS: {
      const storeAction = <reportActions.DeleteReportSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const assignedInspectionId = storeAction.payload;
      clonedState.find((item, index) => {
        if (item && item.id === assignedInspectionId) {
          clonedState.splice(index, 1);
          return true;
        }
      });
      return clonedState;
    }
    /**
    * The case defines the action to be performed on the ChangeAssignedInspectionStatusSuccessAction
    * and returns the resulted state of the report.
    */
    case reportActions.ActionTypes.CHANGE_ASSIGNED_INSPECTION_SUCCESS: {
      const storeAction = <reportActions.ChangeAssignedInspectionStatusSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const reportId = storeAction.payload[0];
      const assigneInspectionUser = storeAction.payload[1];
      clonedState.find((item) => {
        if (item && item.report && item.report.id === reportId && assigneInspectionUser) {
          item.inspectionStatusId = assigneInspectionUser.inspectionStatusId;
          item.inspectionStatus = assigneInspectionUser.inspectionStatus;
          item.modified = assigneInspectionUser.modified;
          return true;
        }
      });
      return clonedState;
    }
    /**
    * The case defines the action to be performed on the changeDueDateSuccessAction
    * and returns the resulted state of the report.
    */
    case reportActions.ActionTypes.CHANGE_DUE_DATE_SUCCESS: {
      const storeAction = <reportActions.ChangeDuedateSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      if (storeAction.payload) {
        const reportId = storeAction.payload.reportId;
        const toDate = storeAction.payload.dueDate;
        clonedState.find((item) => {
          if (item && item.id === reportId) {
            item.dueDate = toDate;
            return true;
          }
        });
      }
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the CreateReportAction
     * and returns the resulted state of the report.
     */
    case reportActions.ActionTypes.CREATE_REPORT: {
      const storeAction = <reportActions.CreateReportAction>action;
      const clonedState = _.cloneDeep(state);
      const assignedInspectionUserId = storeAction.payload[0];
      const statusId = storeAction.payload[1];
      const report = storeAction.payload[2];
      clonedState.find((item) => {
        if (item && item.id === assignedInspectionUserId) {
          item.inspectionStatusId = statusId;
          item.inspectionStatus.name = 'In progress';
          item.report = report;
          return true;
        }
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the reAssignInspectionStatusSuccessAction
     * and returns the resulted state of the report.
     */
    case reportActions.ActionTypes.REASSIGN_INSPECTION_SUCCESS: {
      const storeAction = <reportActions.ReassignInspectionSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      if (storeAction.payload) {
        const inspectionId = storeAction.payload.inspectionId;
        const technicianId = storeAction.payload.technicianId;
        clonedState.find((item) => {
          if (item && item.id === inspectionId) {
            item.userId = technicianId;
            return true;
          }
        });
      }
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the CreateNewAssignInspectionAction
     * and returns the resulted state of the report.
     */
    case reportActions.ActionTypes.CREATE_NEW_ASSIGN_INSPECTION: {
      const storeAction = <reportActions.CreateNewAssignInspectionAction>action;
      const clonedState = _.cloneDeep(state);
      const inspection = storeAction.payload;

      inspection.inspectionStatus = { name: 'Assigned' };
      clonedState.push(inspection);
      return clonedState;
    }
    case reportActions.ActionTypes.CREATE_NEW_GROUP_ASSIGNMENT: {
      const storeAction = <reportActions.CreateNewGroupAssignment>action;
      const clonedState = _.cloneDeep(state);
      const inspection = storeAction.payload;
      inspection.forEach((grpInspection) => {
        grpInspection.inspectionStatus = { name: 'Assigned' };
        clonedState.push(grpInspection);
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the changeAllReportStatusSuccessAction
     * and returns the resulted state of the report.
     */
    case reportActions.ActionTypes.CHANGE_ALL_REPORT_STATUS_SUCCESS: {
      const storeAction = <reportActions.ChangeAllReportStatusSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const reportId = storeAction.payload;
      clonedState.forEach((item) => {
        if (item && item.report && item.report.active === 0) {
          reportId.find((value) => {
            if (value === item.report.id) {
              item.report.active = 1;
              return true;
            }
          });
        }
      });
      return clonedState;
    }
    /**
     * If the dispatched action doesn't match with any case It return the initial state of that action.
     */
    case reportActions.ActionTypes.LOAD_FAILURE:
      {
        return [];
      }
    case reportActions.ActionTypes.CHANGE_ASSIGNED_INSPECTION_FAILURE:
    case reportActions.ActionTypes.CHANGE_REPORT_STATUS_FAILURE:
    case reportActions.ActionTypes.DELETE_REPORT_FAILURE:
    case reportActions.ActionTypes.CHANGE_DUE_DATE_FAILURE:
    case reportActions.ActionTypes.REASSIGN_INSPECTION_FAILURE:
    default: {
      return state;
    }
  }
}

