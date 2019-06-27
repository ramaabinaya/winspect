// Component which is used to display user profile
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { AuthService } from '../../../auth/services/auth.service';
/**
 * Component which is used to display user profile.
 */
@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileViewComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to define a current user information.
   * @type {User}
   */
  user: User;
  /**
   * Variable which is used to store the subscription and unsubscribe the stored subscriptions.
   */
  subscriptionObject = {};
  /**
   * Component constructor to inject the required services.
   * @param auth To get the currently logged in user details.
   * @param router To navigate user to the desired routes.
   */
  constructor(private auth: AuthService,
    private router: Router) { }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['user'] = this.auth.user.subscribe((user) => {
      this.user = user;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to logout the user from the application.
   * @return {void}
   */
  logout() {
    this.router.navigate(['/signin']);
  }
  /**
   * Component OnDestroy life cycle hook.
   * And unsubscribe all the subscriptions in the component.
   */
  ngOnDestroy() {
    if (this.subscriptionObject) {
      for (const subscriptionProperty in this.subscriptionObject) {
        if (this.subscriptionObject[subscriptionProperty]) {
          this.subscriptionObject[subscriptionProperty].unsubscribe();
        }
      }
    }
  }
}
