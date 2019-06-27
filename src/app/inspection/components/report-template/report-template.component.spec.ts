import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FilterComponent } from '../../../common/components/filter/filter.component';
import { ReportTemplateComponent } from './report-template.component';
import { Input, Component, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DropdownModule, DialogModule } from 'primeng/primeng';
import { HighlightSearch } from '../../pipe/highlight.pipe';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { SiteService } from '../../../common/services/site.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { AssignInspectionUsers } from '../../model/assignInspectionUsers.model';
import { InspectionService } from '../../../shared/services/inspection.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { UserStore } from '../../../user/store/user/user.store';
import { User } from '../../../user/model/user.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// import { HighlightSearch } from '../../pipe/highlight.pipe';
@Component({
  selector: 'app-filter',
  template: 'app-filter'
})
class FilterComponent {
  @Input() filterDetails = [];
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
// @Pipe({
//   name: 'highlight'
// })
// export class HighlightSearch {}
export class MockInspectionStore {
  inspections: Observable<any> = Observable.of([
    {
      created: "2018-05-31T09:20:25.000Z",
      customerId: 1,
      fileAttachment: null,
      id: 2,
      inspectionReportType: "M",
      inspectionSections: [{
        condition: null,
        created: "2018-05-31T10:49:09.000Z",
        id: 2,
        inspectionHeaderId: 2,
        isCommon: 1,
        modified: "2018-05-31T10:49:09.000Z",
        sectionDesc: null,
        sectionName: "Observation Details",
        sectionState: null,
        showNext: 1,
        showPrev: 0
      }],
      instructions: "",
      isActive: 1,
      isCustom: 1,
      isForm: 0,
      modified: "2018-05-31T09:20:25.000Z",
      name: "Notus Safety Inspection"
    }
  ]);
  deleteInspection() {
    return Observable.of([]);
  }
  changeInspectionStatus() {
    return Observable.of({});
  }
}
export class MockSiteService {
  getAllWindFarms() {
    return Observable.of({
      windFarms: [{
        active: 1,
        country: "Barnstable County",
        created: "2018-05-14T20:42:18.000Z",
        customerId: 1,
        id: 19,
        modified: "2018-05-14T20:42:18.000Z",
        name: "AFCEE MMR Turbines",
        state: "MA"
      }]
    });
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(true);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getWindFarmsList() {
    return Observable.of({});
  }
  getInspectionFormDetails() {
    return Observable.of({});
  }
  getCustomerDetails() {
    return Observable.of({});
  }
  assignInspection() {
    return Observable.of({});
  }
  createTables() {
    return Observable.of({});
  }
}
export class MockAuthService {
  getUser() {
    return Observable.of({
      clientId: null,
      customerId: 1,
      email: "email@example.com",
      firstName: "john",
      id: 8,
      lastName: "skirivin",
      role: "Admin",
      userRoleId: 2
    });
  }
}
export class MockReportStore {
  createNewAssignInspection() {
    return Observable.of({});
  }
  assignInspectionUsers: Observable<any[]> = Observable.of([{
    attachments: "",
    comments: null,
    created: "2018-12-11T10:52:48.000Z",
    dueDate: "2018-12-13T00:00:00.000Z",
    groupId: 0,
    id: 906,
    inspectionHeaderId: 38,
    inspectionName: "signature",
    inspectionStatus: {
      name: "Completed"
    },
    inspectionStatusId: 3,
    modified: "2018-12-11T12:58:11.000Z",
    name: "Notus Technician3",
    report: {
      active: 0,
      assignedInspectionUserId: 906,
      bladeType: "M",
      created: "2018-12-11T12:58:11.000Z",
      id: 718,
      modified: new Date(Date.now()),
      name: "Report 906",
      windturbineId: 28049
    },
    siteName: "AFCEE MMR Turbines",
    userId: 3,
    userName: "Notus Technician3",
    windMillFormId: 19
  }]);
}
export class MockInspectionService {
  getCustomerDetails() {
    return Observable.of({
      customerdetails: [{
        active: 1,
        created: "2018-05-14T19:39:23.000Z",
        id: 1,
        modified: "2018-05-14T19:39:23.000Z",
        name: "Notus Access Group"
      }]
    });
  }
  assignInspection() {
    return Observable.of({
      assignedInspection: {
        attachments: null,
        comments: null,
        created: "2019-01-03T05:35:11.552Z",
        dueDate: null,
        groupId: 0,
        id: 958,
        inspectionHeaderId: 2,
        inspectionStatus: {
          name: "Assigned"
        },
        inspectionStatusId: 1,
        modified: "2019-01-03T05:35:11.552Z",
        userId: 3,
        windMillFormId: 17
      }
    });
  }
}
export class MockSortingService {
  selectedDetails = [];
  sortReport() {
    return Observable.of({});
  }
}
export class MockUserStore {
  users: Observable<any[]> = Observable.of([{
    active: 1,
    clientId: null,
    created: "2018-05-14T19:52:54.000Z",
    customerId: 1,
    email: "amaldev@hotmail.com",
    firstName: "Amal",
    id: 1,
    lastName: "DevA",
    modified: "2018-11-20T04:08:17.000Z",
    password: "",
    resetPasswordExpires: null,
    resetPasswordToken: null,
    status: 1,
    userRole: { name: "Technician" },
    userRoleId: 1
  }]);
}
describe('ReportTemplateComponent', () => {
  let component: ReportTemplateComponent;
  let fixture: ComponentFixture<ReportTemplateComponent>;
  let debugElement: DebugElement;
  let inspectionservice: InspectionService;
  let inspectionservicespy;
  let reportstore: ReportStore;
  let reportstorespy;
  let inspectionstore: InspectionStore;
  let inspectionstorespy;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TableModule,
        FormsModule,
        DropdownModule,
        DialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgbModalModule

      ],
      declarations: [ReportTemplateComponent,
        FilterComponent,
        TopNavbarComponent,
        HighlightSearch],
      providers: [
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: SiteService, useClass: MockSiteService },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ReportStore, useClass: MockReportStore },
        { provide: InspectionService, useClass: MockInspectionService },
        { provide: SortingService, useClass: MockSortingService },
        { provide: UserStore, useClass: MockUserStore },
        { provide: FormBuilder, useValue: formBuilder },
        NgbModal
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTemplateComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    inspectionservice = debugElement.injector.get(InspectionService);
    inspectionservicespy = spyOn(inspectionservice, 'assignInspection').and.callThrough();
    reportstore = debugElement.injector.get(ReportStore);
    reportstorespy = spyOn(reportstore, 'assignInspectionUsers').and.callThrough();
    component.bulkassignForm = formBuilder.group({
      'template': null,
      'location': null
    })
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onNavigate', () => {
    component.onNavigate();
    expect(component.onNavigate).toBeDefined();
  });
  it('should call onTemplateSelected', () => {
    const inspectionId = 2;
    component.onTemplateSelected(inspectionId);
    expect(component.onTemplateSelected).toBeDefined();
  });
  it('should call onInspectionSelected', () => {
    const inspectionId = 2;
    component.onInspectionSelected(inspectionId);
    expect(component.onInspectionSelected).toBeDefined();
  });
  it('should call filterGlobal', () => {
    component.filterGlobal(event);
    expect(component.filterGlobal).toBeDefined();
    component.inspectionTemplateRef.filter(event, 'global', 'contains');
  });
  it('should call getFilteredTable', () => {
    component.getFilteredTable(event);
    expect(component.getFilteredTable).toBeDefined();
    component.inspectionTemplateRef = event;
  });
  it('should call assignTemplate', () => {
    component.assignTemplate();
    expect(component.assignTemplate).toBeDefined();
    const assignedInspection = {
      attachments: null,
      comments: null,
      created: "2019-01-03T08:54:09.533Z",
      dueDate: null,
      groupId: 0,
      id: 959,
      inspectionHeaderId: 2,
      inspectionStatus:
        { name: "Assigned" },
      inspectionStatusId: 1,
      modified: "2019-01-03T08:54:09.533Z",
      userId: 3,
      windMillFormId: 14
    }
    expect(inspectionservicespy).toHaveBeenCalled();
  });
  it('should call sortReport', () => {
    const key = 'InspectionName';
    component.sortReport(key);
    expect(component.sortReport).toBeDefined();
  });
  it('should call onClear', () => {
    component.onClear();
    expect(component.onClear).toBeDefined();
  });
  it('should call userSelected', () => {
    component.userSelected(event);
    expect(component.userSelected).toBeDefined();
    component.archivedInspection = [{
      created: "2018-07-26T05:01:26.000Z",
      customerId: 1,
      fileAttachment: null,
      id: 7,
      inspectionReportType: "M",
      inspectionSections: {
        condition: null,
        created: "2018-12-12T09:01:56.000Z",
        id: 38,
        inspectionHeaderId: 7,
        isCommon: 0,
        modified: "2018-12-12T09:01:56.000Z",
        sectionDesc: "",
        sectionName: "Section1",
        sectionState: null,
        showNext: null,
        showPrev: null
      },
      instructions: "Assd",
      isActive: 0,
      isCustom: 1,
      isForm: 0,
      modified: "2018-07-26T05:01:26.000Z",
      name: "Asdf",
      ownername: "Notus Access Group"
    }]
    component.filteredRecord = component.archivedInspection;
  });
  it('should call createsqlitedb', () => {
    component.createsqlitedb();
    expect(component.createsqlitedb).toBeDefined();
  });
  it('should call onDeleteSelected', () => {
    const inspectionHeaderId = 2;
    component.onDeleteSelected(event, inspectionHeaderId);
    expect(component.onDeleteSelected).toBeDefined();
    expect(reportstorespy).toBeDefined();
  });
  it('should call open modal for openRestoreModal', () => {
    let onUndoTemplate;
    component.openRestoreModal(onUndoTemplate);
    expect(component.openRestoreModal).toBeDefined();
  });
  it('should call onArchivedTemplate', () => {
    component.onArchivedTemplate();
    expect(component.onArchivedTemplate).toBeDefined();
    component.filteredRecord = component.inspections;
  });
  it('should call onDelete', () => {
    component.onDelete();
    expect(component.onDelete).toBeDefined();
  });
  it('should call onArchive', () => {
    component.onArchive();
    expect(component.onArchive).toBeDefined();
  });
  it('should call onRestoreTemplate', () => {
    const inspectionHeaderId = 1;
    component.onRestoreTemplate(event, inspectionHeaderId);
    expect(component.onRestoreTemplate).toBeDefined();
  });
  it('should call allTemplate', () => {
    component.allTemplate();
    expect(component.allTemplate).toBeDefined();
  });
  it('should call archivedTemplate', () => {
    component.archivedTemplate();
    expect(component.archivedTemplate).toBeDefined();
  });
  it('should call openAssignModal', () => {
    let bulkAssign;
    const inspectionId = 2;
    // component.bulkassignForm.setValue({
    //   'template': 'Notus Safety Inspection',
    //   'location': 'AFCEE MMR Turbines'
    // });
    component.openAssignModal(event, bulkAssign, inspectionId);
    expect(component.openAssignModal).toBeDefined();
  });
  it('should call onAssignBulk', () => {
    const userId = 1;
    component.bulkassignForm.setValue({
      'template': 'Notus Safety Inspection',
      'location': 'AFCEE MMR Turbines'
    });
    component.onAssignBulk(userId);
    expect(component.onAssignBulk).toBeDefined();
  });
  it('should call onAssignBulk-else', () => {
    const userId = 1;
    component.bulkassignForm.setValue({
      'template': null,
      'location': null
    });
    component.onAssignBulk(userId);
    expect(component.onAssignBulk).toBeDefined();
  });
  it('should call bulkAssignReset', () => {
    component.bulkAssignReset();
    expect(component.bulkAssignReset).toBeDefined();
  });
  it('should call onChangeTemplate', () => {
    const template = 'Notus Safety Inspection';
    component.inspectionTemplate = [{
      reated: "2018-05-31T09:20:25.000Z",
      customerId: 1,
      fileAttachment: null,
      id: 2,
      inspectionReportType: "M",
      inspectionSections: {
        condition: null,
        created: "2018-05-31T10:49:09.000Z",
        id: 2,
        inspectionHeaderId: 2,
        isCommon: 1,
        modified: "2018-05-31T10:49:09.000Z",
        sectionDesc: null,
        sectionName: "Observation Details",
        sectionState: null,
        showNext: 1,
        showPrev: 0
      },
      instructions: "",
      isActive: 1,
      isCustom: 1,
      isForm: 0,
      modified: "2018-05-31T09:20:25.000Z",
      name: "Notus Safety Inspection"
    }]
    component.onChangeTemplate(template);
    expect(component.onChangeTemplate).toBeDefined();
  });



});
