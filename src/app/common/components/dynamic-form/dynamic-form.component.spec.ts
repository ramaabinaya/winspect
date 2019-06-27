import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormComponent } from './dynamic-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsPrimeNGUIModule } from '@ng-dynamic-forms/ui-primeng';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Component, Input, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DynamicFormGroupService } from '../../services/dynamic-form-group.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { ClientService } from '../../../client/services/client.service';
import { ExportService } from '../../../inspection/services/export.service';
import { CommonReportDataService } from '../../../shared/services/common-report-data.service';
import { SiteService } from '../../services/site.service';
import { ConfirmationService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-camera',
  template: 'app-camera'
})
export class CameraComponent {
  @Input() option: string;
  @Input() imgData: any;
  @Input() sectionName: string;
}
export class MockDynamicFormGroupService{
  sectionSaveTriggered = new EventEmitter<any>();
  getFormDetails() {
    return Observable.of({});
  }
  getAnswers() {
    return Observable.of({});
  }
  getOptionChoices() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getInspectionHeader() {}
  getInspectionSections() {}
  getQuestions() {}
  getInputTypes() {}
  getInputTypeProperties() {}
  getOptionGroups() {}
  getOptionChoices() {}
  getAnswers(){}
  getOptionChoiceAnswers(){}
  getImageAnswers(){}
  getOptionGroupByName(){}

}
export class MockClientService {
  getAllClients(){}

}
export class MockExportService {
  getLocation() {}
}
export class MockCommonReportDataService {
  setAnswersData() {}
}
export class MockSiteService {
  getAllWindFarms() {}
}

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [
        FormsModule,
        ReactiveFormsModule,
        DynamicFormsPrimeNGUIModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        BrowserAnimationsModule

        // DynamicFormsCoreModule

      ],
      declarations: [ DynamicFormComponent,
        CameraComponent ],
        providers: [
          { provide: DynamicFormGroupService, useClass: MockDynamicFormGroupService },
          { provide: OfflineStorageService, useClass: MockOfflineStorageService },
          { provide: ClientService, useClass: MockClientService },
          { provide: ExportService, useClass: MockExportService },
          { provide: CommonReportDataService, useClass: MockCommonReportDataService },
          { provide: SiteService, useClass: MockSiteService }, ConfirmationService
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
