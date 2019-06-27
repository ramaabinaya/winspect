// Filter Component which is used to do the report related functionalities like filter.
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { SortingService } from '../../../shared/services/sorting.service';
import * as _ from 'lodash';
/**
 * Component which is used to display the filter in web view.
 */
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
// Component which is used for filter the reports table.
export class FilterComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to emit the button clicked to the parant component.
   */
  @Output() filterClosed = new EventEmitter<boolean>();
  /**
   * Variable which is used to define type of filters from the parent component.
   */
  filterDetails;
  /**
   * Variable which is used to define table from the parent component.
   */
  @Input() table;
  /**
   * Variable which is used to define the filtered record to the parent component.
   */
  @Output() tableFiltered = new EventEmitter<Table>();
  /**
   * Variable which is used to define the filtered table.
   */
  filteredTable;
  /**
   * Variable which is used to define the selected value.
   */
  selectedValues = [];
  /**
   * Variable which is used to subscribe and the unsubscribe the observables.
   */
  subscriptionObject = {};
  /**
   * Component constructor used to inject the required services.
   * @param sortService To sortService the archived reports and users.
   */
  constructor(private sortService: SortingService) {
  }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.filteredTable = this.table;
    this.selectedValues = this.sortService.selectedDetails;
    this.filterDetails = this.sortService.filterDetails;
    this.subscriptionObject['filterDetails'] = this.sortService.filterDetailsChanged.subscribe((value) => {
      if (value === true) {
        this.filterDetails = this.sortService.filterDetails;
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to close the filter to the parant component.
   */
  onFilterClosed() {
    this.filterClosed.emit(false);
  }
  /**
   * Method which is used to filter the table.
   * @param selectedColumn Variable which is used to define selected value.
   * @param event event which is used to define the selected filter value.
   */
  onFilter(selectedColumn, event) {
    if (this.filteredTable) {
      let filtername;
      if (event) {
        filtername = event.name ? event.name : event;
        if (filtername) {
          this.filteredTable.filter(filtername, selectedColumn, 'equals');
        }
      } else {
        this.filteredTable.filter(event, selectedColumn, 'equals');
      }
      this.tableFiltered.emit(this.filteredTable);
    }
    this.sortService.selectedDetails = this.selectedValues;
  }
  /**
   * Method which is used to filter the table.
   * @param event event which is used to define the selected filter value.
   * @param selectedColumn Variable which is used to define selected value.
   */
  onSelectRange(event, selectedColumn) {
    const dateRange = event.value;
    if (this.filteredTable) {
      this.filteredTable.filterConstraints['between'] = (value, filter): boolean => {
        let valueUTC: any = Date.parse(value);
        let filterUTC;
        if ((value && value.dueDate !== null && selectedColumn === 'dueDate') || selectedColumn !== 'dueDate') {
          valueUTC = new Date(new Date(valueUTC).toISOString());
          filterUTC = [new Date((filter[0] as Date).toISOString()),
          new Date((filter[1] as Date).toISOString())];
        }
        if (filterUTC && valueUTC) {
          return valueUTC >= filterUTC[0] && valueUTC <= filterUTC[1];
        }
      };
      if (dateRange && dateRange.length > 1 && dateRange[1] !== null) {
        this.filteredTable.filter(dateRange, selectedColumn, 'between');
        this.tableFiltered.emit(this.filteredTable);
      }
    }
    this.sortService.selectedDetails = this.selectedValues;
  }
  /**
   * Method which is used to filter the table.
   * @param selectedColumn Variable which is used to define selected value.
   */
  onSelectToday(selectedColumn) {
    let splittedcol;
    if (selectedColumn.indexOf('.')) {
      splittedcol = selectedColumn.split('.');
    }
    const todate = new Date(new Date().toDateString());
    if (this.filteredTable) {
      this.filteredTable.value.forEach((item) => {
        if (item[selectedColumn]) {
          item[selectedColumn] = new Date(new Date(Date.parse(item[selectedColumn])).toDateString());
        } else if (item && splittedcol && item[splittedcol[0]] && item[splittedcol[0]][splittedcol[1]]) {
          item[splittedcol[0]][splittedcol[1]] = new Date(
            new Date(Date.parse(item[splittedcol[0]][splittedcol[1]])).toDateString());
        }
      });
      this.filteredTable.filter(todate, selectedColumn, 'equals');
      this.tableFiltered.emit(this.filteredTable);
    }
    this.sortService.selectedDetails = this.selectedValues;
  }
  /**
   * Method which is used to filter the table.
   * @param event event which is used to define the selected filter value.
   * @param selectedColumn Variable which is used to define selected value.
   */
  onSelectDate(event, selectedColumn) {
    const todate = new Date(new Date(Date.parse(event.value)).toDateString());
    if (this.filteredTable) {
      const reports = this.filteredTable.value;
      if (reports && reports.length > 0) {
        reports.forEach((item) => {
          item[selectedColumn] = new Date(new Date(Date.parse(item[selectedColumn])).toDateString());
        });
      }
      this.filteredTable.filter(todate, selectedColumn, 'equals');
      this.tableFiltered.emit(this.filteredTable);
    }
    this.sortService.selectedDetails = this.selectedValues;
  }
  /**
   * Method which is used to clear the filtered record.
   * @param event event which is used to define the selected filter value.
   * @param selectedColumn Variable which is used to define selected value.
   */
  onClear(selectedColumn) {
    if (this.filteredTable) {
      this.filteredTable.filter(null, selectedColumn, 'equals');
      this.tableFiltered.emit(this.filteredTable);
    }
    this.sortService.selectedDetails = this.selectedValues;
  }
  /**
   * OnDestroy lifecycle hook.
   * Method which is used to unsubscribe the subscriptions.
   */
  ngOnDestroy() {
    if (this.subscriptionObject) {
      for (const subscriptionProperty in this.subscriptionObject) {
        if (this.subscriptionObject[subscriptionProperty]) {
          this.subscriptionObject[subscriptionProperty].unsubscribe();
        }
      }
    }
  }
}
