import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { Component, Input, DebugElement } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ConfirmDialogModule, ConfirmationService, Confirmation } from 'primeng/primeng';
import { HighlightSearch } from '../../../inspection/pipe/highlight.pipe';
import { UserStore } from '../../store/user/user.store';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../model/user.model';
import { UserService } from '../../services/users.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { MockOfflineStorageService } from '../../../inspection/components/tech-reports/tech-reports.component.spec';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { AuthService } from '../../../auth/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-filter',
  template: 'app-filter'
})
export class FilterComponent {
  @Input() filterDetails;
  @Input() table;
}
@Component({
  selector: 'app-top-navbar',
  template: 'app-top-navbar'
})
export class TopNavbarComponent {
  @Input() headerdetails;
  @Input() sortingDetails;
  @Input() selectedValue;
}
export class MockUserStore {
  users: Observable<any> = Observable.of([
    {
      active: 1,
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
  editUser() {
    return Observable.of(
      [{
        userId: 1,
        user: 'sadfsad'
      }
      ]

    );
  }
  changeUserStatus() {
    return Observable.of({});
  }
}
//  class MockConfirmationService {
//   confirm() {
//     return Observable.of({});
//   }
// }
export class MockUserService {
  getRole() {
    return Observable.of({
      userRole: [
        {
          created: '2018-05-14T19:43:04.000Z',
          descripton: null,
          id: 1,
          modified: '2018-05-14T19:43:04.000Z',
          name: 'Technician'
        }
      ]
    }
    );

  }
}
export class MockSort {
  selectedDetails = [];
  sortReport() {
    return Observable.of({});
  }
}
export class MockOfflineStorage {
  applicationMode = new BehaviorSubject<boolean>(false);
}
export class MockAuthService {
  getUser() {
    return Observable.of({});
  }
}
export class MockNgbModal {
  open() { }
}
describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let debugElement: DebugElement;
  let userstore: UserStore;
  let userstorespy;
  let sortservice: SortingService;
  let sortservicespy;
  let modalservice: NgbModal;
  let modalservicespy;
  let userstorespyrestore;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TableModule,
        RouterTestingModule,
        DialogModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [UsersComponent,
        FilterComponent,
        TopNavbarComponent,
        HighlightSearch],
      providers: [
        { provide: UserStore, useClass: MockUserStore },
        { provide: ConfirmationService, useClass: ConfirmationService },
        { provide: UserService, useClass: MockUserService },
        { provide: SortingService, useClass: MockSort },
        { provide: OfflineStorageService, useClass: MockOfflineStorage },
        { provide: AuthService, useClass: MockAuthService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: NgbModal, useClass: MockNgbModal }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.editForm = formBuilder.group({
      'email': null,
      'firstName': null,
      'lastName': null
    });
    userstore = debugElement.injector.get(UserStore);
    userstorespy = spyOn(userstore, 'editUser').and.callThrough();
    userstorespyrestore = spyOn(userstore, 'changeUserStatus').and.callThrough();
    sortservice = debugElement.injector.get(SortingService);
    sortservicespy = spyOn(sortservice, 'sortReport').and.callThrough();
    modalservice = debugElement.injector.get(NgbModal);
    modalservicespy = spyOn(modalservice, 'open').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should call showFilters', () => {
  //   component.sort = false;
  //   component.showFilters();
  //   expect(component.show).toBe(true);
  // });
  it('should call getFilteredTable', () => {
    component.getFilteredTable(event);
    // component.userTableRef = event;
    expect(component.getFilteredTable).toBeDefined();
  });
  it('should call onNavigate', () => {
    const key = 'L';
    component.onNavigate(key);
    expect(component.onNavigate).toBeDefined();


  });
  it('should call onNavigate -else', () => {
    const key = 'R';
    component.onNavigate(key);
    expect(component.onNavigate).toBeDefined();


  });
  it('should call onEdit', () => {
    const i = 3;
    component.onEdit(i);
    expect(component.onEdit).toBeDefined();
  });
  it('should call onEditAccount', () => {
    component.onEditAccount();
    component.alreadyUserExist = false;
    component.editForm.setValue({
      'email': 'sadf@sdf.com',
      'firstName': 'sdfull',
      'lastName': 'ns'
    });
    expect(component.alreadyUserExist).toBeDefined();
    // if(this.editForm && this.editForm.value && this.editForm.value.email)
    expect(component.editForm && component.editForm.value && component.editForm.value.email).toBeTruthy();
    expect(component.onEditAccount).toBeDefined();
  });
  it('should call onEditAccount - else', () => {
    component.onEditAccount();

    // this.dialogVisible = false;
    component.alreadyUserExist = true;
    component.userId = 2;
    component.users = [
      {
        active: 1,
        clientId: null,
        created: new Date(Date.now()),
        customerId: 1,
        email: 'amaldev@hotmail.com',
        firstName: 'Amal',
        id: 1,
        lastName: 'DevA',
        role: 'Admin',
        modified: new Date(Date.now()),
        userName: 'Amal DevA',
        // password: "",
        // resetPasswordExpires: null,
        // resetPasswordToken: null,
        // userRole: { name: "Technician" },
        userRoleId: 1
      }
    ];
    component.editForm.setValue({
      'email': 'sadf@sdf.com',
      'firstName': 'sdfull',
      'lastName': 'ns'
    });
    expect(component.users && component.userId && !component.alreadyUserExist).toBeDefined();
    component.modelReference = null;
    expect(component.modelReference).toBeNull();
    expect(userstorespy).toBeDefined();
  });
  it('should call onArchive', () => {
    const id = 3;
    component.onArchive();
    expect(component.onArchive).toBeDefined();
  });
  it('should call onClear', () => {
    component.onClear();
    component.userName = undefined;
    component.resultNotExist = false;
    component.archivedUsersView = true;
    expect(component.archivedUsersView).toBeTruthy();
    component.archivedUsers = [
      {
        active: 0,
        clientId: null,
        created: '2018-09-08T04:30:11.000Z',
        customerId: 1,
        email: 'isk@gmail.com',
        firstName: 'isk',
        id: 131,
        lastName: 'isk',
        modified: '2018-11-20T04:47:12.000Z',
        name: 'isk isk',
        password: '$2b$10$k9NHClXCeVV6xPgz1l2yluNgp5AJVwGraPLEIHmBOjwt67m1jL.WS',
        resetPasswordExpires: null,
        resetPasswordToken: null,
        userRole: { name: 'Client' },
        userRoleId: 3
      }
    ];
    component.filteredReport = component.archivedUsers;
    expect(component.filteredReport).toBeDefined();
  });
  it('should call sortReport', () => {
    const key = 1;
    component.sortReport(key);
    expect(sortservicespy).toBeDefined();
  });
  it('should call userSelected', () => {


    component.searchValue(event);
    component.userName = 'Isk Isk';
    component.archivedUsersView = true;
    component.filteredReport = [
      {
        active: 0,
        clientId: null,
        created: '2018-09-08T04:30:11.000Z',
        customerId: 1,
        email: 'isk@gmail.com',
        firstName: 'isk',
        id: 131,
        lastName: 'isk',
        modified: '2018-11-20T04:47:12.000Z',
        name: 'isk isk',
        password: '$2b$10$k9NHClXCeVV6xPgz1l2yluNgp5AJVwGraPLEIHmBOjwt67m1jL.WS',
        resetPasswordExpires: null,
        resetPasswordToken: null,
        userRole: { name: 'Client' },
        userRoleId: 3
      }
    ];
    expect(component.userName).toBeDefined();
    expect(component.archivedUsersView).toBeTruthy();
  });
  it('should call openModal', () => {
    const onArchive = {};
    component.openRestoreModal(onArchive);
    expect(modalservicespy).toBeDefined();
  });
  // it('should call openmodalEdit', () => {
  //   let edit;
  //   component.openModalEdit(edit);
  //   expect(modalservicespy).toBeDefined();

  // });
  it('should call openRestoreModal', () => {
    const onUndoUser = {};
    component.openRestoreModal(onUndoUser);
    expect(modalservicespy).toBeDefined();
  });
  // it('should call onArchives', () => {
  //   const id = 2;
  //   component.onArchives();
  //   expect(userstorespy).toBeDefined();
  // });
  // it('should call techSort', () =>{
  //   component.techSort();
  //   expect(component.techSort).toBeDefined();
  // });
  // it('should call onArchivedUsers', () =>{
  //   component.onArchivedUsers();
  //   expect(component.onArchivedUsers).toBeDefined();
  // });
  it('should call onRestoreUser', () => {
    const id = 1;
    component.onRestoreUser(id);
    expect(userstorespyrestore).toBeDefined();
  });
  it('should call filterGlobal', () => {
    component.filterGlobal(event);
    expect(component.filterGlobal).toBeDefined();
  });
  it('should call allusers', () => {
    component.allusers();
    expect(component.allusers).toBeDefined();
  });
  it('should call archivedusers', () => {
    component.archivedusers();
    expect(component.archivedusers).toBeDefined();
  });
});
