import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldFormControlComponent } from './custom-field-form-control.component';
import { Component, Input } from '@angular/core';
import { DynamicFormGroupService } from '../../services/dynamic-form-group.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineStorageService } from '../../services/offlineStorage.service';
@Component({
  selector: 'app-dynamic-form',
  template: '<div>app-dynamic-form [fieldQuestions]="fieldQuestions" </div>'
  })
class DynamicFormComponent {
  @Input() fieldQuestions = [];
  @Input() answers = [];
  @Input() elementArray: number;
  @Input() editId: number;
  // @Input() editId: number;
  // @Input() question: any;
  }
 
  class MockDynamicFormGroupService {
    getDynamicFieldQuestion() {
      return Observable.of({});
    }
    getDynamicFieldAnswers() {
      return Observable.of({});
    }
  }
  class MockOfflineStorageService {
    networkDisconnected = new BehaviorSubject<boolean>(false);
    getDynamicFieldQuestion() {}
    getInputTypes() {}
    getInputTypeProperties() {}
    getOptionGroups() {}
    getOptionChoices() {}
    getDynamicFieldAnswers() {}

  }
describe('CustomFieldFormControlComponent', () => {
  let component: CustomFieldFormControlComponent;
  let fixture: ComponentFixture<CustomFieldFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFieldFormControlComponent, DynamicFormComponent ],
      providers: [
        { provide: DynamicFormGroupService, useClass: MockDynamicFormGroupService},
        { provide: OfflineStorageService, useClass: MockOfflineStorageService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
