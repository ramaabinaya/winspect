import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TechSafetyInspectionComponent } from './tech-safety-inspection.component';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormGroupService } from '../../../../../common/services/dynamic-form-group.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineStorageService } from '../../../../../common/services/offlineStorage.service';
import { ReportService } from '../../../../../shared/services/report.service';
import { CommonReportDataService } from '../../../../../shared/services/common-report-data.service';
import { ReportStore } from '../../../../../shared/store/report/report.store';

@Component({
  selector: 'app-section-wizard',
  template: '<div>app-section-wizard</div>'
})
export class SectionWizardComponent {
  @Input() formName: string;
  @Input() editId: number;
  @Input() message: string;
}
class MockDynamicFormGroupService {
  getInspectionSections() {
    return Observable.of({});
  }
}
class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getInspectionDetails() {
    return Observable.of({});
  }
}
class MockReportService {
  createReport() {
    return Observable.of({});
  }
  storeAnswerForImages() {
    return Observable.of({});
  }
  storeImage() { }
  createSections() { }
}
class MockCommonReportDataService {
  emptyData() {
    return Observable.of({});
  }
  setAnswersData() { }
}
class MockReportStore {
  createReport() {
    return Observable.of({});
  }
  changeAssignedInspectionStatus() { }
}
describe('TechSafetyInspectionComponent', () => {
  let component: TechSafetyInspectionComponent;
  let fixture: ComponentFixture<TechSafetyInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [TechSafetyInspectionComponent,
        SectionWizardComponent],
      providers: [
        { provide: DynamicFormGroupService, useClass: MockDynamicFormGroupService },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: ReportService, useClass: MockReportService },
        { provide: CommonReportDataService, useClass: MockCommonReportDataService },
        { provide: ReportStore, useClass: MockReportStore }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechSafetyInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
