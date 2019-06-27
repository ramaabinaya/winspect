import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionWizardComponent } from './section-wizard.component';
import { Component, Input, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DynamicFormGroupService } from '../../services/dynamic-form-group.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../auth/services/auth.service';
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
@Component({
  selector: 'app-dynamic-form',
  template: 'app-dynamic-form'
})
export class DynamicFormComponent {
  @Input() formName: string;
  @Input() sectionName: string;
  @Input() editId: number;
  @Input() fieldQuestions = [];
  @Input() elementArray: number;
  @Input() answers = [];
}
export class MockDynamicFormGroupService {
  getInspectionSections() {
    return Observable.of({});
  }
  sectionSaveTriggered = new EventEmitter<any>();
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getInspectionDetails() {
    return Observable.of({});
  }
}
export class MockAuthService {
  getUser() {
    return Observable.of({});
  }
}
describe('SectionWizardComponent', () => {
  let component: SectionWizardComponent;
  let fixture: ComponentFixture<SectionWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ SectionWizardComponent,
        TopNavbarComponent,
        DynamicFormComponent ],
        providers: [
          { provide: DynamicFormGroupService, useClass: MockDynamicFormGroupService },
          { provide: OfflineStorageService, useClass: MockOfflineStorageService },
          { provide: AuthService, useClass: MockAuthService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
