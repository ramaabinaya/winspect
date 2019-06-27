// inspectionModel which defines the structure of the assignInspection with the parametersand their types.
/**
 * Class which defines the structure of the inspectionSEction with the parameters and their types.
 */
export class InspectionSection {
  /**
   * Id, is the index of the inspectionSection.
   * @type {number}
   */
  public id: number;
  /**
   * isCommon, which is used to denote whether the section have common fields or not.
   * @type {number}
   */
  public isCommon: number;
  /**
   * inspectionHeaderId, is used to define the id of the inspectionHeader to which the inspection is belongs to.
   */
  public inspectionHeaderId: number;
  /**
   * sectionName, is the name of the inspection section.
   * @type {string}
   */
  public sectionName: string;
  /**
   * sectionDesc, is the instructions about the section.
   * @type {string}
   */
  public sectionDesc: string;
  /**
   * created, is the created date of the inspectionstatus.
   * @type {Date}
   */
  public created?: Date;
  /**
   * modified,is the Date which the inspectionstatus lat modeified.
   * @type {Date}
   */
  public modified?: Date;
  /**
   * Class constructor which is used to inialise the class with the provided values.
   * @param id {number} The index of the inspectionStatus.
   * @param sectionName {string} The sectionName of the inspectionSection.
   * @param inspectionHeaderId {number} The index of the inspectionHeader it belongs to.
   * @param isCommon {number} It denotes whether the section is the common field section or not.
   */
  constructor(inspectionHeaderId: number, sectionName: string, sectionDesc: string, isCommon: number) {
    this.inspectionHeaderId = inspectionHeaderId;
    this.sectionName = sectionName;
    this.sectionDesc = sectionDesc;
    this.isCommon = isCommon;
  }
}
