import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechAssignedMapviewComponent } from './tech-assigned-mapview.component';
import { Component, Input } from '@angular/core';
import { GMapModule } from 'primeng/gmap';
import { DropdownModule, DialogModule } from 'primeng/primeng';
import { RouterTestingModule } from '@angular/router/testing';
import { SiteService } from '../../../../common/services/site.service';
import { InspectionService } from '../../../../shared/services/inspection.service';
import { InspectionStore } from '../../../../shared/store/inspection/inspection.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineStorageService } from '../../../../common/services/offlineStorage.service';
import { ReportService } from '../../../../shared/services/report.service';

@Component({
  selector: 'app-top-navbar',
  template: 'app-top-navbar'
})
export class TopNavbarComponent {
  @Input() headerdetails;
}
@Component({
  selector: 'app-tech-safety-inspection',
  template: 'app-tech-safety-inspection'
})
export class TechSafetyInspectionComponent {
  @Input() turbineId: number;
  @Input() assignedInspectionId: number;
  @Input() inspectionHeaderId: number;
  @Input() bladeType: string;
}
class MockSiteService {
  getAllWindTurbines() {
    return Observable.of({
      windTurbines: [{
        buildYear: 2008,
        created: '2018-06-12T17:57:58.000Z',
        id: 18364,
        latitude: 41.4408,
        longitude: -94.7069,
        modified: '2018-06-12T17:57:58.000Z',
        windFarm: {
          name: 'Adair Wind Farm,Cass'
        }
      }]
    });
  }
}
class MockInspectionService {
  getAssignedInspectionDetails() {
    return Observable.of({});
  }
}
class MockInspectionStore {
  inspections: Observable<any[]> = Observable.of([
    {
      created: '2018-05-31T09:20:25.000Z',
      customerId: 1,
      fileAttachment: null,
      id: 2,
      inspectionReportType: 'M',
      inspectionSections: [{
        condition: null,
        created: '2018-05-31T10:49:09.000Z',
        id: 2,
        inspectionHeaderId: 2,
        isCommon: 1,
        modified: '2018-05-31T10:49:09.000Z',
        sectionDesc: null,
        sectionName: 'Observation Details',
        sectionState: null,
        showNext: 1,
        showPrev: 0
      }],
      instructions: '',
      isActive: 1,
      isCustom: 1,
      isForm: 0,
      modified: '2018-05-31T09:20:25.000Z',
      name: 'Notus Safety Inspection'
    }
  ]);
}
class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  getAssignedInspectiondetails() {
    return Observable.of({});
  }
  getWindTurbines() {
    return Observable.of({});
  }
  getTurbineBladeReportType() {
    return Observable.of({});
  }
}
class MockReportService {
  getTurbineReport() { }
}
describe('TechAssignedMapviewComponent', () => {
  let component: TechAssignedMapviewComponent;
  let fixture: ComponentFixture<TechAssignedMapviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        GMapModule,
        DropdownModule,
        DialogModule,
        RouterTestingModule
      ],
      declarations: [TechAssignedMapviewComponent,
        TopNavbarComponent,
        TechSafetyInspectionComponent],
      providers: [
        { provide: SiteService, useClass: MockSiteService },
        { provide: InspectionService, useClass: MockInspectionService },
        { provide: InspectionStore, useClass: MockInspectionStore },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: ReportService, useClass: MockReportService }

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechAssignedMapviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
