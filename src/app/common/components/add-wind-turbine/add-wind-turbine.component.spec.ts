import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AddWindTurbineComponent } from './add-wind-turbine.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule, DialogModule } from 'primeng/primeng';
import { SiteService } from '../../services/site.service';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
class MockSiteService {
  getAllWindFarms() {
    return Observable.of({});
  }
  addWindTurbine() {
    return Observable.of({
      windTurbine: {
        buildYear: 1990,
        created: '2019-01-02T04:18:13.531Z',
        id: 38757,
        latitude: 90.345,
        longitude: 25.4344,
        modified: '2019-01-02T04:18:13.532Z',
        windMillId: 49
      }

    });

  }
  addMoreWindTurbines() {
    return Observable.of({
      windTurbine: {
        0:  '2000,56.43394,82.4454,48',
        1:  '2003,43.5452,28.3453,48',
        2: '205,46.8903,60.4335,48'
      }
    });
  }
}
describe('AddWindTurbineComponent', () => {
  let component: AddWindTurbineComponent;
  const formBuilder: FormBuilder = new FormBuilder();
  let debugElement: DebugElement;
  let siteservice: SiteService;
  let siteservicespy;
  let siteservicespy1;
  let fixture: ComponentFixture<AddWindTurbineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DropdownModule,
        DialogModule,
        ConfirmDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [AddWindTurbineComponent],
      providers: [ConfirmationService,
        { provide: SiteService, useClass: MockSiteService },
        // { provide: ConfirmationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWindTurbineComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    siteservice = debugElement.injector.get(SiteService);
    siteservicespy = spyOn(siteservice, 'addWindTurbine').and.callThrough();
    siteservicespy1 = spyOn(siteservice, 'addMoreWindTurbines').and.callThrough();
    component.windTurbineForm = formBuilder.group({
      'latitude': null,
      'longitude': null,
      'windFarm': null,
      'buildYear': null
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call buttonClicked', () => {
    component.windTurbineForm.setValue({
      'latitude': 90.235,
      'longitude': 35.8924,
      'windFarm': 'sdfdf',
      'buildYear': 1990
    });
    // component.dialogInfo = 'Wind Turbine added Successfully !';
    // component.display = true;
    // component.windTurbineForm.reset();
    component.buttonClicked();
    expect(component.buttonClicked).toBeDefined();
    expect(siteservicespy).toBeDefined();
  });
  it('should call canDeactivate', () => {
    component.canDeactivate();
    expect(component.windTurbineForm && !component.windTurbineForm.dirty).toBeTruthy();
  });
  it('should call onUploadFileData', () => {
    component.onUploadFileData(event);
    expect(component.onUploadFileData).toBeDefined();
    expect(siteservicespy1).toBeDefined();
  });

});
