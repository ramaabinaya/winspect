import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechAssignedInspectionComponent } from './tech-assigned-inspection.component';
import { Component, Input, DebugElement } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HighlightSearch } from '../../pipe/highlight.pipe';
import { CalendarModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { SiteService } from '../../../common/services/site.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStore } from '../../../user/store/user/user.store';
import { SortingService } from '../../../shared/services/sorting.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
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
export class MockDatePipe {
  transform() {
    return Observable.of({});
  }
}
export class MockInspectionStore {
  inspections: Observable<any[]> = Observable.of([
    {
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
    }
  ]);
}
export class MockSiteService {
  getAllWindFarms() {
    return Observable.of({
      windFarms: [{
        active: 1,
        country: 'Barnstable County',
        created: '2018-05-14T20:42:18.000Z',
        customerId: 1,
        id: 7,
        modified: '2018-05-14T20:42:18.000Z',
        name: 'AFCEE MMR Turbines',
        state: 'MA'
      }]
    });
  }
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
  },
  {
    attachments: null,
    comments: null,
    created: '2018-07-20T08:56:07.000Z',
    dueDate: null,
    groupId: 0,
    id: 538,
    inspectionHeaderId: 3,
    inspectionStatus: {
      name: 'In progress'
    },
    inspectionStatusId: 2,
    modified: '2018-07-27T11:45:22.000Z',
    report: null,
    userId: 3,
    windMillFormId: 17
  }
  ]);
  deleteReport() {
    return Observable.of({});
  }
  reAssignInspection() {
    return Observable.of({});
  }
  changeAssignedInspectionDueDate() {
    return Observable.of({});
  }
}
export class MockUserStore {
  users: Observable<any[]> = Observable.of([
    {
      active: 1,
      clientId: null,
      created: '2018-05-14T19:52:54.000Z',
      customerId: 1,
      email: 'amaldev@hotmail.com',
      firstName: 'Amal',
      id: 1,
      lastName: 'DevA',
      modified: '2018-11-20T04:08:17.000Z',
      password: '',
      resetPasswordExpires: null,
      resetPasswordToken: null,
      userRole: { name: 'Technician' },
      userRoleId: 1
    }
  ]);
}
export class MockSortingService {
  selectedDetails = [];
  sortReport() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getAssignInspectionUsers() {
    return Observable.of({});
  }
  createTables() {
    return Observable.of({});
  }
}
describe('TechAssignedInspectionComponent', () => {
  let component: TechAssignedInspectionComponent;
  let fixture: ComponentFixture<TechAssignedInspectionComponent>;
  let debugElement: DebugElement;
  let reportstore: ReportStore;
  let reportstorespy;
  let reportstorespy1;
  let reportstorespy2;
  let sortservice: SortingService;
  let sortservicespy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TableModule,
        CalendarModule,
        FormsModule,
        DropdownModule,
        RouterTestingModule,
        NgbModalModule
      ],
      declarations: [TechAssignedInspectionComponent,
        FilterComponent,
        TopNavbarComponent,
        HighlightSearch],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: DatePipe, useClass: MockDatePipe },
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: SiteService, useClass: MockSiteService },
        { provide: ReportStore, useClass: MockReportStore },
        { provide: TitleCasePipe, useClass: TitleCasePipe },
        { provide: UserStore, useClass: MockUserStore },
        { provide: SortingService, useClass: MockSortingService },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        NgbModal
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechAssignedInspectionComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.mobileView = true;
    reportstore = debugElement.injector.get(ReportStore);
    reportstorespy = spyOn(reportstore, 'deleteReport').and.callThrough();
    reportstorespy1 = spyOn(reportstore, 'reAssignInspection').and.callThrough();
    reportstorespy2 = spyOn(reportstore, 'changeAssignedInspectionDueDate').and.callThrough();
    sortservice = debugElement.injector.get(SortingService);
    sortservicespy = spyOn(sortservice, 'sortReport').and.callThrough();
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
  // it('should call open modal for cancel', () => {
  //   const cancel = {};
  //   component.openCancelModal(cancel);
  //   expect(component.openCancelModal).toBeDefined();
  // });
  it('should call  openModal for dueDateChange', () => {
    const dueDateChange = {};
    component.openModal(dueDateChange);
    expect(component.openModal).toBeDefined();
  });
  it('should call open modal for reAssign', () => {
    const reAssign = {};
    component.openModal(reAssign);
    expect(component.openModal).toBeDefined();
  });
  it('should call onDelete', () => {
    const id = 3;
    component.onDelete(id);
    expect(reportstorespy).toBeDefined();
  });
  it('should call onReassign', () => {
    const inspectionId = 871;
    const technicianName = 'Amal Deva';
    component.technicians = [{
      id: 1,
      label: 'Amal Deva',
      value: 'Amal Deva'
    }];
    component.selectedTechnician = technicianName;
    // component= 688;
    component.onReassign(inspectionId);
    expect(reportstorespy1).toBeDefined();
  });
  it('should call onChangeDate', () => {
    const id = 4;
    component.onChangeDate(id);
    expect(reportstorespy2).toBeDefined();
  });
  it('should call sortReport', () => {
    const key = 'InspectionName';
    component.sortReport(key);
    expect(sortservicespy).toBeDefined();
  });
  it('should call onClear', () => {
    component.onClear();
    expect(component.onClear).toBeDefined();
  });
  it('should call userSelected', () => {
    component.searchValue(event);
    expect(component.searchValue).toBeDefined();
  });
  it('should call onSelected', () => {
    const id = 2;
    component.onSelected(id);
    expect(component.onSelected).toBeDefined();
  });
  it('should call filterGlobal', () => {

    component.filterGlobal(event);
    expect(component.filterGlobal).toBeDefined();
  });


});
