
/**
 * Class which is used to define the report properties.
 */
export class Report {
  /**
   * Variable which is used to define the report id.
   * @type {number}
   */
  public id: number;
  /**
   * Variable which is used to define the assignedInspectionUser id.
   * @type {number}
   */
  public assignedInspectionUserId: number;
  /**
   * Variable which is used to define the selected blade type.
   * @type {string}
   */
  public bladeType: string;
  /**
   * Variable which is used to define the status of the report.
   * @type {number}
   */
  public active: number;
  /**
   * Variable which is used to define the report name.
   * @type {string}
   */
  public name: string;
  /**
   * Variable which is used to define wind turbine id for which report has been created.
   * @type {number}
   */
  public windturbineId: number;
  /**
   * Variable which is used to define the report created date.
   * @type {Date}
   */
  public created?: any;
  /**
   * Variable which is used to define the report modified date.
   * @type {Date}
   */
  public modified?: any;
  /**
 * Variable which is used to define the report number only for sorting.
 * @type {number}
 */
  reportNumber: number;
  /**
   * Class constructor used to define the default parameters of the report class.
   * @param {number} id To define the report id.
   * @param {number} assignedInspectionUserId To define the assignedInspectionUserId.
   * @param {string} bladeType To define the blade type.
   * @param {number} active To define the status of the report.
   * @param {string} name To define the report name.
   * @param {number} windturbineId To define the windturbine id.
   */
  constructor(id: number, assignedInspectionUserId: number, bladeType: string, active: number, name: string,
    windturbineId: number) {
    this.id = id;
    this.assignedInspectionUserId = assignedInspectionUserId;
    this.bladeType = bladeType;
    this.active = active;
    this.name = name;
    this.windturbineId = windturbineId;
  }
}
