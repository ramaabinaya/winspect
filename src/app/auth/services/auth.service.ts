import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { HeaderService } from '../../common/services/header.service';
import { OfflineStorageService } from '../../common/services/offlineStorage.service';
import { HttpRoutingService } from '../../common/services/httpRouting.service';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
/**
 * Class which is used to signin and signout the application.
 */
@Injectable()
export class AuthService {
  /**
   * Variable which is used to define the token of the current user.
   * @type {string}
   */
  // token: string;
  /**
   * Variable which is used to define currently activated menu in the bottom navbar.
   */
  currentActiveMenu = new EventEmitter<string>();
  /**
   * Variable which is used to define the propertes of the current activated user.
   */
  user = new BehaviorSubject<any>(null);
  errorMessages = new BehaviorSubject<any>(null);
  userRole: string;
  /**
  * Constructor used to inject the required services.
  * @param http To access the httpRouting service.
  * @param offlineStorage To get the offline database.
  * @param headerService To access and handle the httpHeaders in the requests.
  */
  constructor(private http: HttpRoutingService, private offlineStorage: OfflineStorageService,
    private headerService: HeaderService,
    private store: Store<any>) { }
  /**
   * Method which is used to signin the application for given login details.
   * @param email {string}
   * @param password {string}
   */
  signinUser(email: string, password: string, deviceName: string, deviceUid: string) {
    const data = {
      email: email,
      password: password,
      deviceName: deviceName,
      deviceUid: deviceUid
    };
    return this.http.postMethod('users/login', data).pipe(map((res) => {
      if (res && res['token']) {
        if (res['user']) {
          // Define the user model structure
          const user = {
            firstName: res['user'].firstName,
            lastName: res['user'].lastName,
            email: res['user'].email,
            userId: res['user'].userId,
            role: res['userRole'],
            userRoleId: res['user'].userRoleId,
            customerId: res['user'].customerId,
            id: res['user'].id,
            clientId: res['user'].clientId
          };
          this.userRole = user.role;
          if (user && user.role === 'Technician') {
            // If user role is technician then insert the logged in user details into offline database.
            this.offlineStorage.insertUser(user, password);
          }
          this.user.next(user);
          // Store the token and user datails into local storage.
          localStorage.setItem('currentUserToken', JSON.stringify({ token: res['token'], refreshToken: res['refreshToken'] }));
        }
      }
      return res;
    }));
  }
  /**
   * Method which is used to check whether the current user is authenticated or not.
   * @return {boolean}
   */
  isAuthenticated(): boolean {
    let token;
    // Get the currnt user details from the local storage.
    const currentUser = JSON.parse(localStorage.getItem('currentUserToken'));
    if (currentUser) {
      if (currentUser.token) {
        // To check whether the current user is authenticated or not in online.
        token = currentUser.token;
        return token != null;
      } else if (currentUser.isAuthenticated) {
        // To check whether the current user is authenticated or not in offline mode.
        const authenticated = currentUser.isAuthenticated;
        return authenticated;
      }
    }
  }
  /**
   * Method which is used to get the token of current user.
   * @return {string}
   */
  getToken(): string {
    let token;
    // Get the current user details from the local storage.
    const currentUser = JSON.parse(localStorage.getItem('currentUserToken'));
    if (currentUser) {
      token = currentUser.token;
    }
    return token;
  }
  /**
     * Method which is used to get the current user details.
     * @return {User}
     */
  getUser() {
    // Get the current user details from the Server.
    this.http.getMethod('getCurrentUser').subscribe((response) => {
      response['user'].role = response['user'].userRole ? response['user'].userRole.name : null;
      this.userRole = response['user'] ? response['user'].role : null;
      this.user.next(response['user']);
    });
  }
  /**
   * Method which is used to check whether the current user is admin or not.
   * @return {boolean}
   */
  isAdmin(): boolean {
    // To check whether the current user role is admin or not.
    if (this.userRole === 'Admin') {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Method which is used to signout the user.
   * @return {boolean}
   */
  logout() {
    // Remove the current user details from local storage.
    localStorage.removeItem('currentUserToken');

    // Remove the authentication details from the request.
    this.headerService.clearHeaders('default', 'Authorization');
    this.store.dispatch({ type: 'RESET_STATE' });
    return true;
  }
  /**
   * Method which is used to send email.
   * @param email which holds the entered email id.
   */
  sendEmail(email) {
    const emailDetails = {
      email: email
    };
    return this.http.postMethod('addEmail', emailDetails);
  }
  /**
   * Method which is used to get the JSON file.
   */
  getMessages() {
    this.http.getJsonData('/formErrorMessage.json').subscribe((res) => {
      const message = res ? res : [];
      this.errorMessages.next(message);
    });
  }
  getRefreshToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUserToken'));
    const refreshToken = currentUser ? currentUser.refreshToken : null;
    return this.http.postMethod('refreshToken', { refreshToken: refreshToken });
  }
}
