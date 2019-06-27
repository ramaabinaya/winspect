import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Guard which is used to denied the access of the user except for admin.
 */
@Injectable()
export class AdminGuard {
  /**
   * Constructor used to inject the required services.
   * @param authService To find the user role.
   */
  constructor(private authService: AuthService) { }
  /**
   * Method which is used to decide whether the route can be activated or not.
   * @param next Which is used to define the future route that will be activated
   * @param state Which is used to define the future routerstate
   */
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

    let authorised: boolean;
    // check the current user is admin or not
    if (this.authService.isAdmin()) {
      authorised = true;
    } else {
      authorised = false;
      alert('Permission denied!');
    }
    return authorised;
  }
}
