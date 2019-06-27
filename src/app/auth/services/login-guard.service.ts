import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Guard which is used to decide the siginin route is activated or not.
 */
@Injectable()
export class LoginGuard implements CanActivate {

    /**
      * Constructor used to inject the required services.
      * @param authService To find the user is authenticated or not.
      */
    constructor(private authservice: AuthService) { }

    /**
    * Method which is used to decide whether the route can be activated or not.
    * @param next Which is used to define the future route that will be activated.
    * @param state Which is used to define the future routerstate.
    */
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        // To find the current user authentication.
        if (this.authservice.isAuthenticated()) {
            try {
                // If user is authenticated then logout the application.
                return this.authservice.logout();
            } catch (e) {
                return true;
            }
        }
        return true;
    }
}
