import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Component, DebugElement } from '../../../../../node_modules/@angular/core';
import { RouterTestingModule } from '../../../../../node_modules/@angular/router/testing';
import { DialogModule } from '../../../../../node_modules/primeng/dialog';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpClientModule } from '../../../../../node_modules/@angular/common/http';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { SQLite } from '../../../../../node_modules/@ionic-native/sqlite';
import { Network } from '../../../../../node_modules/@ionic-native/network';
import { HeaderService } from '../../services/header.service';
import { UserStore } from '../../../user/store/user/user.store';
import { Observable } from '../../../../../node_modules/rxjs';
import { ReportStore } from '../../../shared/store/report/report.store';
import { ReportService } from '../../../shared/services/report.service';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { InspectionService } from '../../../shared/services/inspection.service';
import { GroupsStore } from '../../../shared/store/groups/groups.store';
import { Mock } from 'protractor/built/driverProviders';
import { ResourceStore } from '../../../shared/store/resource/resource.store';
@Component({
  selector: 'app-nav-bar',
  template: '<div>app-nav-bar</div>'
})
export class NavBarComponent {

}
class MockUserStore {
  load() {}
  // users: Observable<any> = Observable.of({});
}
class MockReportStore {
  load() {}
  // users: Observable<any> = Observable.of({});
}
class MockInspectionStore {
  load() {}
  // users: Observable<any> = Observable.of({});
}
// export class RouterStub {
//   navigateByUrl(url: string) {
//     return url;
//   }
// }
class MockGroupStore {
load() {}
}

class MockResourceStore {
  load() {}
}
class MockAuthService {
  getUser() {
    return Observable.of({});
  }
  getToken() {
    return Observable.of({});
  }
  signinUser() {
    return Observable.of({});
  }
}
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let authservice: AuthService;
  let authservicespy;
  let userstore: UserStore;
  let userstorespy;
  let reportstore: ReportStore;
  let reportstorespy;
  let inspectionstore: InspectionStore;
  let inspectionstorespy;
  let groupstore: GroupsStore;
  let groupstorespy;
  let resourcestore: ResourceStore;
  let resourcestorespy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, NavBarComponent],
      imports: [
        RouterTestingModule,
        DialogModule,
        HttpClientModule
      ],
      providers: [
        OfflineStorageService,
        SQLite,
        Network,
        HeaderService,
        InspectionService,
        ReportService,
        { provide: UserStore, useClass: MockUserStore },
        { provide: ReportStore, useClass: MockReportStore },
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: GroupsStore, useClass: MockGroupStore },
        { provide: ResourceStore, useClass: MockResourceStore },
        { provide: AuthService, useClass: MockAuthService }
        // { provide: Router, useClass: RouterStub},
      ]
    })

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    authservice = debugElement.injector.get(AuthService);
    authservicespy = spyOn(authservice, 'signinUser').and.callThrough();
    userstore = debugElement.injector.get(UserStore);
    userstorespy = spyOn(userstore, 'load').and.callThrough();
    reportstore = debugElement.injector.get(ReportStore);
    reportstorespy = spyOn(reportstore,'load').and.callThrough();
    inspectionstore = debugElement.injector.get(InspectionStore);
    inspectionstorespy = spyOn(inspectionstore,'load').and.callThrough();
    groupstore = debugElement.injector.get(GroupsStore);
    groupstorespy = spyOn(groupstore, 'load').and.callThrough();
    resourcestore = debugElement.injector.get(ResourceStore);
    resourcestorespy = spyOn(resourcestore, 'load').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    
  });
  it('should call Login', () => {
    const email = "email@example.com";
    const password = '2134@ds';
    component.onLogin(email,password);
    expect(authservicespy).toHaveBeenCalled();
  });
  it('should load stores', () => {
    expect(userstorespy).toBeTruthy();
    expect(reportstorespy).toBeTruthy();
    expect(inspectionstorespy).toBeTruthy();
    expect(groupstorespy).toBeTruthy();
    expect(resourcestorespy).toBeTruthy();
  });
});
