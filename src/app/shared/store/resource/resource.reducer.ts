// Reducer function, which is used to do the transformation of states based on the dispatched action's success and failures.
import * as resourceActions from './resource.action';
import * as _ from 'lodash';
import { initialResource, Resource } from '../../../common/models/create-resources-model';
/**
 * Function which has the initial state and do transformations on the state
 * based on each success and failure actions.
 * @param state The State which defines the current state of the inspection details.
 * @param action The action which defines the current dispatched action.
 * @return {Resource[]}
 */
export function ResourceReducer(state = initialResource, action: resourceActions.Actions): Resource[] {
  /**
   * It maps the current triggered action with the corresponding function.
   */
  switch (action.type) {
    /**
     * The case defines the action to be performed on the loadSuccessAction and returns the resulted state of the comments.
     */
    case resourceActions.ActionTypes.LOAD_SUCCESS: {
      const storeAction = <resourceActions.LoadSuccessAction>action;
      return _.cloneDeep(storeAction.payload);
    }
    /**
     * The case defines the action to be performed on the AddResourceSuccessAction
     * and returns the resulted state of the comments.
     */
    case resourceActions.ActionTypes.ADD_RESOURCE_SUCCESS: {
      const storeAction = <resourceActions.AddResourceSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const resource = storeAction.payload;
      resource.optionChoices = [];
      clonedState.push(resource);
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the AddResourceOptionChoiceSuccessAction
     * and returns the resulted state of the comments.
     */
    case resourceActions.ActionTypes.ADD_RESOURCE_OPTION_CHOICE_SUCCESS: {
      const storeAction = <resourceActions.AddResourceOptionChoiceSuccessAction>action;
      const optionChoices = storeAction.payload;
      const clonedState = _.cloneDeep(state);
      clonedState.forEach((item) => {
        if (item && item.id === optionChoices[0].optionGroupId) {
          for (let i = 0; i < optionChoices.length; i++) {
            item.optionChoices.push(_.cloneDeep(optionChoices[i]));
          }
        }
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the AddMoreResourceOptionChoiceAction
     * and returns the resulted state of the comments.
     */
    case resourceActions.ActionTypes.ADD_MORE_RESOURCE_OPTION_CHOICE: {
      const storeAction = <resourceActions.AddMoreResourceOptionChoiceAction>action;
      const optionChoices = storeAction.payload;
      console.log('reducer: ', optionChoices);
      const clonedState = _.cloneDeep(state);
      console.log('cloneState: ', clonedState);
      clonedState.forEach((item) => {
        if (item && item.id === optionChoices[0].optionGroupId) {
          if (item.optionChoices.length === 0) {
            item.optionChoices = optionChoices;
            console.log('not optionchoice: ', clonedState);
          } else {
            console.log('else part');
            for (let i = 0; i < optionChoices.length; i++) {
              // tslint:disable-next-line:max-line-length
              if (!item.optionChoices.find((value) => value.optionChoicesValue === optionChoices[i].optionChoicesValue && value.optionChoiceName === optionChoices[i].optionChoiceName)) {
                item.optionChoices.push(_.cloneDeep(optionChoices[i]));
              }
            }
          }
        }
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the DeleteResourceSuccessAction
     * and returns the resulted state of the comments.
     */
    case resourceActions.ActionTypes.DELETE_RESOURCE: {
      const storeAction = <resourceActions.DeleteResourceSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const optionGroupId = storeAction.payload;
      clonedState.find((item, index) => {
        if (item && item.id === optionGroupId) {
          clonedState.splice(index, 1);
          return true;
        }
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the DeleteResourceOptionChoiceSuccessAction
     * and returns the resulted state of the comments.
     */
    case resourceActions.ActionTypes.DELETE_RESOURCE_OPTION_CHOICE: {
      const storeAction = <resourceActions.DeleteResourceOptionChoiceSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const resourceId = storeAction.payload[1];
      const optionChoiceId = storeAction.payload[0];
      clonedState.find((item) => {
        if (item) {
          if (item && item.id === resourceId) {
            optionChoiceId.find((id) => {
              item.optionChoices.find((value, index) => {
                if (value.id === id) {
                  item.optionChoices.splice(index, 1);
                  return true;
                }
              });
            });
            return true;
          }
        }
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the EditResourceSuccessAction
     * and returns the resulted state of the comments.
     */
    case resourceActions.ActionTypes.EDIT_RESOURCE_SUCCESS: {
      const storeAction = <resourceActions.EditResourceSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const optionGroupValue = storeAction.payload;
      clonedState.find((item) => {
        if (item && item.id === optionGroupValue.id) {
          item.optionGroupName = optionGroupValue.optionGroupName;
          return true;
        }
      });
      return clonedState;
    }
    /**
     * The case defines the action to be performed on the EditResourceOptionChoiceSuccessAction
     * and returns the resulted state of the comments.
     */
    case resourceActions.ActionTypes.EDIT_RESOURCE_OPTION_CHOICE_SUCCESS: {
      const storeAction = <resourceActions.EditResourceOptionChoiceSuccessAction>action;
      const clonedState = _.cloneDeep(state);
      const optionChoices = storeAction.payload;
      clonedState.forEach((item) => {
        if (item) {
          if (item.id === optionChoices[0].optionGroupId) {
            item.optionChoices.forEach((value, index) => {
              for (let i = 0; i < optionChoices.length; i++) {
                if (value.id === optionChoices[i].id) {
                  value.optionChoiceName = optionChoices[i].optionChoiceName;
                  value.optionChoicesValue = optionChoices[i].optionChoicesValue;
                }
              }
            });
          }
        }
      });
      return clonedState;
    }
    case resourceActions.ActionTypes.LOAD_FAILURE:
    /**
     * If the dispatched action doesn't match with any case It return the initial state of that action.
     */
    default: {
      return state;
    }
  }
}
