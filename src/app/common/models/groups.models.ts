// Group Model which defines the structure of the option choices with the parameters and their types.
import { GroupMembers } from './group-members.model';
// Class which defines the structure of the group with the parameters and their types.
export class Groups {
    /**
     * Variable which is used to define the unique id.
     * @type {number}
     */
    public id: number;
    /**
     * Variable which is used to define the group name.
     * @type {string}
     */
    public name: string;
    /**
     * Variable which is used to define the group creatorId.
     * @type {number}
     */
    public creatorId: number;
    /**
     * Variable which is used to define the group description.
     * @type {string}
     */
    public description?: string;
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
     * Variable which is used to define the members of the group.
     * @type {GroupMembers[]}
     */
    public groupMembers: GroupMembers[];
    /**
     * Class constructor used to define the default parameters of the group class.
     * @param id To define group unique id.
     * @param name To define the group name.
     * @param creatorId To define group creator id.
     * @param description To define the group description.
     * @param created To define the group created date.
     * @param modified To define the group modified date.
     */
    constructor(id: number, name: string, creatorId: number, description?: string, created?: Date, modified?: Date) {
        this.id = id;
        this.name = name;
        this.creatorId = creatorId;
        this.description = description;
        this.created = created;
        this.modified = modified;
    }
}
/**
 * Variable which is used to define the initial value of the inspection model.
 */
export const initialGroups: Groups[] = null;
