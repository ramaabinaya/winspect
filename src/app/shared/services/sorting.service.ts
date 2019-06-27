// SortingService which is used to do the report related functionalities like sorting in ascending order.
import { Injectable, EventEmitter } from '@angular/core';
/**
 * Service which is used to do the report related functionalities like sorting in ascending order.
 */
@Injectable()
export class SortingService {
    /**
     * Variable which is used to store the field values while sorting.
     */
    selectedDetails = [];
    /**
     * Variable which is used to store the type of filters and related details.
     */
    filterDetails = [];
    /**
     * Variable which is used to emit the event to the child component.
     */
    filterDetailsChanged = new EventEmitter<boolean>();
    /**
     * Method wich is used to sorting the reports.
     * @param report Variable which is used to refer the array, on which the array to be sorted.
     * @param key  Variable which is used to select the sorting column of the table.
     */
    sortReport(report: any, key: string) {
        if (report && report.length > 0) {
            report.sort(function (a, b) {
                if (key === 'InspectionName') {
                    if (a.inspectionHeader && b.inspectionHeader && a.inspectionHeader.name && b.inspectionHeader.name) {
                        const value = (a.inspectionHeader.name).localeCompare(b.inspectionHeader.name);
                        return value;
                    } else if (a.inspectionHeader.name) {
                        return -1;
                    } else if (b.inspectionHeader.name) {
                        return 1;
                    }
                } else if (key === 'UserName') {
                    if (a.user && b.user && a.user.name && b.user.name) {
                        const value = (a.user.name).localeCompare(b.user.name);
                        return value;
                    } else if (a.user.name) {
                        return -1;
                    } else if (b.user.name) {
                        return 1;
                    }
                } else if (key === 'ClientName') {
                    if (a.windfarm && b.windfarm && a.windfarm.name && b.windfarm.name) {
                        const value = (a.windfarm.name).localeCompare(b.windfarm.name);
                        return value;
                    } else if (a.windfarm.name) {
                        return -1;
                    } else if (b.windfarm.name) {
                        return 1;
                    }
                } else if (key === 'ReportId') {
                    if (a.report && b.report) {
                        const value = +(a.report.id) - +(b.report.id);
                        return value;
                    } else if (a.report) {
                        return -1;
                    } else if (b.report) {
                        return 1;
                    }
                } else if (key === 'CreatedDate') {
                    if (a.created && b.created) {
                        const value = +new Date(b.created) - +new Date(a.created);
                        return value;
                    } else if (a.created) {
                        return -1;
                    } else if (b.created) {
                        return 1;
                    }
                } else if (key === 'ModifiedDate') {
                    if (a.modified && b.modified) {
                        const value = +new Date(b.modified) - +new Date(a.modified);
                        return value;
                    } else if (a.modified) {
                        return -1;
                    } else if (b.modified) {
                        return 1;
                    }
                } else if (key === 'ReportCreatedDate') {
                    if (a.report && b.report) {
                        const value = +new Date(b.report.created) - +new Date(a.report.created);
                        return value;
                    } else if (a.report) {
                        return -1;
                    } else if (b.report) {
                        return 1;
                    }
                } else if (key === 'ReportModifiedDate') {
                    if (a.report && b.report) {
                        const value = +new Date(b.report.modified) - +new Date(a.report.modified);
                        return value;
                    } else if (a.report) {
                        return -1;
                    } else if (b.report) {
                        return 1;
                    }
                } else if (key === 'DueDate') {
                    if (a.dueDate && b.dueDate) {
                        const value = +new Date(a.dueDate) - +new Date(b.dueDate);
                        return value;
                    } else if (a.dueDate) {
                        return -1;
                    } else if (b.dueDate) {
                        return 1;
                    }
                } else if (key === 'UserId') {
                    if (a.userId && b.userId) {
                        const value = (a.userId).localeCompare(b.userId);
                        return value;
                    } else if (a.userId) {
                        return -1;
                    } else if (b.userId) {
                        return 1;
                    }
                } else if (key === 'Email') {
                    if (a.email && b.email) {
                        const value = (a.email).localeCompare(b.email);
                        return value;
                    } else if (a.email) {
                        return -1;
                    } else if (b.email) {
                        return 1;
                    }
                } else if (key === 'UserRoleName') {
                    if (a.userRole && b.userRole) {
                        const value = (a.userRole.name).localeCompare(b.userRole.name);
                        return value;
                    } else if (a.userRole) {
                        return -1;
                    } else if (b.userRole) {
                        return 1;
                    }
                } else if (key === 'ReportName') {
                    if (a.report && b.report) {
                        const value = +(a.report.name).substring(7) - +(b.report.name).substring(7);
                        return value;
                    } else if (a.report) {
                        return -1;
                    } else if (b.report) {
                        return 1;
                    }
                } else if (key === 'TemplateName') {
                    if (a.name && b.name) {
                        const value = (a.name).localeCompare(b.name);
                        return value;
                    } else if (a.name) {
                        return -1;
                    } else if (b.name) {
                        return 1;
                    }
                } else if (key === 'Name') {
                    if (a.name && b.name) {
                        const value = (a.name).localeCompare(b.name);
                        return value;
                    } else if (a.name) {
                        return -1;
                    } else if (b.name) {
                        return 1;
                    }
                } else if (key === 'optionGroupName') {
                    if (a.optionGroupName && b.optionGroupName) {
                        const value = (a.optionGroupName).localeCompare(b.optionGroupName);
                        return value;
                    } else if (a.optionGroupName) {
                        return -1;
                    } else if (b.optionGroupName) {
                        return 1;
                    }
                }
            });
        }
    }
}
