// inspectionModel which defines the structure of the assignInspection with the parametersand their types.
import { InspectionSection } from './inspectionSection.model';
/**
 * Class which is used to define the inspection properties
 */
export class Inspection {
    /**
     * Variable which is used to define the inspection header id.
     * @type {number}
     */
    public id: number;
    /**
     * Variable which is used to define the customer id.
     * @type {number}
     */
    public customerId: number;
    /**
     * Variable which is used to define the inspection header name.
     * @type {string}
     */
    public name: string;
    /**
     * Variable which is used to define the instructions for inspection header.
     * @type {string}
     */
    public instructions: string;
    /**
     * Variable which is used to decide the report creation form or not.
     * @type {number}
     */
    public isForm: number;
    /**
     * Variable which is used to define the attachment file uri.
     * @type {string}
     */
    public fileAttachment?: string;
    /**
     * Variable which is used to define the inspection report type.
     * @type {string}
     */
    public inspectionReportType: string;
    /**
     * Variable which is used to define the inspection created date.
     * @type {date}
     */
    public created?: any;
    /**
     * Variable which is used to define the inspection modified date.
     * @type {date}
     */
    public modified?: any;
    /**
     * Variable which is used to define the sections of the inspections.
     * @type {InspectionSection[]}
     */
    public inspectionSections: InspectionSection[];
    /**
     * Variable which is used to check whether the inspection is active or not.
     * @type {number}
     */
    public isActive: number;
    public isCustom: number;
    /**
     * Class constructor used to define the default parameters of the inspection class.
     * @param {number} id To define inspection header id.
     * @param {number} customerId To define the customer id.
     * @param {string} name To define the inspection name.
     * @param {string} instructions To define the inspection instructions.
     * @param {number} isForm To decide the report creation form or not.
     * @param {string} inspectionReportType To define the report type.
     * @param {string} fileAttachment To define the file uri.
     * @param {any} sections To define the sections belongs to the inspection.
     */
    // tslint:disable-next-line:max-line-length
    constructor({ id, customerId, name, instructions, isForm, inspectionReportType, inspectionSections, fileAttachment, isCustom }: { id: number; customerId: number; name: string; instructions: string; isForm: number; inspectionReportType: string; inspectionSections: any; fileAttachment?: string; isCustom: number; }) {
        this.id = id;
        this.customerId = customerId;
        this.name = name;
        this.instructions = instructions;
        this.isForm = isForm;
        this.fileAttachment = fileAttachment;
        this.inspectionReportType = inspectionReportType;
        this.inspectionSections = inspectionSections;
        this.isCustom = isCustom;
    }
}
/**
 * Const variable which is used to define the initial value of the inspection model.
 */
export const initialInspectionModel: Inspection[] = null;
