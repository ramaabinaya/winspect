// inspectionModel which defines the structure of the assignInspection with the parametersand their types.
/**
 * Class which defines the structure of the inspection with the parametersand their types.
 */
export class InspectionStatus {
  /**
   * Id, is the index of the inspectionStatus.
   * @type {number}
   */
  public id: number;
  /**
   * name, is the StatusName of the inspection.
   * @type {string}
   */
  public name: string;
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
   * @param name {string} The statusName of the inspectionStatus.
   */
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
