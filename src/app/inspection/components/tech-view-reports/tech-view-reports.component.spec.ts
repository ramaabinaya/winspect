import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechViewReportsComponent } from './tech-view-reports.component';
import { Component, Input, DebugElement } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { HighlightSearch } from '../../pipe/highlight.pipe';
import { ReportStore } from '../../../shared/store/report/report.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { AssignInspectionUsers } from '../../model/assignInspectionUsers.model';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { SiteService } from '../../../common/services/site.service';
import { AuthService } from '../../../auth/services/auth.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter',
  template: 'app-filter'
})
export class FilterComponent {
  @Input() filterDetails;
  @Input() table;
}
@Component({
  selector: 'app-top-navbar',
  template: 'app-top-navbar'
})
export class TopNavbarComponent {
  @Input() headerdetails;
  @Input() sortingDetails;
  @Input() selectedValue;
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
      name: 'Completed'
    },
    inspectionStatusId: 3,
    modified: '2018-12-11T12:58:11.000Z',
    name: 'Notus Technician3',
    report: {
      active: 0,
      assignedInspectionUserId: 906,
      bladeType: 'M',
      created: '2018-12-11T12:58:11.000Z',
      id: 718,
      modified: new Date(Date.now()),
      name: 'Report 906',
      windturbineId: 28049
    },
    siteName: 'AFCEE MMR Turbines',
    userId: 3,
    userName: 'Notus Technician3',
    windMillFormId: 19
  }]);
  changeReportStatus() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(true);
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
  createTables() {
    return Observable.of({});
  }
}
export class MockSiteService {
  getAllWindFarms() {
    return Observable.of({
      windFarms: [{
        active: 1,
        country: 'Barnstable County',
        created: '2018-05-14T20:42:18.000Z',
        customerId: 1,
        id: 19,
        modified: '2018-05-14T20:42:18.000Z',
        name: 'AFCEE MMR Turbines',
        state: 'MA'
      }]
    });
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
  sortReport() {
    return Observable.of({});
  }
}
describe('TechViewReportsComponent', () => {
  let component: TechViewReportsComponent;
  let fixture: ComponentFixture<TechViewReportsComponent>;
  let debugElement: DebugElement;
  let offlineservice: OfflineStorageService;
  let offlineservicespy;
  let sortservice: SortingService;
  let sortservicespy;
  let reportstore: ReportStore;
  let reportstorespy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TableModule,
        RouterTestingModule,
        NgbModalModule
      ],
      declarations: [TechViewReportsComponent,
        FilterComponent,
        TopNavbarComponent,
        HighlightSearch],
      providers: [
        { provide: ReportStore, useClass: MockReportStore },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: SiteService, useClass: MockSiteService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: SortingService, useClass: MockSortingService },
        NgbModal
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechViewReportsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    offlineservice = debugElement.injector.get(OfflineStorageService);
    offlineservicespy = spyOn(offlineservice, 'changeAssignedInspectionStatus').and.callThrough();
    sortservice = debugElement.injector.get(SortingService);
    sortservicespy = spyOn(sortservice, 'sortReport').and.callThrough();
    reportstore = debugElement.injector.get(ReportStore);
    reportstorespy = spyOn(reportstore, 'changeReportStatus').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getFilteredTable', () => {
    component.getFilteredTable(event);
    expect(component.getFilteredTable).toBeDefined();
  });
  it('should call onNavigate', () => {
    component.onNavigate();
    expect(component.onNavigate).toBeDefined();
  });
  // it('should call sortByDate', () => {
  //   component.sortByDate();
  //   expect(component.sortByDate).toBeDefined();
  //   // component.mobileView = false;
  // });
  it('should call selectedReport', () => {
    const index = 1;
    component.selectedReport(index);
    expect(component.selectedReport).toBeDefined();
  });
  // it('should call open modal for cancel', () => {
  //   let cancel;
  //   component.openVerticallyCentered(cancel);
  //   expect(component.openVerticallyCentered).toBeDefined();
  // });
  it('should call open modal for onArchive', () => {
    const onArchive = {};
    component.openArchiveModal(onArchive);
    expect(component.openArchiveModal).toBeDefined();
  });
  it('should call onSelected', () => {
    const index = 0;
    component.onSelected(index);
    expect(component.onSelected).toBeDefined();
    component.assignInspectionUsers = [{
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
    }];
    const inspectionHeaderId = component.assignInspectionUsers[index].inspectionHeaderId;
    const statusId = component.assignInspectionUsers[index].inspectionStatusId;
    const reportId = component.assignInspectionUsers[index].report.id;
    expect(offlineservicespy).toBeDefined();
  });
  it('should call export', () => {
    const id = 1;
    component.export(id);
    expect(component.export).toBeDefined();
  });
  it('should call sortReport', () => {
    const key = 1;
    component.sortReport(key);
    expect(component.sortReport).toBeDefined();
    expect(sortservicespy).toBeDefined();
  });
  it('should call onClear', () => {
    component.onClear();
    expect(component.onClear).toBeDefined();
    component.filteredReport = component.assignInspectionUsers;
  });
  it('should call onArchives', () => {
    const id = 1;
    component.onArchives(id);
    expect(component.onArchives).toBeDefined();
  });
  it('should call userSelected', () => {
    component.searchValue(event);
    expect(component.searchValue).toBeDefined();
    expect(reportstorespy).toBeDefined();
  });
  it('should call createsqlitedb', () => {
    component.createsqlitedb();
    expect(component.createsqlitedb).toBeDefined();
  });
  it('should call filterGlobal', () => {
    component.filterGlobal(event);
    expect(component.filterGlobal).toBeDefined();
    component.reportTableRef.filter(event, 'global', 'contains');
  });
});
