import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../../common/core.module';
import { UserProfileViewComponent } from './user-profile-view.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
export class MockAuthService {
  getUser() {
    return Observable.of({
      clientId: null,
      customerId: 1,
      email: "email@example.com",
      firstName: "john",
      id: 8,
      lastName: "skirivin",
      role: "Admin",
      userRoleId: 2
    });
  }
}
describe('UserProfileViewComponent', () => {
  let component: UserProfileViewComponent;
  let fixture: ComponentFixture<UserProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule,
      RouterTestingModule],
      declarations: [ UserProfileViewComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call logout', () =>{
    component.logout();
    expect(component.logout).toBeDefined();
  })
});
