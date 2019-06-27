import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../../common/services/menu.service';

@Injectable()
export class AccessGuard {
  constructor(private menuService: MenuService, private router: Router, private activatedRoute: ActivatedRoute) { }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (state) {
      const isPermitted = this.menuService.checkMenuPermission(state.url, route.params);
      if (!isPermitted) {
        alert('You are not permitted to access this page!');
        this.router.navigate(['/signin']);
      }
      return isPermitted;
    }
  }
}
