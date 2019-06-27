import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedReportComponent } from './archived-report.component';
import { Component, Input, DebugElement } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HighlightSearch } from '../../pipe/highlight.pipe';
import { ReportStore } from '../../../shared/store/report/report.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { AssignInspectionUsers } from '../../model/assignInspectionUsers.model';
import { RouterTestingModule } from '@angular/router/testing';
import { SiteService } from '../../../common/services/site.service';
import { UserStore } from '../../../user/store/user/user.store';
import { User } from '../../../user/model/user.model';
import { MockAuthService } from '../report-template/report-template.component.spec';
import { AuthService } from '../../../auth/services/auth.service';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { Inspection } from '../../model/inspection.model';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgbModalBackdrop } from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';
import { componentFactoryName } from '@angular/compiler';


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
export class MockReportStr {
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
  changeReportStatusAll() {
    return Observable.of({});
  }
  deleteReport() {
    return Observable.of({});
  }
  changeReportStatus() {
    return Observable.of({});
  }
}
export class MockSiteService {
  getAllWindFarms() {
    return Observable.of({});
    // return Observable.of([{
    //   active: 1,
    //   country: "Barnstable County",
    //   created: "2018-05-14T20:42:18.000Z",
    //   customerId: 1,
    //   id: 7,
    //   modified: "2018-05-14T20:42:18.000Z",
    //   name: "AFCEE MMR Turbines",
    //   state: "MA"
    // }]);
  }
}
export class MockUserStore {
  users: Observable<User[]> = Observable.of([]);
}
export class MockAuthSer {
  getUser() {
    return Observable.of({});
  }
}
export class MockInspectionStore {
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
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
}
export class MockSortingService {
  selectedDetails = [];
  sortReport() {
    return Observable.of({});
  }
}
// export class MockNgbModal {
//   open() {}
// }

describe('ArchivedReportComponent', () => {
  let component: ArchivedReportComponent;
  let fixture: ComponentFixture<ArchivedReportComponent>;
  let debugElement: DebugElement;
  let reportstore: ReportStore;
  let reportstorespy;
  let reportstorespy1;
  let reportstorespy2;
  let sortservice: SortingService;
  let sortservicespy;
  // let modalservice: NgbModal;
  // let modalservicespy;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        TableModule,
        RouterTestingModule,
        NgbModalModule
      ],
      declarations: [ArchivedReportComponent,
        FilterComponent,
        TopNavbarComponent,
        HighlightSearch],
      providers: [
        { provide: ReportStore, useClass: MockReportStr },
        { provide: SiteService, useClass: MockSiteService },
        { provide: UserStore, useClass: MockUserStore },
        { provide: AuthService, useClass: MockAuthSer },
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: SortingService, useClass: MockSortingService },
        NgbModal
      ]
    })
      .compileComponents();
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [NgbModal]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedReportComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    reportstore = debugElement.injector.get(ReportStore);
    reportstorespy = spyOn(reportstore, 'changeReportStatusAll').and.callThrough();
    reportstorespy1 = spyOn(reportstore, 'deleteReport').and.callThrough();
    reportstorespy2 = spyOn(reportstore, 'changeReportStatus').and.callThrough();
    sortservice = debugElement.injector.get(SortingService);
    sortservicespy = spyOn(sortservice, 'sortReport').and.callThrough();
    component.reportData['windFarmsList'] = [{ id: 7, label: 'AFCEE MMR Turbines', value: 'AFCEE MMR Turbines' }];
    component.archivedReports = [
      {
        attachments: '',
        comments: null,
        id: 906,
        inspectionHeaderId: 38,
        inspectionStatus: {
          id: 2,
          name: 'In progress'
        },
        inspectionStatusId: 2,
        report: {
          active: 0,
          assignedInspectionUserId: 906,
          bladeType: 'M',
          id: 718,
          modified: new Date(Date.now()),
          name: 'Report 906',
          windturbineId: 28049,
          reportNumber: 3
        },
        userId: 3,
        windMillFormId: 19
      }
    ];
    // modalservice = debugElement.injector.get(NgbModal);
    // modalservicespy = spyOn(modalservice, 'open').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onshow', () => {
    component.onFilterShow();
    expect(component.onFilterShow).toBeDefined();
  });
  it('should call getFilteredTable', () => {
    component.getFilteredTable(event);
    expect(component.getFilteredTable).toBeDefined();
  });
  it('should call navigateBack', () => {
    component.navigateBack();
    expect(component.navigateBack).toBeDefined();
  });
  it('should call open modal for undo', () => {
    const undo = {};
    component.openConfirmationDialog(undo);
    expect(component.openConfirmationDialog).toBeDefined();
  });
  it('should call open modal for undoAll', () => {
    const undoAll = {};
    component.openRestoreAllDialog(undoAll);
    expect(component.openRestoreAllDialog).toBeDefined();
  });
  it('should call restorestatus', () => {
    component.archivedReports = [{
      attachments: null,
      comments: null,
      dueDate: null,
      id: 751,
      inspectionHeaderId: 3,
      inspectionStatus: {
        name: 'In progress',
        id: 2
      },
      inspectionStatusId: 2,
      report: {
        active: 0,
        assignedInspectionUserId: 751,
        bladeType: 'C',
        id: 573,
        name: 'Report 751',
        windturbineId: 2515,
        reportNumber: 3
      },
      userId: 96,
      windMillFormId: 31
    }];
    component.restorestatus();
    expect(reportstorespy).toBeDefined();
  });
  xit('should call onDeleteClicked', () => {
    const assignInspecUserId = 1;
    component.onDeleteClicked(assignInspecUserId, event);
    expect(reportstorespy1).toBeDefined();
  });
  xit('should call onRestoreClicked', () => {
    const index = 1;
    component.onRestoreClicked(index, event);
    expect(reportstorespy2).toBeDefined();
  });
  it('should call onNavigate', () => {
    const index = 1;
    component.onNavigate(index);
    expect(component.onNavigate).toBeDefined();
  });
  it('should call sortReport', () => {
    component.archivedReports = [{
      attachments: null,
      comments: null,
      dueDate: null,
      id: 751,
      inspectionHeaderId: 3,
      inspectionStatus: {
        name: 'In progress',
        id: 1
      },
      inspectionStatusId: 2,
      report: {
        active: 0,
        assignedInspectionUserId: 751,
        bladeType: 'C',
        id: 573,
        name: 'Report 751',
        windturbineId: 2515,
        reportNumber: 3
      },
      userId: 96,
      windMillFormId: 31
    }];
    const key = 'InspectionName';
    component.sortReport(key);
    expect(sortservicespy).toBeDefined();
  });
  it('should call onSearchBoxClear', () => {
    component.onSearchBoxClear();
    expect(component.onSearchBoxClear).toBeDefined();
  });
  it('should call userSelected', () => {
    component.searchValue(event);
    component.archivedReports = [
      {
        attachments: '',
        comments: null,
        id: 906,
        inspectionHeaderId: 38,
        inspectionStatus: {
          name: 'In progress',
          id: 2
        },
        inspectionStatusId: 2,
        report: {
          active: 0,
          assignedInspectionUserId: 906,
          bladeType: 'M',
          id: 718,
          modified: new Date(Date.now()),
          name: 'Report 906',
          windturbineId: 28049,
          reportNumber: 3
        },
        userId: 3,
        windMillFormId: 19
      }
    ];
    expect(component.searchValue).toBeDefined();
  });
  it('should call onReportGlobalSearch', () => {
    component.onReportGlobalSearch(event);
    expect(component.onReportGlobalSearch).toBeDefined();
  });
});
