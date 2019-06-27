import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInspectionComponent } from './edit-inspection.component';
import { Component, Input, DebugElement } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { ReportStore } from '../../../shared/store/report/report.store';

@Component({
  selector: 'app-filter',
  template: 'app-filter'
})
export class FilterComponent {
  @Input() filterDetails;
  @Input() table;
}
export class MockOfflineStorageService {
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getAssignInspectionUsers() {
    return Observable.of({});
  }
  getReportsByInspectionId() {
    return Observable.of({});
  }
  changeAssignedInspectionStatus() {
    return Observable.of({});
  }
}
export class MockAuthService {
  getUser() {
    return Observable.of({
      clientId: null,
      customerId: 1,
      email: 'technician2@example.com',
      firstName: 'Notus',
      id: 3,
      lastName: 'Technician3',
      role: 'Technician',
      userRoleId: 1
    });
  }
}
export class MockSortingService {
  selectedDetails = [];
}
export class MockReportStore {
  assignInspectionUsers: Observable<any[]> = Observable.of([{
    attachments: '',
    comments: null,
    created: '2018-12-11T10:52:48.000Z',
    dueDate: '2018-12-13T00:00:00.000Z',
    groupId: 0,
    id: 906,
    inspectionHeaderId: 38,
    inspectionName: 'signature',
    inspectionStatus: {
      name: 'Assigned'
    },
    inspectionStatusId: 2,
    modified: '2018-12-11T12:58:11.000Z',
    name: 'Notus Technician3',
    report: {
      active: 1,
      assignedInspectionUserId: 906,
      bladeType: 'M',
      created: '2018-12-11T12:58:11.000Z',
      id: 718,
      modified: new Date(Date.now()),
      name: 'Report 906',
      windturbineId: 28049
    },
    siteName: 'Adams',
    userId: 3,
    userName: 'Notus Technician3',
    windMillFormId: 19
  }]);
}
describe('EditInspectionComponent', () => {
  let component: EditInspectionComponent;
  let fixture: ComponentFixture<EditInspectionComponent>;
  let debugElement: DebugElement;
  let offlinservice: OfflineStorageService;
  let offlinservicespy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TableModule,
        RouterTestingModule
      ],
      declarations: [EditInspectionComponent,
        FilterComponent],
      providers: [
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: SortingService, useClass: MockSortingService },
        { provide: ReportStore, useClass: MockReportStore }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInspectionComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    offlinservice = debugElement.injector.get(OfflineStorageService);
    offlinservicespy = spyOn(offlinservice, 'changeAssignedInspectionStatus').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getFilteredTable', () => {
    component.getFilteredTable(event);
    expect(component.getFilteredTable).toBeDefined();
  });
  it('should call sortByDate', () => {
    // component.sortByDate();
    // expect(component.sortByDate).toBeDefined();
    component.inspectionReports = [{
      attachments: '',
      comments: 'fds',
      id: 909,
      inspectionHeaderId: 38,
      inspectionStatus: {
        id: 2,
        name: 'In progress'
      }, userId: 3,
      inspectionStatusId: 2,
      report: {
        active: 1,
        assignedInspectionUserId: 909,
        bladeType: 'M',
        id: 717,
        name: 'Report 909',
        reportNumber: 909,
        windturbineId: 29351
      }
    },
    {
      attachments: '',
      comments: 'cxvbn',
      id: 905,
      inspectionHeaderId: 38,
      inspectionStatus: {
        name: 'In progress',
        id: 2
      }, userId: 3,
      inspectionStatusId: 2,
      report: {
        active: 1,
        assignedInspectionUserId: 905,
        bladeType: 'M',
        id: 714,
        name: 'Report 905',
        reportNumber: 905,
        windturbineId: 18373
      }
    }];
  });
  it('should call selectedReport', () => {
    const reportId = 717;
    const inspectionHeaderId = 38;
    const statusId = 3;
    component.onReportSelectedToEdit(reportId, inspectionHeaderId, statusId);
    expect(component.onReportSelectedToEdit).toBeDefined();
    expect(offlinservicespy).toBeDefined();
  });
  it('should call onInspectionGlobalSearch', () => {
    component.onInspectionGlobalSearch(event);
    component.reportTableRef.filter(event, 'global', 'contains');
    expect(component.onInspectionGlobalSearch).toBeDefined();
  });
});
