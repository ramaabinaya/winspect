// Service which is used to create custom safetyInspections.
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpRoutingService } from '../../common/services/httpRouting.service';
/**
 * Service which is used to create a custom Inspection with the user provided informations.
 */
@Injectable()
export class DynamicInspectionService {
  /**
   * Service Constructor which is used to inject the required services.
   * @param http To use the HttpRoutingService service for sending http request to the server.
   */
  constructor(private http: HttpRoutingService) { }
  /**
   * Method which is used to add the inspectionHeader in the database.
   * @param name {string} The name of the inspection.
   * @param type {string} The type of the inspection.
   * @param desc {string} The description about the inspection header.
   */
  addInspectionHeader(name: string, type: string, desc: string) {
    const data = { name: name, type: type, desc: desc };
    return this.http.postMethod('addInspection', data);
  }
  /**
   * Method which is used to get all form Input types from the database.
   */
  getFormInputTypes() {
    return this.http.getMethod('getAllInputTypes');
  }
  /**
   * Method which is used to get the input type properties to the selected input type.
   * @param inputTypeId {number} The index of the selected input type.
   */
  getFormInputTypeModelProperties(inputTypeId: number) {
    const data = { inputTypeId: inputTypeId };
    return this.http.postMethod('getInputProperties', data);
  }
  /**
   * Method which is used to add the newly dragged inputtypeproperties to the section.
   * @param properties The properties of the dragged control.
   */
  addInputTypeProperties(properties) {
    const data = { properties: properties };
    return this.http.postMethod('addinputProperties', data);
  }
  /**
   * Method which is used to add the section for the newly created inspectionHeaders.
   * @param section {InspectionSection} The section details to save.
   */
  addInspectionSection(section) {
    const data = { section: section };
    return this.http.postMethod('addInspectionSection', data)
      .pipe(map((res) => {
        return res['inspectionSections'];
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to add the newly dragged questions to the section.
   * @param question The dragged question details.
   */
  addQuestion(question) {
    const data = { question: question };
    return this.http.postMethod('addQuestion', data);
  }
  /**
   * Method which is used to edit the section name of the selected section.
   * @param sectionId {number} The index of the selected section.
   * @param name {string} The name to be changed.
   */
  editSectionName(headerId: number, sectionId: number, name: string) {
    const data = { sectionId: sectionId, editedName: name };
    return this.http.postMethod('editSectionName', data).pipe(map((res) => {
      return [headerId, sectionId, name];
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Methos which is used to get the inspection section details of the selected inspection header.
   * @param headerId {number} The index of the selected Inspection header.
   */
  getSectionDetails(headerId: number, sectionId: number) {
    const data = { headerId: headerId, sectionId: sectionId };
    return this.http.postMethod('getsectiondetails', data);
  }
  /**
   * Method which is used to edit the option details.
   * @param option refers to the option which is dragged.
   */
  updateOptions(option) {
    const data = { options: option };
    return this.http.postMethod('updateoptions', data)
      .pipe(map((res) => {
        return option;
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to edit the option group.
   * @param opGrp defines the option group, which was selected.
   */
  updateOptionGroup(opGrp) {
    const data = { optionGroup: opGrp };
    return this.http.postMethod('updateoptiongroup', data)
      .pipe(map((res) => {
        return opGrp;
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to update input Properties details for given inputProperty id in database.
   * @param property {any} Which is used to define the property details.
   * @param id {number} Which is used to define the inputProperty id.
   */
  updateInputproperties(index, property) {
    const data = { property: property, indices: index };
    return this.http.postMethod('updateproperties', data);
  }
  /**
   * Method which is used to create new option Group details in database.
   * @param optionGroup {any} Which is used to define the optionGroup details.
   */
  createOptionGroup(optionGrp: any) {
    return this.http.postMethod('addOptionGroup', optionGrp)
      .pipe(map((res) => {
        return res['optionGroup'];
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to create new optionchoices details in database.
   * @param optionchoices {any} Which is used to define the optionchoices details.
   */
  addOptionChoices(optionchoices: any) {
    const data = { optionChoices: optionchoices };
    return this.http.postMethod('addOptionChoices', data)
      .pipe(map((res) => {
        return res['optionChoices'];
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
  * Method which is used to create new optionchoices details in database.
  * @param optionchoices {any} Which is used to define the optionchoices details.
  */
  addMoreOptionChoices(options: any) {
    const data = { optionChoices: options };
    return this.http.postMethod('addMoreOptionChoices', data);
  }
  /**
   * Method which is used to delete input property details for given id in database.
   * @param propertyId {number} Which is used to define the inputProperty id.
   */
  deleteInputProperty(indexDetails) {
    const data = { id: indexDetails };
    return this.http.postMethod('deleteproperty', data);
  }
  /**
   * Method which is used to delete option Choices details for given id in database.
   * @param optionId {number} Which is used to define the optionChoice id.
   * @param optionGroupId {number} Which is define resourceId.
   */
  deleteOptionChoices(optionChoiceId: number, optionGroupId?) {
    const data = { id: optionChoiceId, resourceId: optionGroupId };
    return this.http.postMethod('deleteoptionchoices', data)
      .pipe(map((res) => {
        return data;
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to delete option Group details for given id in database.
   * @param groupId {number} Which is used to define the optionGroup id.
   */
  deleteOptionGroup(groupId: number) {
    const data = { id: groupId };
    return this.http.postMethod('deleteoptiongroups', data);
  }
  /**
   * Method which is used to delete the selected section by the indx provided.
   * @param sectionId {number} The index of the section to be deleted.
   */
  deleteSection(sectionId: number) {
    const data = { id: sectionId };
    return this.http.postMethod('deleteSection', data).pipe(map((res) => {
      return [sectionId];
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to edit the inspectionHeader in the database.
   * @param inspection {any} The define the edited inspection details.
   */
  editInspectionHeader(inspection: any) {
    return this.http.postMethod('editInspection', inspection)
      .pipe(map((res) => {
        return inspection;
      }));
  }
  /**
  * Method which is used to delete the selected inspection header by the indx provided.
  * @param headerId {number} The index of the section to be deleted.
  */
  deleteInspection(headerId: number) {
    const data = { id: headerId };
    return this.http.postMethod('deleteInspection', data).pipe(map((res) => {
      return headerId;
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to change the inspection status.
   * @param details The detals which is used to store the inspectionHeaderId and Statucode.
   */
  changeInspectionStatus(details) {
    const data = details;
    return this.http.postMethod('changeInspectionStatus', data).pipe(map((res) => {
      return details;
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
  * Method which is used to display the resource list that are created.
  */
  getResourceList() {
    return this.http.getMethod('getResourceList')
      .pipe(map((res) => {
        return res['resourcelist'];
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to check whether the template name already used or not.
   * @param templateName {string} The name of the template to check.
   */
  checkTemplateName(templateName: string) {
    const data = { templateName: templateName };
    return this.http.postMethod('checkTemplateName', data);
  }
}
