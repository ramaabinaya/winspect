// create resources Model which defines the structure of the option group with the parametersand their types.
import { OptionChoice } from '../../common/models/option-choice.model';
/**
 * Class which defines the structure of the option group with the parameters and their types.
 */
export class Resource {
    public id: number;
    public optionGroupName: string;
    public created?: Date;
    public modified?: Date;
    public isResource: number;
    public optionChoices: OptionChoice[];

    /**
    * Class constructor used to define the default parameters of the create resource class.
    * @param {number} id To define optiongroupid.
    * @param {string} optionGroupName To define the option group name.
    * @param {number} isResource To decide whether the resource is exist or not.
    */
    constructor(id: number, optionGroupName: string, isResource: number, created?: Date, modified?: Date) {
        this.id = id;
        this.optionGroupName = optionGroupName;
        this.created = created;
        this.modified = modified;
        this.isResource = isResource;
    }
}
/**
 * Const variable which is used to define the initial value of the inspection model.
 */
export const initialResource: Resource[] = null;
