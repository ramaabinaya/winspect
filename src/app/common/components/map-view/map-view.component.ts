// map-view component, to display mapview for all windFarms
// and display report details when click on any wind turbines marker on map.
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SiteService } from '../../services/site.service';
import { ReportService } from '../../../shared/services/report.service';
import { UserStore } from '../../../user/store/user/user.store';
import { AuthService } from '../../../auth/services/auth.service';
import { ClientService } from '../../../client/services/client.service';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { ReportStore } from '../../../shared/store/report/report.store';
import { filter, mergeMap } from 'rxjs/operators';
import {MatomoCategories} from '../../../common/enum/categories';
import {MatomoActions} from '../../../common/enum/actions';
/**
 * Variable which is used to define the google map instance.
 * @type {any}
 */
declare var google: any;
/**
 * Component which is used to display the MapView of the desired sitelocation.
 */
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MapViewComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to define the image url.
   */
  imageUrlDb = environment.imageUrlDb;
  /**
   * Variable which is used to define whether the overlay clicked or not.
   * @type {boolean}
   */
  overlayClicked: boolean;
  /**
   * Variable which is used to define whether the master reports exist for display.
   * @type {boolean}
   */
  masterReportExist: boolean;
  /**
   * Variable which is used to define whether the child reports exist for display.
   * @type {boolean}
   */
  childReportExist: boolean;
  /**
   * Variable which is used to subscribe and unsubscribe.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to define the map instance.
   * @type {any}
   */
  map: any;
  /**
   * Variable which is used to define the report list.
   * @type {any}
   */
  recentReport: any;
  /**
   * Variable which is used to define the options of the mapview display.
   * @type {any}
   */
  options: any;
  /**
   * Variable which is used to decide whether the snapshot view of the blades needs to be displayed or not.
   * @type {boolean}
   */
  snapshotDisplay = false;
  /**
   * Variable which is used to define the overlay markers of the map.
   * @type {any[]}
   */
  overlays = [];
  /**
   * Variable which is used to define the infowindow of the overlay marker in the map.
   * @type {any}
   */
  infoWindow: any;
  /**
   * Variable which is used to define the available client's sitelocations.
   * @type {any[]}
   */
  siteLocations = [];
  /**
   * Variable which is used to define the filtered sitelocations in the search.
   * @type {any[]}
   */
  filteredLocations = [];
  /**
   * Variable which is used to define the windTurbines of the windfarms.
   * @type {any[]}
   */
  windTurbines = [];
  /**
   * Variable which is used to define the technicians list.
   * @type {any[]}
   */
  technicians = [];
  /**
   * Variable which is used to define the reports list.
   * @type {any[]}
   */
  reports = [];
  /**
   * Variable which is used to define the Id of the wind turbines.
   * @type {number}
   */
  windMillId: number;
  /**
   * Variable which is used to define the blade images that belongs to the selected report.
   * @type {any}
   */
  images: any;
  /**
   * Variable which is used to define the Id of the image in the list of images.
   * @type {number}
   */
  imgId = 0;
  /**
   * Variable which is used to define the current user role.
   */
  userRole: string;
  /**
   * Variable which is used to define the section name.
   * @type {string}
   */
  sectionName: string;
  /**
   * Variable which is used to define image list for particular section.
   * @type {any[]}
   */
  sectionImages = [];
  /**
   * Variable which is used to display the mobile view.
   */
  mobileView: boolean;
  /**
   * Variable which is used to store details of assignInspection Users table.
   */
  allreports: any;
  /**
  * Variable which is used to display the contents of the top nav bar.
  */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'WindSite',
    'rightIcon': '', 'rightheader': ''
  };
  /**
   * Variable which is used to refer the master reports table.
   */
  @ViewChild('masterReportRef') masterReportRef;
  /**
   * Variable which is used to refer the child reports table.
   */
  @ViewChild('childReportRef') childReportRef;
  /**
  * Variable which is used to search the master table column globally.
  */
  cols = [
    { field: 'id', header: 'id' },
    { field: 'name', header: 'name' },
    { field: 'modified', header: 'modified' },
    { field: 'userName', header: 'userName' }
  ];
  /**
 * Variable which is used to search the child table column globally.
 */
  col = [
    { field: 'bladeType', header: 'bladeType' },
    { field: 'id', header: 'id' },
    { field: 'name', header: 'name' },
    { field: 'modified', header: 'modified' },
    { field: 'userName', header: 'userName' }
  ];
  /**
   * Variable which is used to store the master the reports.
   */
  masterReports = [];
  /**
   * Variable which is used to store the child reports.
   */
  childReports = [];
  /**
   * Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'MAPVIEW';
  /**
   * Component constructor used to inject the required services and stores.
   * @param router To navigate the user to the desired routes.
   * @param siteService To get the client's sitelocations from the database.
   * @param reportService To get the reportDetails from the database.
   * @param userStore To get the user details from the application store.
   * @param auth To get the current user information from the user login.
   * @param clientService To get the client details from the database.
   * @param offlineStorage To get the report details from the offline database.
   * @param matomoService to perform metric operation on this component.
   * @param reportStore To get the reportdetails from the database.
   */
  constructor(private router: Router,
    private siteService: SiteService,
    private reportService: ReportService,
    private userStore: UserStore,
    private auth: AuthService,
    private clientService: ClientService,
    private offlineStorage: OfflineStorageService,
    private matomoService: MatomoService,
    private reportStore: ReportStore) { }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.userRole = this.auth.userRole;
    this.messages = this.auth.errorMessages;
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Windsite Map';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-user';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (this.userRole === 'Admin') {
      // To get all wind Farm list
      this.subscriptionObject['siteLocation'] = this.siteService.getWindFarmsAndTurbines().subscribe((response) => {
        if (response && response['windFarms']) {
          this.siteLocations = response['windFarms'];
          if (this.siteLocations && this.siteLocations[0]) {
            const site = this.siteLocations[0];
            // To set map center
            if (site && site.windTurbines && site.windTurbines[0]) {
              const latlngVar = new google.maps.LatLng(site.windTurbines[0].latitude, site.windTurbines[0].longitude);
              this.map.setCenter(latlngVar);
            }
          }
          this.addMarker();
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    } else {
      let windFarmId;
      this.subscriptionObject['client'] = this.clientService.getClientDetails()
        .pipe(filter((res) => {
          if (res && res['client']) {
            res['client'].find((client) => {
              if (client && client.clientWindFarms) {
                client.clientWindFarms.forEach((clientWind) => {
                  if (clientWind) {
                    windFarmId = clientWind.windFarmId;
                  }
                });
                return true;
              }
            });
          }
          return true;
        }), mergeMap(() => {
          return this.siteService.getWindFarms(windFarmId);
        })).subscribe((response) => {
          if (response && response['windFarms']) {
            this.siteLocations.push(response['windFarms']);
            if (this.siteLocations && this.siteLocations[0]) {
              const site = this.siteLocations[0];
              // To set map center
              if (site && site.windTurbines && site.windTurbines[0]) {
                const latlngVar = new google.maps.LatLng(site.windTurbines[0].latitude, site.windTurbines[0].longitude);
                this.map.setCenter(latlngVar);
              }
            }
            this.addMarker();
          }
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error: ', err.error.error);
          }
        });
    }
    this.options = {
      center: { lat: 46.0879, lng: -119.0687 },
      zoom: 10
    };
    this.infoWindow = new google.maps.InfoWindow();
  }
  /**
   * Method which is used to display markers for each wind turbine location in selected wind farms.
   * @param id {number} To define the selected windfarm id.
   */
  getWindTurbines(id: number) {
    this.overlays = [];
    const pointerIcon = {
      url: './assets/images/windfarmicon.png', // url
      scaledSize: new google.maps.Size(50, 50), // size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    for (const site of this.siteLocations) {
      if (site && site.id === id && site.windTurbines) {
        // To set map center for selected wind farm.
        this.windTurbines = this.windTurbines.concat(site.windTurbines);
        if (site.windTurbines.length > 0 && site.windTurbines[0]) {
          const latlngVar = new google.maps.LatLng(site.windTurbines[0].latitude, site.windTurbines[0].longitude);
          this.map.setCenter(latlngVar);
          this.map.setZoom(14);
        }
        site.windTurbines.filter((item) => {
          if (item.report && item.report.length > 0) {
            return true;
          } else {
            pointerIcon.url = './assets/images/bladeicongreen.png';
            const title = 'Id:' + item.id + ', ' + site.name;
            const latlng = new google.maps.LatLng(item.latitude, item.longitude);
            this.overlays.push(new google.maps.Marker({
              position: latlng,
              windTurbineId: item.id,
              title: title, icon: pointerIcon
            }));
          }
        }).map((filteredWindTurbine) => {
          const bladeType = [];
          const reports = filteredWindTurbine.report;
          if (reports && reports.length > 0) {
            reports.filter((report) => {
              return (report && report.bladeType !== 'M' && bladeType.indexOf(report.bladeType) === -1);
            }).map((filteredReport) => {
              bladeType.push(filteredReport.bladeType);
            });
          }
          if (bladeType.length >= 3) {
            pointerIcon.url = './assets/images/bladeiconred.png';
          } else if (bladeType.length === 2) {
            pointerIcon.url = './assets/images/bladeiconorange.png';
          } else if (bladeType.length === 1) {
            pointerIcon.url = './assets/images/bladeiconyellow.png';
          } else {
            pointerIcon.url = './assets/images/bladeicongreen.png';
          }
          const title = 'Id:' + filteredWindTurbine.id + ', ' + site.name;
          const latlng = new google.maps.LatLng(filteredWindTurbine.latitude, filteredWindTurbine.longitude);
          this.overlays.push(new google.maps.Marker({
            position: latlng,
            windTurbineId: filteredWindTurbine.id,
            title: title, icon: pointerIcon
          }));
        });
      } else {
        let latlng;
        // To set windfarm marker.
        pointerIcon.url = './assets/images/windfarmicon.png';
        if (site && site.windTurbines && site.windTurbines[0] && site.windTurbines[0].latitude && site.windTurbines[0].longitude) {
          latlng = new google.maps.LatLng(site.windTurbines[0].latitude, site.windTurbines[0].longitude);
        }
        const title = site.name;
        this.overlays.push(new google.maps.Marker({
          position: latlng,
          title: title,
          windFarm: true,
          windFarmId: site.id,
          icon: pointerIcon
        }));
      }
    }
  }
  /**
   * Method which is used to notify the map ready event.
   * @param event {any} Parameter which defines the on map ready event of the map.
   */
  onMapReady(event: any) {
    this.map = event.map;
  }
  /**
   * Method which is used to define the infowindow for the selected overlaymarker.
   * @param event {any} Parameter which is used to defines the selected overlay marker.
   */
  handleOverlayClick(event: any) {
    this.offlineStorage.focusMode.next(false);
    let users;
    const buttonName = 'Site Selection';
    this.matomoService.addEvent(MatomoCategories.Map, MatomoActions.Click, buttonName);
    this.subscriptionObject['userlist'] = this.userStore.users.subscribe((userlist) => {
      users = userlist ? userlist : [];
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    const isMarker = event.overlay.getTitle !== undefined;
    if (isMarker) {
      const isWindFarm = event.overlay.windFarm;
      if (isWindFarm) {
        // If windfarm marker is selected.
        this.getWindTurbines(event.overlay.windFarmId);
      } else {
        // If windturbine marker is selected.Then display info window.
        this.overlayClicked = true;
        const title = event.overlay.getTitle();
        this.infoWindow.setContent(' ' + title + '');
        this.infoWindow.open(event.map, event.overlay);
        this.windMillId = event.overlay.windTurbineId;
        // To get report list for given windTurbine id
        this.subscriptionObject['turbineReport'] = this.reportStore.assignInspectionUsers.pipe(filter((res) => {
          if (res) {
            this.allreports = res ? res : [];
            this.snapshotDisplay = false;
            this.reports = [];
          }
          if (this.allreports && this.allreports.length > 0) {
            this.allreports.filter((item) => {
              // tslint:disable-next-line:max-line-length
              return (item && item.report && item.report.active === 1 && item.report.windturbineId && item.report.windturbineId === this.windMillId);
            }).map((filteredReport) => {
              const userId = filteredReport.userId;
              if (users && users.length > 0) {
                users.find((user) => {
                  if (user && user.id === userId) {
                    filteredReport.report.userName = user.firstName + ' ' + user.lastName;
                    this.reports.push(filteredReport.report);
                    return true;
                  }
                });
              }
            });
          }
          this.masterReportExist = false;
          this.childReportExist = false;
          this.masterReports = [];
          this.childReports = [];
          if (this.reports && this.reports.length > 0) {
            this.reports.forEach((report, index) => {
              if (report.bladeType === 'M') {
                this.masterReportExist = true;
                this.masterReports.push(report);
              } else if (report.bladeType !== 'M') {
                this.childReportExist = true;
                this.childReports.push(report);
              }
            });
          }
          return true;
        }), mergeMap((res) => {
          const reportId = this.reports && this.reports.length > 0 ? this.reports[0].id : 0;
          return this.reportService.getReport(reportId);
        })).subscribe((resData) => {
          this.recentReport = resData ? resData['report'] : [];
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error: ', err.error.error);
          }
        });
      }
    }
  }
  /**
   * Method which is used to navigate the user to the desired routes.
   * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
   */
  onNavigate(key: string) {
    if (key === 'L') {
      this.router.navigate(['/app/inspection/notification']);
    }
  }
  /**
   * Method which is used to get the selected sitelocation and update the mapview with the current
   * selected sitelocation.
   * @param event {any} Parameter which is used to define the selected sitelocation in the search.
   */
  siteLocationSelected(event: any) {
    this.snapshotDisplay = false;
    this.masterReportExist = false;
    this.childReportExist = false;
    this.overlayClicked = false;
    for (const site of this.siteLocations) {
      if (site && site.name === event) {
        this.getWindTurbines(site.id);
        break;
      }
    }
  }
  /**
   * Method which is used to navigate to the report view of the selected report.
   * @param id {number} Parameter which is used to define the selected reportId in the report list.
   */
  onRowSelected(id: number) {
    this.router.navigate(['app/inspection', id, 'report', 0]);
  }
  /**
   * Method which is used to search the particular site from the available site locations.
   * @param event {any} Parameter which is used to define the site that is being searched.
   */
  search(event: any) {
    this.filteredLocations = [];
    for (const location of this.siteLocations) {
      if (location && event && event.query && location.name.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredLocations.push(location.name);
      }
    }
  }
  /**
   * Method which is used to display the snapshot view with the blade images of the report.
   * @param img {any} Parameter which defines the blade images of the selected report.
   */
  onClicked(img: any) {
    const linkName = 'Snap Shot View';
    this.matomoService.addEvent(MatomoCategories.Page, MatomoActions.Click, linkName);
    this.sectionImages = [];
    this.snapshotDisplay = true;
    this.images = img;
  }
  /**
   * Method which is used to store images to the corresponding Sections.
   * @param sectionName {string} To get the Selected section's name.
   */
  onSectionSelected(sectionName: string) {
    this.imgId = 0;
    this.sectionImages = [];
    this.images.filter((item) => {
      if (item && item.sectionName === sectionName) {
        const image = _.cloneDeep(item);
        image.imageLocation = (item.imageLocation).substring(1);
        image.imageLocation = this.imageUrlDb + image.imageLocation;
        this.sectionImages.push(image);
      }
    });
  }
  /**
   * Method used to display the next blade image when clicking the next arrow.
   * @param length {number} Method which defines the length of the blade images list.
   */
  moveNext(length: number) {
    if (this.imgId < length - 1) {
      this.imgId = this.imgId + 1;
    }
  }
  /**
   * Method used to display the previous blade image when clicking the back arrow.
   */
  movePrevious() {
    if (this.imgId > 0) {
      this.imgId = this.imgId - 1;
    }
  }
  /**
   * Method which is used to add new markers in map for selected site location.
   */
  addMarker() {
    for (const site of this.siteLocations) {
      if (site && site.windTurbines) {
        // To push into overlays array for creating markers
        if (site.windTurbines.length > 0 && site.windTurbines[0]) {
          const latlng = new google.maps.LatLng(site.windTurbines[0].latitude, site.windTurbines[0].longitude);
          const pointerIcon = './assets/images/windfarmicon.png';
          const title = site.name;
          this.overlays.push(new google.maps.Marker({
            position: latlng,
            title: title,
            windFarm: true,
            windFarmId: site.id,
            icon: pointerIcon
          }));
        }
      }
    }
  }
  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   * @param key {string} To define the table master or child.
   */
  filterGlobal(event, key) {
    if (key === 'master') {
      this.masterReportRef.filter(event, 'global', 'contains');
    }
    if (key === 'child') {
      this.childReportRef.filter(event, 'global', 'contains');
    }
  }
  /**
   * Component OnDestroy life cycle hook.
   * All subcriptions are unsubscribe here.
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
