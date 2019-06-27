import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChildReportComponent } from './create-child-report.component';
import { DialogModule } from 'primeng/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonReportDataService } from '../../../shared/services/common-report-data.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { AuthService } from '../../../auth/services/auth.service';
import { InspectionService } from '../../../shared/services/inspection.service';
import { DynamicFormGroupService } from '../../../common/services/dynamic-form-group.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export class MockCommonReportDataService {
  dataChanged = new Subject<any>();
  setData() { }
}
export class MockReportService {
  createReport() {
    return Observable.of({});
  }
  createSections() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getInspectionHeader() {
    return Observable.of({});
  }
  getInspectionSections() {
    return Observable.of({});
  }
  getQuestions() {
    return Observable.of({});
  }
  getInputTypeProperties() {
    return Observable.of({});
  }
  getOptionGroups() {
    return Observable.of({});
  }
  getOptionChoices() {
    return Observable.of({});
  }
  assignInspection() {
    return Observable.of({});
  }
  createReport() {
    return Observable.of({});
  }
  createSections() {
    return Observable.of({});
  }
}
export class MockAuthService {
  getUser() {
    return Observable.of({});
  }

}
export class MockInspectionService {
  assignInspection() {
    return Observable.of({});
  }
}
export class MockDynamicFormGroupService {
  getFormDetails() {
    return Observable.of({});
  }
}
export class MockReportStore {
  createNewAssignInspection() {
    return Observable.of({});
  }
  createReport() {
    return Observable.of({});
  }
}
describe('CreateChildReportComponent', () => {
  let component: CreateChildReportComponent;
  let fixture: ComponentFixture<CreateChildReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [CreateChildReportComponent],
      providers: [
        { provide: CommonReportDataService, useClass: MockCommonReportDataService },
        { provide: ReportService, useClass: MockReportService },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: InspectionService, useClass: MockInspectionService },
        { provide: DynamicFormGroupService, useClass: MockDynamicFormGroupService },
        { provide: ReportStore, useClass: MockReportStore }

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChildReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
