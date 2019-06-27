/**
 * Class which defines the structure of the option choice with the parameters and their types.
 */
export class GroupMembers {
    /**
     * Variable which is used to define the unique id.
     * @type {number}
     */
    public id: number;
    /**
     * Variable which is used to define the group id.
     * @type {number}
     */
    public groupId: number;
    /**
     * Variable which is used to define the date of group created.
     * @type {date}
     */
    public created?: Date;
    /**
     * Variable which is used to define the date of user modified.
     * @type {date}
     */
    public modified?: Date;
    /**
     * Variable which is used to define the group member id.
     * @type {number}
     */
    public memberId: number;
    /**
     * Class constructor used to define the default parameters of the create resource class.
     * @param id To define the group member id.
     * @param groupId To define the group id.
     * @param memberId To define the group member id.
     * @param created To define the created date.
     * @param modified To define the modified date.
     */
    constructor(id: number, groupId: number, memberId: number, created?: Date, modified?: Date) {
        this.id = id;
        this.groupId = groupId;
        this.created = created;
        this.modified = modified;
        this.memberId = memberId;
    }
}
/**
 * Variable which is used to define the initial value of the inspection model.
 */
export const initialGroupMembers: GroupMembers[] = null;
