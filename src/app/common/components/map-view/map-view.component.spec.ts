import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewComponent } from './map-view.component';
import { Component, Input } from '@angular/core';
import { AutoCompleteModule, GMapModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { MockSiteService } from '../dynamic-form/dynamic-form.component.spec';
import { SiteService } from '../../services/site.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import { UserStore } from '../../../user/store/user/user.store';
import { User } from '../../../user/model/user.model';
import { AuthService } from '../../../auth/services/auth.service';
import { ClientService } from '../../../client/services/client.service';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { AssignInspectionUsers } from '../../../inspection/model/assignInspectionUsers.model';
@Component({
  selector: 'app-top-navbar',
  template: 'app-top-navbar'
})
export class TopNavbarComponent {
  @Input() headerdetails;
  @Input() sortingDetails;
  @Input() selectedValue;
}
export class MockSite {
  getWindFarmsAndTurbines() {
    return Observable.of({});
  }
  getWindFarms() {
    return Observable.of({});
  }
}
export class MockReportService {
  getReport() {
    return Observable.of({});
  }
}
export class MockUserStore {
  users: Observable<User[]> = Observable.of([]);
}
export class MockAuthService {
  getUser() {}
}
export class MockClientService {
  getClientDetails() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
}
export class MockReportStore {
  assignInspectionUsers: Observable<AssignInspectionUsers[]> = Observable.of([]);
}
describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AutoCompleteModule,
        GMapModule,
        TableModule,
        RouterTestingModule
      ],
      declarations: [ MapViewComponent,
        TopNavbarComponent ],
        providers: [
          { provide: SiteService, useClass: MockSite },
          { provide: ReportService, useClass: MockReportService },
          { provide: UserStore, useClass: MockUserStore },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ClientService, useClass: MockClientService },
          { provide: OfflineStorageService, useClass: MockOfflineStorageService },
          { provide: ReportStore, useClass: MockReportStore }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
