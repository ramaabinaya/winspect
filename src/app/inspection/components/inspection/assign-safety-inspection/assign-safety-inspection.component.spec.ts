import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSafetyInspectionComponent } from './assign-safety-inspection.component';
import { Component, Input, DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DropdownModule, CalendarModule, DialogModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { InspectionStore } from '../../../../shared/store/inspection/inspection.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { Inspection } from '../../../model/inspection.model';
import { UserStore } from '../../../../user/store/user/user.store';
import { SiteService } from '../../../../common/services/site.service';
import { User } from '../../../../user/model/user.model';
import { RouterTestingModule } from '@angular/router/testing';
import { InspectionService } from '../../../../shared/services/inspection.service';
import { TitleCasePipe } from '@angular/common';
import { OfflineStorageService } from '../../../../common/services/offlineStorage.service';
import { GroupsStore } from '../../../../shared/store/groups/groups.store';
import { Groups } from '../../../../common/models/groups.models';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-top-navbar',
  template: 'app-top-navbar'
})
export class TopNavbarComponent {
  @Input() headerdetails;
  @Input() sortingDetails;
  @Input() selectedValue;
}
export class MockInspectionStore {
  inspections: Observable<Inspection[]> = Observable.of([]);
}
export class MockUserStore {
  users: Observable<any> = Observable.of([
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
export class MockSiteService {
  getAllWindFarms() {
    return Observable.of({});
  }
}
export class MockInspectionService {
  assignInspection() {
    return Observable.of({});
  }
  groupAssignInspection() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
}
export class MockGroupsStore {
  groups: Observable<Groups[]> = Observable.of([]);
}
describe('AssignSafetyInspectionComponent', () => {
  let component: AssignSafetyInspectionComponent;
  let fixture: ComponentFixture<AssignSafetyInspectionComponent>;
  let debugElement: DebugElement;
  // let formBuilder: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DropdownModule,
        CalendarModule,
        DialogModule,
        ConfirmDialogModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [AssignSafetyInspectionComponent,
        TopNavbarComponent],
      providers: [
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: UserStore, useClass: MockUserStore },
        { provide: SiteService, useClass: MockSiteService },
        { provide: InspectionService, useClass: MockInspectionService },
        { provide: TitleCasePipe, useClass: TitleCasePipe },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: GroupsStore, useClass: MockGroupsStore },
        { provide: ConfirmationService, useClass: ConfirmationService },
        // {}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSafetyInspectionComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onUserType', () => {
    component.onUserType();
    expect(component.onUserType).toBeDefined();
  });
  it('should call group of users', () => {
    const userType = 'Group of Users';
    expect(userType).toBeDefined();
  });
});
