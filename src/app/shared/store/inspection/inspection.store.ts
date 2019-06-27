// InspectionStore is used to store the inspection details locally.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as inspectionActions from './inspection.action';
import { Inspection } from '../../../inspection/model/inspection.model';
/**
 * Class which is used to store the inspection details locally in the application.
 */
@Injectable()
export class InspectionStore {
  /**
   * Variable which is used to define the inspection details.
   * @type {Observable<Inspection[]>}
   */
  inspections: Observable<Inspection[]>;
  /**
   * Class constructor to inject the required services.
   * @param store To define the store.
   */
  constructor(private store: Store<any>) {
    this.inspections = this.store.select(s => s.SharedModule.Inspection);
  }
  /**
   * Method which is used to dispatch the action for load inspections.
   * @return {void}
   */
  load() {
    this.store.dispatch({ type: inspectionActions.ActionTypes.LOAD });
  }
  /**
   * Method which is used to dispatch the action for add inspectionSections.
   * @param section The section details to save.
   */
  addInspectionSection(section) {
    this.store.dispatch({ type: inspectionActions.ActionTypes.ADD_SECTION, payload: section });
  }
  /**
   * Method which is used to dispatch the action for deleting the inspectionSection.
   * @param sectionId  {number} The index of the selected section.
   */
  deleteInspectionSection(sectionId: number) {
    this.store.dispatch({ type: inspectionActions.ActionTypes.DELETE_SECTION, payload: sectionId });
  }
  /**
   * Method which is used to dispatch the action for editing the section name of the selected section.
   * @param sectionId {number} The index of the selected section.
   * @param name {string} The name to be changed.
   */
  editSectionName(headerId: number, sectionId: number, name: string) {
    const temp = [];
    temp.push(headerId);
    temp.push(sectionId);
    temp.push(name);
    this.store.dispatch({ type: inspectionActions.ActionTypes.EDIT_SECTION_NAME, payload: temp });
  }
  /**
   * Method which is used to add the inspectionHeader in the database.
   * @param name {string} The name of the inspection.
   * @param type {string} The type of the inspection.
   * @param desc {string} The description about the inspection header.
   */
  addInspectionHeader(inspection) {
    this.store.dispatch({ type: inspectionActions.ActionTypes.ADD_INSPECTION, payload: inspection });
  }
  /**
   * Method which is used to add the newly dragged inputtypeproperties to the section.
   * @param properties The properties of the dragged control.
   */
  addInputTypeProperties(properties) {
    this.store.dispatch({ type: inspectionActions.ActionTypes.ADD_INPUT_PROPERTIES, payload: properties });
  }
  /**
   * Method which is used to edit the inspectionHeader in the database.
   * @param inspectionHeaderId {number} To define the inspection header id.
   * @param name {string} The name of the inspection.
   * @param type {string} The type of the inspection.
   * @param desc {string} The description about the inspection header.
   */
  editInspectionHeader(inspectionHeaderId: number, name: string, type: string, desc: string) {
    const inspection = {
      id: inspectionHeaderId,
      name: name,
      type: type,
      desc: desc,
    };
    this.store.dispatch({ type: inspectionActions.ActionTypes.EDIT_INSPECTION, payload: inspection });
  }
  /**
   * Method which is used to delete the inspectionHeader in the database.
   * @param inspectionHeaderId {number} To define the inspection header id.
   */
  deleteInspection(inspectionHeaderId) {
    this.store.dispatch({ type: inspectionActions.ActionTypes.DELETE_INSPECTION, payload: inspectionHeaderId });
  }
  /**
   * Method which is used to archive the inspectionHeader in the database.
   * @param inspectionHeaderId {number} To define the inspection header id.
   */
  changeInspectionStatus(inspectionHeaderId: number, status: number) {
    const temp = {
      inspectionHeaderId: inspectionHeaderId,
      isActive: status
    };
    this.store.dispatch({ type: inspectionActions.ActionTypes.CHANGE_INSPECTION_STATUS, payload: temp });
  }
}
