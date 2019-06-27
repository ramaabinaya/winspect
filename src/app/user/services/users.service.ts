// UserService which used to create, update and retrieve the user related data in database.
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../common/services/httpRouting.service';
/**
 * Service which used to create, update and retrieve the user related data in database.
 */
@Injectable()
export class UserService {
  /**
   * Service constructor to inject the other needed services here.
   * @param http Service to send the api request to the server.
   */
  constructor(private http: HttpRoutingService) { }
  /**
   * Method which is used to get all the existing user informations from the database.
   * @return {Observable<any>}
   */
  getUsers() {
    return this.http.getMethod('userlist').pipe(map((res) => {
      if (res && res['user']) {
        return res['user'];
      }
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to add the provided user information to the database.
   * @param data The data which holds the entered user information to be added.
   * @return {Observable<any>}
   */
  addUser(data) {
    return this.http.postMethod('adduser', data);
  }
  /**
   * Method which is used to change the status of the report by the given reportid with the provided status.
   * @param id {number} The index of the report.
   * @param active {number} The statuscode to de updated.
   * @param dateModified {Date} The date of user details lat modified.
   * @return {Observable<number[]>}
   */
  changeUserStatus(userDetails) {
    const data = userDetails;
    return this.http.postMethod('user/status', data).pipe(map((res) => {
      return userDetails;
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to edit the existing user information with the provided information.
   * @param id {number} The index of the report to be updated.
   * @param user {User} The user information to be updated.
   * @return { Observable<any[]> }
   */
  editUser(id: number, user) {
    const data = { id: id, user: user };
    return this.http.postMethod('user/edit', data).pipe(map((res) => {
      return [id, user];
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to get all users role.
   */
  getRole() {
    return this.http.getMethod('getAllUserRole');
  }
  /**
   * Method which is used to get all wind farm details
   */
  getAllClient() {
    return this.http.getMethod('getAllClients');
  }
  /**
   * Method which is used to change the current password.
   * @param passwordData  which holds the password details of the user.
   */
  onChangePassword(passwordData) {
    return this.http.postMethod('user/changepassword', passwordData);
  }
  /**
   * Method which is used to create or edit the password.
   * @param passwordData which holds the password and the token details.
   */
  configurePassword(passwordData) {
    return this.http.postMethod('user/configurePassword', passwordData);
  }
  /**
   * Method which is used to display the password configuration form.
   * @param token which holds the token.
   */
  checkToken(token) {
    const data = { token: token };
    return this.http.postMethod('configurePassword', data);
  }
  /**
   * Method which is used to check whether the email already used or not.
   * @param email {string} The email id to check.
   */
  checkEmail(email: string) {
    const data = { email: email };
    return this.http.postMethod('checkEmail', data);
  }
}
