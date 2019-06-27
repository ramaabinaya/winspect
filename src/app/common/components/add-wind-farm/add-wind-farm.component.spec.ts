import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWindFarmComponent } from './add-wind-farm.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SiteService } from '../../services/site.service';
import { AuthService } from '../../../auth/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { DebugElement } from '@angular/core';

class MockSiteService {
  addWindFarm() {
    return Observable.of({
      windFarm: {
      active: 1,
      country: "EU",
      created: "2019-01-02T05:40:14.192Z",
      customerId: 1,
      id: 60,
      modified: "2019-01-02T05:40:14.192Z",
      name: "johns wind farm",
      state: "TN"
      }
    });
  }
  addMoreWindFarms() {
    return Observable.of({
      windFarm: [
       { active: 1,
        country: "AU",
        created: "2019-01-02T06:13:57.585Z",
        customerId: 1,
        id: 61,
        modified: "2019-01-02T06:13:57.585Z",
        name: "xxxx",
        state: "MB" },
      true]
    });
   }
}

class MockAuthService {
  getUser() { }
}
describe('AddWindFarmComponent', () => {
  let component: AddWindFarmComponent;
  const formBuilder: FormBuilder = new FormBuilder();
  let debugElement: DebugElement;
  let siteservice: SiteService;
  let siteservicespy;
  let siteservicespy1;
  let fixture: ComponentFixture<AddWindFarmComponent>;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        DialogModule,
        ConfirmDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [AddWindFarmComponent],
      providers: [
        ConfirmationService,
        { provide: SiteService, useClass: MockSiteService },
        { provide: AuthService, useClass: MockAuthService }
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWindFarmComponent);
    component = fixture.componentInstance;
    debugElement =fixture.debugElement;
    siteservice = debugElement.injector.get(SiteService);
    siteservicespy = spyOn(siteservice, 'addWindFarm').and.callThrough();
    siteservicespy1 = spyOn(siteservice, 'addMoreWindFarms').and.callThrough();
    component.windFarmForm = formBuilder.group({
      'windfarmname': null,
      'country': null,
      'state': null
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call addWindFarm', () => {
    component.windFarmForm.setValue({
      'windfarmname': 'johns wind farm',
      'country': 'EU',
      'state': 'TN'
    });
    component.addWindFarm();
    expect(siteservicespy).toBeDefined();  
  });
  it('should call canDeactivate', () => {
    component.canDeactivate();
    expect(component.windFarmForm && !component.windFarmForm.dirty).toBeTruthy();
  });
  it('should call onUploadFileData', () => {
    // component.onFileUploaded(event);
    // expect(component.onFileUploaded).toBeDefined();
    expect(siteservicespy1).toBeDefined();
  });
});
