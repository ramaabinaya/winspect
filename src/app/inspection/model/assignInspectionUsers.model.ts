// AsssignInspectionModel which defines the structure of the assignInspection with the
// parameters and their types.
import { Report } from './report.model';
import { InspectionStatus } from './inspectionstatus.model';
/**
 * Class which defines the structure of the assignInspection with the parametersand their types.
 */
export class AssignInspectionUsers {
  /**
   * id which is used to defines the index of the assignInspectionUsers.
   * @type {number}
   */
  public id?: number;
  /**
   * userId which is used to define the index of the user to whom the inspctionassigned.
   * @type {number}
   */
  public userId: number;
  /**
   * inspectionHeaderId is used to define the index of the inspection which is assigned to the user.
   * @type {number}
   */
  public inspectionHeaderId: number;
  /**
   * inspectionStatusId which defines the index of the inspectionStatus(assigned,inprogress,completed).
   * @type {number}
   */
  public inspectionStatusId: number;
  /**
   * attachments which defines the files attached while the assigning Inspection.
   * @type {string}
   */
  public attachments?: String;
  /**
   * dueDate which is used to define the dueDate for the safety inspection process.
   * @type {Date}
   */
  public dueDate?: Date;
  /**
   * windMillFormId is used to defines the index of the windFarm that assigned to the technician.
   * @type {number}
   */
  public windMillFormId?: number;
  /**
   * comments is used to define the comments provided while assigning the inspection.
   * @type {string}
   */
  public comments?: string;
  /**
   * created which defines the created date of the assignInspection.
   * @type {Date}
   */
  public created?: Date;
  /**
   * modified which defines the modified date of the assignInspection.
   * @type {Date}
   */
  public modified?: Date;
  /**
   * inspectionStatus which defines the InspectionStatus of the assignInspection.
   * @type {InspectionStatus}
   */
  public inspectionStatus?: InspectionStatus;
  /**
   * report which defines the report created on the assignInspection.
   * @type {Report}
   */
  public report?: Report;
  // public notifications?: NotificationComments[];

  /**
   * Constructor which is used to initialise the class with the initialvalues.
   * @param userId {number} The index of the user to whomthe inspection assigned.
   * @param inspectionHeaderID {number} The index of the inspectionHeader which is assigned.
   * @param inspectionStatusID {number} The index of the InspectionStstus.
   * @param dueDate {Date} The dueDate for the report creation.
   * @param windMillFormId {number} The index of the WindFarm which is assigned.
   * @param comments {strine} The comment provided for reportcreation in inspection assignment.
   * @param attachments {string} The filename of the attached file.
   */
  constructor(userId: number, inspectionHeaderID: number, inspectionStatusID: number, dueDate?: Date,
  windMillFormId?: number, comments?: string, attachments?: string, notification?: any[]) {
    this.userId = userId;
    this.inspectionHeaderId = inspectionHeaderID;
    this.inspectionStatusId = inspectionStatusID;
    this.dueDate = dueDate;
    this.windMillFormId = windMillFormId;
    this.comments = comments;
    this.attachments = attachments;
    // this.notifications = notification;
  }
}
/**
 * constant which initialise the assignInspectionUsers and export that.
 */
export const initialAssignInspectionUsers: AssignInspectionUsers[] = null;
