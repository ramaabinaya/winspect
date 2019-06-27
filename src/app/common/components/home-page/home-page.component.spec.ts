import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionModule, CalendarModule } from 'primeng/primeng';
import { HomePageComponent } from './home-page.component';
import { FilterComponent } from '../filter/filter.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { UserStore } from '../../../user/store/user/user.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../../user/model/user.model';
import { ReportStore } from '../../../shared/store/report/report.store';
import { AssignInspectionUsers } from '../../../inspection/model/assignInspectionUsers.model';
import { SiteService } from '../../services/site.service';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { Inspection } from '../../../inspection/model/inspection.model';
import { SortingService } from '../../../shared/services/sorting.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientService } from '../../../client/services/client.service';

class MockAuthService {
  getUser() {}

}
class MockUserStore {
  users: Observable<any[]> = Observable.of([
    {
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
      userRole: { name: "Technician" },
      userRoleId: 1
    }
  ]);
}
class MockReportStore {
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
      name: "In progress"
    },
    inspectionStatusId: 2,
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
    siteName: "Adams",
    userId: 3,
    userName: "Notus Technician3",
    windMillFormId: 19
}]);
}
class MockSiteService {
  getAllWindFarms() {
    return Observable.of({});
  }
}
class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getAssignInspectionUsers() {}
  getReportsByInspectionId() {}
}
class MockInspectionStore {
  inspections: Observable<any[]> = Observable.of([
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
}
class MockSortingService {
  selectedDetails = Observable.of([]);
}
class MockClientService {
  getClientDetails() {}
}
describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TableModule,
        AccordionModule,
        DropdownModule,
        FormsModule,
        CalendarModule,
        RouterTestingModule
      ],
      declarations: [ HomePageComponent,
        FilterComponent],
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: UserStore, useClass: MockUserStore},
          { provide: ReportStore, useClass: MockReportStore},
          { provide: SiteService, useClass: MockSiteService},
          { provide: OfflineStorageService, useClass: MockOfflineStorageService},
          { provide: InspectionStore, useClass: MockInspectionStore},
          { provide: SortingService, useClass: MockSortingService},
          { provide: ClientService, useClass: MockClientService}
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call sortByDate', () => {
component.sortByDate();
component.assignInspectionUsers = [
  {attachments: "",
  comments: null,
  created: "2018-12-11T10:52:48.000Z",
  dueDate: "2018-12-13T00:00:00.000Z",
  groupId: 0,
  id: 906,
  inspectionHeaderId: 38,
  inspectionName: "signature",
  inspectionStatus: {
    name: "In progress"
  },
  inspectionStatusId: 2,
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
  siteName: "Adams",
  userId: 3,
  userName: "Notus Technician3",
  windMillFormId: 19
}]
expect(component.sortByDate).toBeDefined();
  });
  // it('should call mapSiteName', () => {
  //   component.mapSiteName();
  //   expect(component.mapSiteName).toBeDefined();
  // });
  it('should call getFilteredTable', () => {
    component.getFilteredTable(event);
    expect(component.getFilteredTable).toBeDefined();
  })
});
