import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavbarComponent } from './top-navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AutoCompleteModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

export class MockOfflineStorageService {
  networkDisconnected = new BehaviorSubject<boolean>(false);
}
export class MockAuthService {
  getUser() {
    return Observable.of({});
  }
}
describe('TopNavbarComponent', () => {
  let component: TopNavbarComponent;
  let fixture: ComponentFixture<TopNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AutoCompleteModule,
        FormsModule,
        NgbModule
      ],
      declarations: [ TopNavbarComponent ],
      providers: [
        { provide: OfflineStorageService, useClass: MockOfflineStorageService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
