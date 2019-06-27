import { Injectable, EventEmitter } from '@angular/core';
import { HttpRoutingService } from './httpRouting.service';

/**
 * Class which is used to get dynamic form details from the database.
 */
@Injectable()
export class DynamicFormGroupService {
  /**
   * Variable which is used to emit the value when section save button triggered.
   * @type {any}
   */
  sectionSaveTriggered = new EventEmitter<any>();

  /**
   * Serive constructor which defines the needed services to inject here.
   * @param http To get the HttpRoutingService service.
   */
  constructor(private http: HttpRoutingService) { }


  /**
   * Method which is  used to get the form details for the given header name.
   * @param name {string} which is used to define header name.
   */
  getFormDetails(name: string) {
    const data = { headerName: name };
    return this.http.postMethod('getforms', data);
  }

  /**
   * Method which is  used to get the form details for the given header id.
   * @param id {number} which is used to define header id.
   */
  getInspectionDetails(id: number) {
    const data = { headerId: id };
    return this.http.postMethod('getworkflowform', data);
  }

  /**
  * Method which is  used to get the answer list for the given report id.
  * @param id {number} which is used to define reportId.
  */
  getAnswers(id: number) {
    const data = { reportId: id };
    return this.http.postMethod('getanswer', data);
  }

  /**
  * Method which is  used to get the inspectionSections details for the given header name.
  * @param formName {string} which is used to define header name.
  */
  getInspectionSections(formName: string) {
    const data = { formName: formName };
    return this.http.postMethod('getsections', data);
  }

  /**
  * Method which is  used to get the option choice list for the given optionGroupName.
  * @param optionGroupName {string} which is used to define optionGroupName.
  */
  getOptionChoices(optionGroupName: string) {
    const data = { optionGroupName: optionGroupName };
    return this.http.postMethod('getoptionchoices', data);
  }

  /**
  * Method which is  used to get the dynamic field questions list for the given dynamic field id.
  * @param id {number} which is used to define dynamic field id.
  */
  getDynamicFieldQuestion(id: number) {
    const data = { id: id };
    return this.http.postMethod('getDynamicFieldQuestion', data);
  }

  /**
  * Method which is  used to get dynamic field answers list for the given reportId.
  * @param reportId {number} which is used to define reportId.
  */
  getDynamicFieldAnswers(reportId: number) {
    const data = { reportId: reportId };
    return this.http.postMethod('getDynamicFieldAnswers', data);
  }

}
