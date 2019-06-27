import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninComponent } from './signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { DebugElement } from '@angular/core';
class MockAuthService {
  sendEmail() {
    return Observable.of({});
  }
  signinUser() {
    return Observable.of({});
  }
}
class MockOfflineService {
  networkDisconnected = new BehaviorSubject<boolean>(null);
  getCurrentUser() {
    return Observable.of({
      user: {
        email: 'email@example.com',
        password: 'Password1234'
      }
    });
  }
}
describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let debugElement: DebugElement;
  let authservice: AuthService;
  let offlinestorage: OfflineStorageService;
  let authservicespy;
  let offlinestoragespy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [SigninComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: OfflineStorageService, useClass: MockOfflineService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    authservice = debugElement.injector.get(AuthService);
    authservicespy = spyOn(authservice, 'signinUser').and.callThrough();
    offlinestorage = debugElement.injector.get(OfflineStorageService);
    offlinestoragespy = spyOn(offlinestorage, 'getCurrentUser').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call activate', () => {
    component.disconnected = false;
    component.onSignIn();
    expect(component.disconnected).toBe(false);
    expect(authservicespy).toHaveBeenCalled();
    // expect(offlinestoragespy).toHaveBeenCalled();
  });
  //   xit('should call onsignin-offline', () => {
  // component.disconnected =true;
  // component.onSignIn();
  // expect(component.disconnected).toBe(true);
  //  expect(offlinestoragespy).toHaveBeenCalled();
  //   });
  // it('should call show', () => {
  //   component.show = false;
  //   component.onShow();
  //   expect(component.show).toBe(true);
  // });
  it('should call fogot', () => {
    component.forgotPasswordView = true;
    component.forgot();
    expect(component.forgotPasswordView).toBe(false);
  });

});
