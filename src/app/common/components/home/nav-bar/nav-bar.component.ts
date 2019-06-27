// Navbar Component which is used to display the navbar of the dashboard.
import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { OfflineStorageService } from '../../../services/offlineStorage.service';
import { User } from '../../../../user/model/user.model';
import { MenuService } from '../../../services/menu.service';
import { mergeMap, filter } from 'rxjs/operators';
/**
* Variable which is used to define the window screen.
* @type {any}
*/
declare let window: any;
/**
* Component which is used to display the navbar of the dashboard.
* And also navigate the user to the corresponding components.
*/
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit, OnDestroy {
  /**
  * Variable which is used to store the menus related to the current user.
  */
  menus;
  /**
   * Variable which is used to subscribe and unsubscribe.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which defines the role of the current user.
   * @type {User}
   */
  user: User;
  /**
   * Variable which is used to display the screen in mobile view
   */
  mobileView = false;
  /**
   * Variable which is used to define the navbar hide or not.
   */
  hideNav;
  /**
   * Variable which is used to define currently activated menu in the bottom navbar.
   */
  currentActiveMenu: string;
  /**
   * Variable which is used to define whether click the sync button or not in technician mobile view.
   */
  isSynchronize: boolean;
  navItems = [];
  profileIcon = {};
  /**
   * Component constructor used to inject the required services.
   * @param auth To get the current user information from the user login.
   * @param offlineStoageService To create tables and get synchorization completed percentage.
   */
  constructor(private auth: AuthService,
    private menuService: MenuService,
    private offlineStoageService: OfflineStorageService) { }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    // getmenulist from the server
    this.menus = this.menuService.getMenuPermissions();
    console.log('menu: ', this.menus);
    this.profileIcon = this.menus[this.menus.length - 1];
    console.log('profile Icon: ', this.profileIcon);
    // To get current user
    this.subscriptionObject['user'] = this.auth.user.pipe(filter((user) => {
      if (user) {
        this.user = user;
        console.log('user', this.user);
        return true;
      }
    }), mergeMap(() => {
      return this.offlineStoageService.applicationMode;
    })).subscribe((view) => {
      this.mobileView = view;
      if (this.mobileView) {
        const menuList = [];
        console.log('mobileView');
        let navItemOrder = [];
        if (this.user && this.user.role === 'Admin') {
          navItemOrder = ['Reports', 'Tasks', 'Templates', 'WindSite', 'Users'];
        } else {
          navItemOrder = ['Tasks', 'Reports', 'Templates'];
        }
        this.menus.forEach((item) => {
          if (item.subMenu.length > 0) {
            item.subMenu.forEach((value) => {
              if (value.subName !== null) {
                menuList.push(value);
              }
            });
          }
        });
        navItemOrder.forEach((item) => {
          menuList.forEach((value) => {
            if (item === value.subName) {
              this.navItems.push(value);
            }
          });
        });
        console.log('navItem: ', this.navItems);
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['focusMode'] = this.offlineStoageService.focusMode.subscribe((value) => {
      this.hideNav = value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (window && window.cordova) {
      this.subscriptionObject['syncButton'] = this.offlineStoageService.syncButtonPressed.subscribe((value) => {
        this.isSynchronize = value;
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
    this.subscriptionObject['currentActiveMenu'] = this.auth.currentActiveMenu.subscribe((activeMenu) => {
      this.currentActiveMenu = activeMenu;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to create database tables in device when sync button pressed.
   */
  createsqlitedb() {
    if (window && window.cordova) {
      console.log('Cordova Is Available!');
      this.offlineStoageService.createTables();
    } else {
      console.log('Cordova Not Available!');
    }
  }
  /**
   * Component ondestroy life cycle hook.
   * All subscriptions are unsubscribe here.
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
