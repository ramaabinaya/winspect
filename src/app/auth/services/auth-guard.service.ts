import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HeaderService } from '../../common/services/header.service';
import { MenuService } from '../../common/services/menu.service';
import { map } from 'rxjs/operators/map';

/**
 * Guard which is used to denied the unauthorised access.
 */
@Injectable()
export class AuthGuard implements CanActivate {

    /**
       * Constructor used to inject the required services.
       * @param authService To find the user is authenticated or not.
       * @param headerService To set the http headers for the request.
       * @param router
       */
    constructor(private authservice: AuthService,
        private headerService: HeaderService,
        private menuService: MenuService,
        private router: Router) { }

    /**
       * Method which is used to decide whether the route can be activated or not.
       * @param next Which is used to define the future route that will be activated.
       * @param state Which is used to define the future routerstate.
       */
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // Check whether the current user is authenticated or not
        if (this.authservice.isAuthenticated()) {
            // Get the token of the current user.
            const token = this.authservice.getToken();
            if (token) {
                // Set the request headers with authentication details.
                this.headerService.setHeaders('default', 'Authorization', token);
            }
            try {
                return this.menuService.setMenuPermissions().pipe(map((res) => {
                    return true;
                }));
            } catch (err) {
                console.log('err', err);
                return false;
            }
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}
