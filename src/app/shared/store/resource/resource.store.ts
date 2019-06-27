// InspectionStore is used to store the inspection details locally.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as resourceActions from './resource.action';
import { Resource } from '../../../common/models/create-resources-model';
/**
 * Class which is used to store the resoure details locally in the application.
 */
@Injectable()
export class ResourceStore {
  /**
   * Variable which is used to define the resource details.
   * @type {Observable<Resource[]>}
   */
  resources: Observable<Resource[]>;
  /**
   * Class constructor to inject the required services.
   * @param store To define the store.
   */
  constructor(private store: Store<any>) {
    this.resources = this.store.select(s => s.SharedModule.Resource);
  }
  /**
   * Method which is used to dispatch the action for load inspections.
   * @return {void}
   */
  load() {
    this.store.dispatch({ type: resourceActions.ActionTypes.LOAD });
  }
  /**
   * Method which is used to dispatch the action for create the new OptionGroup.
   * @param optionGroup The optionGroup details to save.
   */
  createOptionGroup(optionGroup) {
    this.store.dispatch({ type: resourceActions.ActionTypes.ADD_RESOURCE, payload: optionGroup });
  }
  /**
   * Method which is used to dispatch the action for create the option choices.
   * @param optionChoices The optionChoices details to save.
   */
  createOptionChoices(optionChoices) {
    this.store.dispatch({ type: resourceActions.ActionTypes.ADD_RESOURCE_OPTION_CHOICE, payload: optionChoices });
  }
  /**
   * Method which is used to dispatch the action for create the option choice using CSV File.
   * @param csvRecordsArray The csvRecordsArray details to save.
   */
  addMoreOptionChoices(csvRecordsArray) {
    this.store.dispatch({ type: resourceActions.ActionTypes.ADD_MORE_RESOURCE_OPTION_CHOICE, payload: csvRecordsArray });
  }
  /**
   * Method which is used to dispatch the action for remove the OptionGroup.
   * @param selectedResourceId {number} The index of the selected OptionGroup.
   */
  deleteOptionGroup(selectedResourceId: number) {
    this.store.dispatch({ type: resourceActions.ActionTypes.DELETE_RESOURCE, payload: selectedResourceId });
  }
  /**
   * Method which is used to dispatch the action for remove the OptionChoices.
   * @param optionId {number} The index of the selected OptionChoice.
   */
  deleteOptionChoices(optionId, optionGroupId) {
    const temp = [];
    temp.push(optionId);
    temp.push(optionGroupId);
    this.store.dispatch({ type: resourceActions.ActionTypes.DELETE_RESOURCE_OPTION_CHOICE, payload: temp });
  }
  /**
   * Method which is used to dispatch the action for editing the OptionGroup details.
   * @param optGrpValue The optGrpValue which is define the edit optGrpValue form details.
   */
  editOptionGroup(optGrpValue) {
    this.store.dispatch({ type: resourceActions.ActionTypes.EDIT_RESOURCE, payload: optGrpValue });
  }
  /**
   * Method which is used to dispatch the action for editing the option choice details.
   * @param choice The choice which is define the edit choice form details.
   */
  editOptionChoices(choice) {
    this.store.dispatch({ type: resourceActions.ActionTypes.EDIT_RESOURCE_OPTION_CHOICE, payload: choice });
  }
}
