import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../../auth/services/auth.service';
import { OfflineStorageService } from '../../../services/offlineStorage.service';
import { BehaviorSubject } from 'rxjs';

class MockAuthService {
  getUser(){}
}
class MockOfflineStorageService {
  focusMode = new BehaviorSubject<boolean>(false);
  applicationMode = new BehaviorSubject<boolean>(false);
  changedsyncedPercentage = new BehaviorSubject<number>(0);
  networkDisconnected = new BehaviorSubject<boolean>(false);
  createTables() {}
}
describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ NavBarComponent ],
      providers:[
        {provide: AuthService, useClass: MockAuthService},
        {provide: OfflineStorageService, useClass: MockOfflineStorageService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
