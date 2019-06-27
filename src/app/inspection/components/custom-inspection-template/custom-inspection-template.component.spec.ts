import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInspectionTemplateComponent } from './custom-inspection-template.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';
import { RouterTestingModule } from '@angular/router/testing';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { Inspection } from '../../model/inspection.model';
import { DynamicInspectionService } from '../../../shared/services/dynamicInspection.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';


class MockInspectionStore {
  inspections: Observable<Inspection[]> = Observable.of([]);
  addInspectionHeader() { }
}
class MockDynamicInspectionService {
  addInspectionHeader() { }
}
class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
}
describe('CustomInspectionTemplateComponent', () => {
  let component: CustomInspectionTemplateComponent;
  let fixture: ComponentFixture<CustomInspectionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DropdownModule,
        RouterTestingModule
      ],
      declarations: [CustomInspectionTemplateComponent],
      providers: [
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: DynamicInspectionService, useClass: MockDynamicInspectionService },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService }

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomInspectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
