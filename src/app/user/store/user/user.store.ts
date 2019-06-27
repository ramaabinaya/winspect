// Users Store is used to store the all users details locally.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as userActions from './user.action';
import { User } from '../../model/user.model';
/**
 * Class which is used to locally store the user details.
 */
@Injectable()
export class UserStore {
  /**
   * Variable which is used to define the user information
   */
  users: Observable<User[]>;
  /**
   * Class constructor to inject the required services
   * @param store To define the store
   */
  constructor(private store: Store<any>) {
    this.users = this.store.select(s => s.UserModule.User);
  }
  /**
   * Method which is used to load the all user.
   * @return {void}
   */
  load() {
    this.store.dispatch({ type: userActions.ActionTypes.LOAD });
  }
  /**
   * Method which is used to dispatch the action for create new user.
   * @param user To define the new user information.
   * @param userRole defines the role of the created user.
   * @return {void}
   */
  createUser(user, userRole) {
    const temp = [];
    temp.push(user);
    temp.push(userRole);
    this.store.dispatch({ type: userActions.ActionTypes.CREATE_USER, payload: temp });
  }
  /**
   * Method which is used to dispatch the action for change the status of the user
   * @param userId {number} defines the index of the user to be edited.
   * @param status {number} defines the statuscode of the user to be edited.
   * @return {void}
   */
  changeUserStatus(userId: number, status: number) {
    const temp = {
      id: userId,
      active: status
    };
    this.store.dispatch({ type: userActions.ActionTypes.CHANGE_USER_STATUS, payload: temp });
  }
  /**
   * Method which is used to dispatch the action for edit the selected user
   * @param userId {number} The index of the user to be edited.
   * @param user defines the user object to de edited.
   * @return {void}
   */
  editUser(userId: number, user) {
    const temp = [];
    temp.push(userId);
    temp.push(user);
    this.store.dispatch({ type: userActions.ActionTypes.EDIT_USER, payload: temp });
  }
}
