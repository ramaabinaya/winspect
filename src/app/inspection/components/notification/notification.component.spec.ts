import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';

@Component({
  selector: 'app-top-navbar',
  template: '<div>app-top-navbar</div>'
})
export class TopNavbarComponent {
  @Input() headerdetails;
}

class MockAuthService {
  getUser() {
    return Observable.of({});
  }
}
class MockOfflineStorageService {
  applicationMode = new BehaviorSubject<boolean>(false);
  networkDisconnected = new BehaviorSubject<boolean>(false);
}
describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [
        RouterTestingModule
      ],
      declarations: [ NotificationComponent,
        TopNavbarComponent ],
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: OfflineStorageService, useClass: MockOfflineStorageService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
   
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
