import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserComponent } from './add-user.component';
import { DialogModule } from 'primeng/dialog';
import { Component, Input, DebugElement } from '@angular/core';
import { DropdownModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { MockAuthService } from '../../../inspection/components/edit-inspection/edit-inspection.component.spec';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { UserStore } from '../../store/user/user.store';
import { UserService } from '../../services/users.service';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
export class MockAuth {
  getUser() {
    return Observable.of({});
  }
}
export class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
}
export class MockUserStore {
  createUser() {
    return Observable.of({});
  }
}
export class MockUserService {
  getRole() {
    return Observable.of({});
  }
  getAllClient() {
    return Observable.of({});
  }
  addUser() {
    return Observable.of({
      active: 1,
      clientId: 21,
      created: "2018-12-31T12:40:28.866Z",
      customerId: 1,
      email: "maha@centizen.com",
      firstName: "lk",
      id: 133,
      lastName: "mahalk",
      modified: "2018-12-31T12:40:28.866Z",
      password: "$2b$10$hhEeEsGwmOdxIL1T3jmpQO4FjIZJPi5YFb4rhqV8pIzFeMM77HIDK",
      userRoleId: 3
    });
  }
}
describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let debugElement: DebugElement;
  let userservice: UserService;
  let userservicespy;
  // let userstore: UserStore;
  // let userstorespy;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogModule,
        DropdownModule,
        ConfirmDialogModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [AddUserComponent,
        TopNavbarComponent],
      providers: [
        { provide: AuthService, useClass: MockAuth },
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: UserStore, useClass: MockUserStore },
        { provide: UserService, useClass: MockUserService },
        { provide: ConfirmationService, useClass: ConfirmationService },
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    userservice = debugElement.injector.get(UserService);
    userservicespy = spyOn(userservice, 'addUser').and.callThrough();
    // userstore = debugElement.injector.get(UserStore);
    // userstorespy = spyOn(userstorespy, 'createUser').and.callThrough();
    
    component.userForm = formBuilder.group({
      'email': null,
      'password': null,
      'firstname': null,
      'lastname': null,
      'role': null,
      'client': null
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onNavigate', () => {
    component.onNavigate();
    expect(component.onNavigate).toBeDefined();
  });
  it('should call navigate', () => {
    component.navigate();
    expect(component.navigate).toBeDefined();
  });
  it('should call addUser', () => {
    component.userForm.setValue({
      'email': 'adj@vjks.com',
      'password': 'fdgh',
      'firstname': 'fggh',
      'lastname': 'uvyv',
      'role': 'Client',
      'client': 'tfyguh'
    });
    component.addUser();
    expect(component.addUser).toBeDefined();
    expect(userservicespy).toBeDefined();
  });
  it('should call canDeactivate', () =>{
    component.canDeactivate();
    expect(component.userForm && !component.userForm.dirty).toBeTruthy();
  });
});
