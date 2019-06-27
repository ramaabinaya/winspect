import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchivedUsersComponent } from './archived-users.component';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserStore } from '../../../user/store/user/user.store';
import { Observable } from 'rxjs';
import { User } from '../../../user/model/user.model';
import { UserService } from '../../../user/services/users.service';
import { SortingService } from '../../../shared/services/sorting.service';

@Component({
  selector: 'app-filter',
  template: 'app-filter'
})
export class FilterComponent {
  @Input() filterDetails;
  @Input() table;
}
export class MockUserStore {
  users: Observable<any[]> = Observable.of([
    {
      active: 0,
      clientId: null,
      created: '2018-05-14T19:52:54.000Z',
      customerId: 1,
      email: 'amaldev@hotmail.com',
      firstName: 'Amal',
      id: 1,
      lastName: 'DevA',
      modified: '2018-11-20T04:08:17.000Z',
      password: '',
      resetPasswordExpires: null,
      resetPasswordToken: null,
      userRole: { name: 'Technician' },
      userRoleId: 1
    }
  ]);
  changeUserStatus() {
    return Observable.of({});
  }
}
export class MockUserService {
  getRole() {
    return Observable.of([
      {
        created: '2018-05-14T19:43:04.000Z',
        descripton: null,
        id: 1,
        modified: '2018-05-14T19:43:04.000Z',
        name: 'Technician'
      }
    ]

    );
  }
}
export class MockSortingService {
  selectedDetails = [];
}

describe('ArchivedUsersComponent', () => {
  let component: ArchivedUsersComponent;
  let fixture: ComponentFixture<ArchivedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TableModule
      ],
      declarations: [ArchivedUsersComponent,
        FilterComponent],
      providers: [
        { provide: UserStore, useClass: MockUserStore },
        { provide: UserService, useClass: MockUserService },
        { provide: SortingService, useClass: MockSortingService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getFilteredTable', () => {
    component.getFilteredTable(event);
    expect(component.getFilteredTable).toBeDefined();
  });
  it('should call onRestoreUser', () => {
    const id = 2;
    component.onRestoreUser(id);
    expect(component.onRestoreUser).toBeDefined();
  });
  it('should call filterGlobalUser', () => {
    component.UserGlobalSearch(event);
    expect(component.UserGlobalSearch).toBeDefined();
  });
});
