
import { fromEvent as observableFromEvent, Subscription } from 'rxjs';
import { MatomoInjector } from 'ngx-matomo';
/**
 * app-component, which is used to manage the appearance of the statusbar and get the network status
 */
import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { HeaderService } from './common/services/header.service';
import { environment } from '../environments/environment';

import { OfflineStorageService } from './common/services/offlineStorage.service';
import { Network } from '@ionic-native/network';
import { AutoLogoutService } from '../app/auth/services/autoLogout.service';
import { AuthService } from './auth/services/auth.service';
import { ConfirmDialog } from 'primeng/primeng';

/**
 * Component which is used to manage the appearance of the statusbar and get the network status
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('cd') cd: ConfirmDialog;
  /*
   * Variable which is used to subscribe and unsubscribe the observables.
   */
  subscriptionObject = {};
  /**
   * Variable which is used to define the url of the api from environment variable
   */
  apiUrlDb = environment.apiUrldb;
  /**
   * Variable which is used to define screen width and height.
   */
  screenWidth: number;
  /**
   * Variable which is used to define the matomo metrics url.
   */
  matomoUrl = environment.matomoUrl;
  /**
   * Constructor which is used to inject the required services.
   * @param statusBar To manage the appearence of the statusbar.
   * @param headerService To set headers for the api request.
   * @param offlineStorage To create offline database.
   * @param elementRef To get native element.
   * @param network To find network connection status.
   * @param matomoInjector to initialize the tracking of user action.
   */
  constructor(private statusBar: StatusBar,
    private headerService: HeaderService,
    private offlineStorage: OfflineStorageService,
    private elementRef: ElementRef,
    private network: Network,
    private autoLogout: AutoLogoutService,
    private authService: AuthService,
    private matomoInjector: MatomoInjector) {
    this.screenWidth = window.screen.width;
  }
  /**
   * Component onInit life cycle hook.
   */
  ngOnInit() {
    // To initialize the logging in matomo metrics tool.
    this.matomoInjector.init(this.matomoUrl, 1);
    // To check device is ready or not
    this.subscriptionObject['deviceReady'] = observableFromEvent(document, 'deviceready').subscribe(() => {
      if (window && window['cordova']) {
        // let status bar overlay webview
        this.statusBar.overlaysWebView(true);
        // this.statusBar.styleBlackOpaque();
        // set status bar to black
        this.statusBar.backgroundColorByHexString('#3321a6');
        this.statusBar.styleLightContent();
        this.statusBar.show();
        this.offlineStorage.createDatabase();
      }
    });
    // To subscribe when network is disconnected
    this.subscriptionObject['networkDisconnect'] = this.network.onDisconnect().subscribe(() => {
      this.offlineStorage.networkDisconnected.next(true);
      console.log('disconnected!');
    });
    // To subscribe when network is connected
    this.subscriptionObject['networkConnect'] = this.network.onConnect().subscribe(() => {
      this.offlineStorage.networkDisconnected.next(false);
      console.log('connected!');
    });
    this.offlineStorage.networkDisconnected.next(!navigator.onLine);
    this.headerService.setHeaders(this.apiUrlDb + 'v1/users/login', 'content-type', 'application/json');
    this.authService.getMessages();
    this.autoLogout.dialogclose.subscribe((res) => {
      if (res) {
        this.cd.reject();
      }
    });
  }
  /**
   * Method which is used to change the background color depends on screenwidth.
   */
  ngAfterViewInit() {
    if (this.screenWidth > 768) {
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#f5f5f5';
    }
    if (this.screenWidth <= 768) {
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
    }
  }
  /**
   * Component onDestroy life cycle hook
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
