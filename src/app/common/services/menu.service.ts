import { HttpRoutingService } from './httpRouting.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators';


@Injectable()
export class MenuService {
  userRole: string;
  menuList;
  constructor(private httpRoutingService: HttpRoutingService) { }

  getMenulist() {
    return this.httpRoutingService.getMethod('menulist');
  }
  getUserRole() {
    return this.userRole;
  }
  setMenuPermissions() {
    return this.httpRoutingService.getMethod('menulist').pipe(map((res) => {
      this.menuList = res['menu'];
      this.userRole = res['userRole'];
      return res;
    }), catchError((err) => {
      return err;
    }));
  }

  getMenuPermissions() {
    return this.menuList;
  }

  checkMenuPermission(path: string, params) {
    path = path.replace('%20', '');
    const routes = path.split('/');
    let routerLinkCopy;
    if (this.menuList) {
      const isPermitted = this.menuList.find((menu) => {
        if (menu.subMenu && menu.subMenu.length > 0) {
          return menu.subMenu.find((subMenu) => {
            if (subMenu.roleBasedMenus && subMenu.roleBasedMenus.length > 0) {
              return subMenu.roleBasedMenus.find((roleBasedSubMenu) => {
                routerLinkCopy = subMenu.routerLink;
                if (roleBasedSubMenu.permissionId === 1 && params) {
                  for (const key in params) {
                    if (key && params[key]) {
                      const keyCopy = ':' + key;
                      routerLinkCopy = routerLinkCopy.replace(keyCopy, params[key]);
                    }
                  }
                }
                if (routes && routes.length > 0 && roleBasedSubMenu.permissionId === 1) {
                  const dbPaths = routerLinkCopy.split('/');
                  if (dbPaths && (routes.length === dbPaths.length)) {
                    let count = 0;
                    routes.find((route, index) => {
                      if (route === dbPaths[index]) {
                        count++;
                      } else {
                        const number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                        if (number.includes(route[0]) && dbPaths.indexOf(':')) {
                          count++;
                        } else {
                          return true;
                        }
                      }
                    });
                    if (count === routes.length) {
                      return true;
                    }
                  }
                }
                if (roleBasedSubMenu.permissionId === 1 && routerLinkCopy.indexOf(path) !== -1) {
                  return true;
                }
              });
            }
          });
        } else if (menu && menu.routerLink && menu.roleBasedMenus) {
          return menu.roleBasedMenus.find((roleBasedMenu) => {
            routerLinkCopy = menu.routerLink;
            if (roleBasedMenu.permissionId === 1 && params) {
              for (const key in params) {
                if (key && params[key]) {
                  const keyCopy = ':' + key;
                  routerLinkCopy = routerLinkCopy.replace(keyCopy, params[key]);
                }
              }
            }
            if (routes && routes.length > 0 && roleBasedMenu.permissionId === 1) {
              const dbPaths = routerLinkCopy.split('/');
              if (dbPaths && (routes.length === dbPaths.length)) {
                let count = 0;
                routes.find((route, index) => {
                  if (route === dbPaths[index]) {
                    count++;
                  } else {
                    const number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                    if (number.includes(route[route.length - 1]) && dbPaths.indexOf(':')) {
                      count++;
                    } else {
                      return true;
                    }
                  }
                });
                if (count === routes.length) {
                  return true;
                }
              }
            }
            if (roleBasedMenu.permissionId === 1 && routerLinkCopy.indexOf(path) !== -1) {
              return true;
            }
          });
        }
      });
      return isPermitted ? true : false;
    } else {
      return false;
    }
  }
}
