import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailImageViewComponent } from './thumbnail-image-view.component';
import { KeyUpListenerDirective } from '../../../moblie/directives/keyUpListener.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from '../../../shared/services/report.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { Router } from '@angular/router';

class MockReportService{
  getReport() {}
}
class MockOfflineStorageService {
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getReport() {}
  getAssignedInspectiondetails() {}
  getInspection() {}
  getInspectionSections() {}
  getQuestions() {}
  getInputTypeProperties() {}  
  getAnswersByquestionId() {}
  getImageAnswers() {}
}
class RouterStub {
  navigateByUrl(url: string) {
  return url;
  }
  }
describe('ThumbnailImageViewComponent', () => {
  let component: ThumbnailImageViewComponent;
  let fixture: ComponentFixture<ThumbnailImageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      RouterTestingModule
      ],
      declarations: [ ThumbnailImageViewComponent , KeyUpListenerDirective],
      providers: [
        { provide: ReportService, useClass: MockReportService },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        {provide: Router, useClass: RouterStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailImageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
