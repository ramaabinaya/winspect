import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupsComponent } from './create-groups.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserStore } from '../../../user/store/user/user.store';
import { Observable } from 'rxjs';
import { User } from '../../../user/model/user.model';
import { TitleCasePipe } from '@angular/common';
import { GroupsStore } from '../../../shared/store/groups/groups.store';
import { Groups } from '../../models/groups.models';

class MockUserStore {
  users: Observable<User[]> = Observable.of([]);
}
class MockTitleCasePipe {
  transform: string;
}
class MockGroupsStore {
  groups: Observable<Groups[]> =Observable.of([]);
  createGroup() {}
  removeGroup() {}
  editGroup() {}
  addToGroup() {}
}
describe('CreateGroupsComponent', () => {
  let component: CreateGroupsComponent;
  let fixture: ComponentFixture<CreateGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ CreateGroupsComponent ],
      providers: [
        { provide: UserStore, useClass: MockUserStore},
        { provide: TitleCasePipe, useClass: MockTitleCasePipe},
        { provide: GroupsStore, useClass: MockGroupsStore }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
