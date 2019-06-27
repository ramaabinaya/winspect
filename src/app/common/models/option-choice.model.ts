// create resources option choices Model which defines the structure of the option choices with the parameters and their types.
/**
 * Class which defines the structure of the option choice with the parameters and their types.
 */
export class OptionChoice {
    /**
     * Variable which is used to define the unique id.
     * @type {number}
     */
    public id: number;
    /**
     * Variable which is used to define the option choice name.
     * @type {string}
     */
    public optionChoiceName: string;
    /**
     * Variable which is used to define the option value.
     * @type {string}
     */
    public optionChoicesValue: string;
    /**
     * Variable which is used to define the date of user modified.
     * @type {date}
     */
    public modified?: Date;
    /**
     * Variable which is used to define the optionGroupId id.
     * @type {number}
     */
    public optionGroupId: number;
    /**
    * Class constructor used to define the default parameters of the create resource class.
    * @param {number} id To define optiongroupid.
    * @param {string} optionChoiceName To define the option choice name.
    * @param {string} optionChoicesValue To define the option choice value.
    * @param {number} optionGroupId To decide whether the resource is exist or not.
    */
    constructor(id: number, optionChoiceName: string, optionChoicesValue: string, optionGroupId: number, modified?: Date) {
        this.id = id;
        this.optionChoiceName = optionChoiceName;
        this.optionChoicesValue = optionChoicesValue;
        this.modified = modified;
        this.optionGroupId = optionGroupId;
    }
}
/**
 * Const variable which is used to define the initial value of the inspection model.
 */
//  export const initialOptionChoices: OptionChoice[] = null;
