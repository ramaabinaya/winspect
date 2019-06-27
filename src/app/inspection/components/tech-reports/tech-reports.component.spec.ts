import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechReportsComponent } from './tech-reports.component';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from '../../../shared/services/report.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataService } from '../../services/data.service';
import { File } from '@ionic-native/file';
import { AuthService } from '../../../auth/services/auth.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
@Component({
  selector: 'app-top-navbar',
  template: 'app-top-navbar'
})
export class TopNavbarComponent {
  @Input() headerdetails;
  @Input() sortingDetails;
  @Input() selectedValue;
}
export class MockReportService {
  getReport() {
    return Observable.of({});
  }
  getDynamicFieldElementQuestionById() {
    return Observable.of({});
  }
}
export class MockDataService {
  createPDF() {}
  downoadPDF() {}
}
export class MockAuthService {
  getUser() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getReport() {
    return Observable.of({});
  }
  getAssignedInspectiondetails () {
    return Observable.of({});
  }
  getInspection() {
    return Observable.of({});
  }
  getInspectionSections() {
    return Observable.of({});
  }
  getQuestionsWithDynamicField() {
    return Observable.of({});
  }
  getInputTypeProperties() {
    return Observable.of({});
  }
  getAnswersByquestionId() {
    return Observable.of({});
  }
  getImageAnswers() {
    return Observable.of({});
  }
  getOptionChoiceAnswers() {
    return Observable.of({});
  }
  getOptionChoicesById() {
    return Observable.of({});
  }
  getDynamicFieldElementQuestionById() {
    return Observable.of({});
  }
}
export class MockFile {
  documentsDirectory;
}
export class MockDocumentViewer {
  viewDocument;
}
export class MockSpinnerDialog {
  show;
  hide;
}
describe('TechReportsComponent', () => {
  let component: TechReportsComponent;
  let fixture: ComponentFixture<TechReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ TechReportsComponent,
        TopNavbarComponent ],
        providers: [
          { provide: ReportService, useClass: MockReportService },
          { provide: DataService, useClass: MockDataService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: OfflineStorageService, useClass: MockOfflineStorageService },
          { provide: File, useClass: MockFile },
          { provide: DocumentViewer, useClass: MockDocumentViewer },
          { provide: SpinnerDialog, useClass: MockSpinnerDialog }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
