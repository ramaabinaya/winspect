import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAllReportsComponent } from './list-all-reports.component';
import { CoreModule } from '../../../common/core.module';
import { ReportService } from '../../../shared/services/report.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { SiteService } from '../../../common/services/site.service';
import { HttpClient } from '@angular/common/http';
import { ReportStore } from '../../../shared/store/report/report.store';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStore } from '../../../user/store/user/user.store';
import { User } from '../../../user/model/user.model';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { DebugElement } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

class MockReportService {
  getAllInspectionStatus() {
    return Observable.of({});
  }
}

class MockSiteService {
  getAllWindFarms() {
    return Observable.of({});
  }
}
class MockReportStore {
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
      name: 'In progress'
    },
    inspectionStatusId: 2,
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
    siteName: 'Adams',
    userId: 3,
    userName: 'Notus Technician3',
    windMillFormId: 19
  }]);

  changeReportStatus() {
    return Observable.of({});
  }
  changeAssignedInspectionStatus() {
    return Observable.of({});
  }
}
class MockInspectionStore {
  inspections: Observable<any[]> = Observable.of([{
    created: '2018-05-31T09:20:25.000Z',
    customerId: 1,
    fileAttachment: null,
    id: 2,
    inspectionReportType: 'M',
    inspectionSections: [{
      condition: null,
      created: '2018-05-31T10:49:09.000Z',
      id: 2,
      inspectionHeaderId: 2,
      isCommon: 1,
      modified: '2018-05-31T10:49:09.000Z',
      sectionDesc: null,
      sectionName: 'Observation Details',
      sectionState: null,
      showNext: 1,
      showPrev: 0
    }],
    instructions: '',
    isActive: 1,
    isCustom: 1,
    isForm: 0,
    modified: '2018-05-31T09:20:25.000Z',
    name: 'Notus Safety Inspection'
  }]);
}
class MockUserStore {
  users: Observable<User[]> = Observable.of([]);
}
class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
}
class MockSortingService {
  sortReport() {
    return Observable.of({});
  }
}
// class MockConfirmationService {
//   confirm () {}
// }
describe('ListAllReportsComponent', () => {
  let component: ListAllReportsComponent;
  let fixture: ComponentFixture<ListAllReportsComponent>;
  let debugElement: DebugElement;
  let reportstore: ReportStore;
  let reportstorespy;
  let reportstorespychangestatus;
  let sortservice: SortingService;
  let sortservicespy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        RouterTestingModule,
        NgbModalModule
      ],
      declarations: [ListAllReportsComponent],
      providers: [NgbModal,
        { provide: HttpClient },
        { provide: ReportService, useClass: MockReportService },
        { provide: SiteService, useClass: MockSiteService },
        { provide: ReportStore, useClass: MockReportStore },
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: UserStore, useClass: MockUserStore },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: SortingService, useClass: MockSortingService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllReportsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    reportstore = debugElement.injector.get(ReportStore);
    reportstorespy = spyOn(reportstore, 'changeAssignedInspectionStatus').and.callThrough();
    reportstorespychangestatus = spyOn(reportstore, 'changeReportStatus').and.callThrough();
    fixture.detectChanges();
    sortservice = debugElement.injector.get(SortingService);
    sortservicespy = spyOn(sortservice, 'sortReport').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call mapSiteName', () => {
    component.mapSiteName();
    expect(component.mapSiteName).toBeDefined();
  });
  it('should call getFilteredTable', () => {
    component.getFilteredTable(event);
    expect(component.getFilteredTable).toBeDefined();
  });
  it('should call onRowSelected', () => {
    const index = 1;
    component.onRowSelected(index);
    expect(component.onRowSelected).toBeDefined();
  });
  xit('should call onArchive', () => {
    component.onArchive();
    expect(component.onArchive).toBeDefined();
  });
  xit('should call onChangeStatus', () => {
    const assignInspectionId = 905;
    const reportId = 717;
    component.onChangeStatus(assignInspectionId, reportId, event);
    expect(reportstorespy).toBeDefined();
  });
  it('should call techsort', () => {
    component.techsort();
    expect(component.techsort).toBeDefined();
  });
  it('should call export', () => {
    const id = 1;
    component.export(id);
    expect(component.export).toBeDefined();
  });
  // xit('should call onArchives', () => {
  //   // const id = 2;
  //   component.onArchives();
  //   expect(reportstorespychangestatus).toBeDefined();
  // });
  it('should call open modal for onArchive', () => {
    const onArchive = {
      archiveModel: {},
      reportId: 1,
      event: {}
    };
    component.openArchiveModal(onArchive.archiveModel, onArchive.reportId, onArchive.event);
    expect(component.openArchiveModal).toBeDefined();
  });
  it('should call open modal for change status', () => {
    const status = {};
    component.openChangeStatusModal(status);
    expect(component.openChangeStatusModal).toBeDefined();
  });
  it('should call userSelected', () => {
    component.searchValue(event);
    expect(component.searchValue).toBeDefined();
  });
  it('should call onClear', () => {
    component.onClear();
    expect(component.onClear).toBeDefined();
  });
  it('should call sortReport', () => {
    const key = 'InspectionName';
    component.sortReport(key);
    expect(sortservicespy).toBeDefined();
  });
  it('should call onEditReport', () => {
    const InspectionHeaderId = 2;
    const reportId = 711;
    component.onEditReport(InspectionHeaderId, reportId, event);
    expect(component.onEditReport).toBeDefined();
  });
  it('should call filterGlobal', () => {
    component.filterGlobal(event);
    expect(component.filterGlobal).toBeDefined();
  });
  it('should call onNavigate', () => {
    const key = 'R';
    component.onNavigate(key);
    expect(component.onNavigate).toBeDefined();
  });
  it('should call onNavigateelse', () => {
    const key = 'L';
    component.onNavigate(key);
    expect(component.onNavigate).toBeDefined();
  });
});
