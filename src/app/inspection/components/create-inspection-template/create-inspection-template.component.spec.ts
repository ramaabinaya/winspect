import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInspectionTemplateComponent } from './create-inspection-template.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule, TooltipModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { Inspection } from '../../model/inspection.model';
import { DynamicInspectionService } from '../../../shared/services/dynamicInspection.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-custom-inspection-template',
  template: 'app-custom-inspection-template'
})
export class CustomInspectionTemplateComponent {
  @Input() inspectionHeaderId: number;
}
@Component({
  selector: 'app-section-wizard',
  template: 'app-section-wizard'
})
export class SectionWizardComponent {
  @Input() preview: boolean;
  @Input() formName: string;
  @Input() editId: number;
  @Input() message: string;
}
@Component({
  selector: 'app-edit-section',
  template: 'app-edit-section'
})
export class EditSectionComponent {
  @Input() inspectionHeaderId: number;
  @Input() sectionList = [];
  @Input() activeSectionId: number;
}
export class MockInspectionStore {
  inspections: Observable<Inspection[]> = Observable.of([]);
  addInspectionSection() {
    return Observable.of({});
  }
  editSectionName() {
    return Observable.of({});
  }
  deleteInspectionSection() {
    return Observable.of({});
  }
}
export class MockDynamicInspectionService {
  getResourceList() {
    return Observable.of({});
  }
  getFormInputTypes() {
    return Observable.of({});
  }
  deleteInputProperty() {
    return Observable.of({});
  }
  deleteQuestion() {
    return Observable.of({});
  }
  deleteOptionGroup() {
    return Observable.of({});
  }
  updateInputproperties() {
    return Observable.of({});
  }
  addInputTypeProperties() {
    return Observable.of({});
  }
  createOptionGroup() {
    return Observable.of({});
  }
  addOptionChoices() {
    return Observable.of({});
  }
  addQuestion() {
    return Observable.of({});
  }
  updateOptions() {
    return Observable.of({});
  }
  // updateQuestion()  {
  //   return Observable.of({});
  // }
  deleteValidator() {
    return Observable.of({});
  }
  updateValidators() {
    return Observable.of({});
  }
  getSectionDetails() {
    return Observable.of({});
  }
  getFormInputTypeModelProperties() {
    return Observable.of({});
  }
  deleteOptionChoices() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  focusMode = new BehaviorSubject<boolean>(false);
}
describe('CreateInspectionTemplateComponent', () => {
  let component: CreateInspectionTemplateComponent;
  let fixture: ComponentFixture<CreateInspectionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        DialogModule,
        ReactiveFormsModule,
        DropdownModule,
        TooltipModule,
        ConfirmDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [CreateInspectionTemplateComponent,
        CustomInspectionTemplateComponent,
        SectionWizardComponent,
        EditSectionComponent
      ],
      providers: [
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: DynamicInspectionService, useClass: MockDynamicInspectionService },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: ConfirmationService, useClass: ConfirmationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInspectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
