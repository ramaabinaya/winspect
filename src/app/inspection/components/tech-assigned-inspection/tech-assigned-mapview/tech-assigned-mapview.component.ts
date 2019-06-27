// TechAssignedMapviewComponent displays the mapview of the assigned windafarm with the windTurbines.
import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SiteService } from '../../../../common/services/site.service';
import { AssignInspectionUsers } from '../../../model/assignInspectionUsers.model';
import { InspectionService } from '../../../../shared/services/inspection.service';
import { InspectionStore } from '../../../../shared/store/inspection/inspection.store';
import { ReportService } from '../../../../shared/services/report.service';
import { OfflineStorageService } from '../../../../common/services/offlineStorage.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TechSafetyInspectionComponent } from './tech-safety-inspection/tech-safety-inspection.component';
import { DecimalPipe } from '@angular/common';
import { mergeMap } from 'rxjs/operators';
/**
 * window variable to access the window related methods.
 */
declare let window: any;
/**
 * google variable to access the google map functionality.
 */
declare let google: any;
/**
 * Compoenent which is used to display the mapview
 *  to technician with the assigned windFarm details.
 */
@Component({
  selector: 'app-tech-assigned-mapview',
  templateUrl: './tech-assigned-mapview.component.html',
  styleUrls: ['./tech-assigned-mapview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TechAssignedMapviewComponent implements OnInit, OnDestroy {
  /**
  * Variable which is used to store the subscription and unsubscribe the store     *subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to decide whether the network available or not.
   * @type {boolean}
   */
  disconnected: boolean;
  /**
   * Variable is used to define the index of the turbine which is selected for the report creation.
   * @type {boolean}
   */
  turbineId: number;
  /**
   * Variable which is used to define the index of the assignedInspection which is selected for report creation.
   * @type {number}
   */
  assignedInspectionId: number;
  /**
   * Variable is used to define the index of the inspectionHeader which is assigned for the technician.
   * @type {number}
   */
  inspectionHeaderId: number;
  /**
   * Variable is used to decide whether the dialogbox with the selected windturbine information.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to decide when the component navigated to the safetyInspectionComponent.
   *  @type {boolean}
   */
  navigated: boolean;
  /**
   * Variable which is used to define the options for the mapview.
   * @type {any}
   */
  options: any;
  /**
   * Variable which is used to define the title of the overlay markers in the mapview.
   * @type {any}
   */
  title: string;
  /**
   * Variable which is used to define the google map.
   * @type {any}
   */
  map;
  /**
   * Variable which is used to define the overlay markers of map.
   * @type {any[]}
   */
  overlays: any[];
  /**
   * Variable which is used to define the assignedInspectionuser details that selected.
   * @type {AssignInspectionUsers}
   */
  assignedInspection: AssignInspectionUsers;
  /**
   * Variable whichis used to define the list of windTurbines of the assigned windFarm.
   * @type {any[]}
   */
  siteLocations = [];
  /**
   * Variable which is used to define the infowindow of the windTurbine overlay markers.
   * @type {any}
   */
  infoWindow: any;
  /**
   * Variable which is used to define the inspection report type.
   * @type {string}
   */
  inspectionReportType: string;
  /**
   * Variable which is used to define the bladeType of the report.
   * @type {string}
   */
  bladeType: string;
  /**
   * Variable which is used to decide whether the dialog box for the
   * selection of bladetype needs to be displayed or not.
   * @type {boolean}
   */
  bladeView: boolean;
  /**
   * Refering the child component for accessing the child component's template.
   */
  @ViewChild(TechSafetyInspectionComponent) childComponent: TechSafetyInspectionComponent;
  /**
 * Variable which is used to decide whether to display the form view component or not.
 * @type {boolean}
 */
  mobileView: boolean;
  /**
  * Variable which is used to display contents on the mobile view top nav bar.
  */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Reports',
    'rightIcon': '', 'rightheader': ''
  };
  /**
   * Component constructor which is used to inject the needed services.
   * @param siteService To get the windFarm details from the database.
   * @param inspectionService To get the assigned inspection details from the database.
   * @param inspectionStore To get the insection details.
   * @param offlineStorage To implement mapview functionality in offline.
   * @param reportService To get the bladeType of the selected windTurbine.
   * @param route To get the current activated route information.
   */
  constructor(private siteService: SiteService,
    private inspectionService: InspectionService,
    private inspectionStore: InspectionStore,
    private router: Router,
    private offlineStorage: OfflineStorageService,
    private reportService: ReportService,
    private route: ActivatedRoute) {
  }
  /**
   * Component OnInit lifecycle hook.
   */
  ngOnInit() {
    this.offlineStorage.focusMode.next(true);
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Inspection';
        this.navbarDetails.leftheader = 'Cancel';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['routeParams'] = this.route.params.subscribe((params: Params) => {
      this.assignedInspectionId = +params['assignedInspectionId'];
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    if (!this.disconnected) {
      // AssignedInspection details got.
      this.subscriptionObject['getAssignedInspection'] = this.inspectionService.getAssignedInspectionDetails(this.assignedInspectionId)
        .pipe(mergeMap((res) => {
          if (res && res['assignedInspection']) {
            this.assignedInspection = res['assignedInspection'];
            if (this.assignedInspection) {
              this.inspectionHeaderId = this.assignedInspection.inspectionHeaderId;
              return this.inspectionStore.inspections;
            }
          }
        }), mergeMap(inspection => {
          if (inspection) {
            inspection.find((item) => {
              if (item && item.id === this.inspectionHeaderId) {
                this.inspectionReportType = item.inspectionReportType;
                return true;
              }
            });
          }
          return this.siteService.getAllWindTurbines(this.assignedInspection.windMillFormId);
        })).subscribe((response) => {
          if (response && response['windTurbines']) {
            this.siteLocations = response['windTurbines'];
            this.initOverlays();
          }
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error: ', err.error.error);
          }
        });
    }
    // Check whether cordova exist and the device network exist or not.
    if (window && window.cordova) {
      this.subscriptionObject['networkDisconnected'] = this.offlineStorage.networkDisconnected.subscribe((value) => {
        this.disconnected = value;
      });
      if (this.disconnected) {
        // If the device is offline, the selection of windTurbine from the assigned windFarm in offline.
        this.offlineStorage.getAssignedInspectiondetails(this.assignedInspectionId)
          .then((assignInspectionUsers) => {
            if (assignInspectionUsers) {
              let windMillFormId;
              for (let i = 0; i < assignInspectionUsers.rows.length; i++) {
                windMillFormId = assignInspectionUsers.rows.item(i).windMillFormId;
              }
              if (assignInspectionUsers.rows.item(0)) {
                this.inspectionHeaderId = assignInspectionUsers.rows.item(0).inspectionHeaderId;
                this.inspectionReportType = assignInspectionUsers.rows.item(0).inspectionReportType;
              }
              this.offlineStorage.getWindTurbines(windMillFormId)
                .then((windTurbines) => {
                  this.siteLocations = [];
                  for (let i = 0; i < windTurbines.rows.length; i++) {
                    this.siteLocations.push(windTurbines.rows.item(i));
                    this.siteLocations[i].latlng = windTurbines.rows.item(i).latitude + ', '
                      + windTurbines.rows.item(i).longitude;
                  }
                })
                .catch((e) => { console.log('failed to get windTurbines list data', e.message); });
              // });
            }
          })
          .catch((e) => console.log('error in mapview fetch', e.message));
      }
    }
    // provide option for the mapview.
    this.options = {
      center: { lat: 36.890257, lng: 30.707417 },
      zoom: 2
    };
    this.infoWindow = new google.maps.InfoWindow();
  }
  /**
   * Method which trigered when the map ready to load.
   * @param event To get the click events over the map.
   * @return {void}
   */
  onMapReady(event) {
    this.map = event.map;
  }
  /**
   * Method which is used to initialise the overlay markers on the map with the title.
   * @return {void}
   */
  initOverlays() {
    const pointerIcon = {
      url: './assets/images/bladeicongreen.png', // url
      scaledSize: new google.maps.Size(50, 50), // size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    this.overlays = [];
    if (this.siteLocations && this.siteLocations[0]) {
      // Set center coordinates for the mapview.
      const latlngVar = new google.maps.LatLng(this.siteLocations[0].latitude, this.siteLocations[0].longitude);
      this.map.setCenter(latlngVar);
      this.map.setZoom(this.map.getZoom() + 12);
      // set the overlay markers in the defined coordinates(latitude, lngitude)
      this.siteLocations.forEach((site, index) => {
        if (site && site.windFarm) {
          const title = 'Id:' + site.id + ',\nSite Name:' + site.windFarm.name;
          const latlng = new google.maps.LatLng(site.latitude, site.longitude);
          this.overlays.push(new google.maps.Marker({
            position: latlng,
            title: title, icon: pointerIcon
          }));
        }
      });
    }
  }
  /**
   * Method which is used to navigate to the create report part after selecting the
   * particular windTurbine.
   * @return {void}
   */
  // createReport() {
  //   this.display = false;
  //   this.navigated = true;
  // }
  onBladeSelected(bladeType: string) {
    this.bladeType = bladeType;
    this.bladeView = false;
    this.navigated = true;
  }
  /**
   * Method which is used to get the windTurbine details when it has been clicked.
   * @param event It holds the event with the overlay details that triggered.
   * @return {void}
   */
  handleOverlayClick(event) {
    const isMarker = event.overlay.getTitle !== undefined;
    if (isMarker) {
      this.title = event.overlay.getTitle();
      this.infoWindow.setContent(' ' + this.title + '');
      const start = this.title.indexOf(':') + 1;
      const end = this.title.indexOf(',');
      const index = this.title.substring(start, end);
      this.turbineId = Number(index);
      this.infoWindow.open(event.map, event.overlay);
      this.verifyReportExist();
      // this.subscriptionObject['getTurbineReport'] = this.reportService.getTurbineReport(this.turbineId).subscribe((response) => {
      //   if (response) {
      //     console.log('response', response);
      //     const reports = response['report'] ? response['report'] : [];
      //     this.verifyReportExist(reports);
      //   }
      // }, (err) => {
      //   if (err.error && err.error.error) {
      //     console.log('Error: ', err.error.error);
      //   }
      // });
    }
  }
  /**
   * Method which is used to check whether the Master report already exist or not.
   * @param reports {any} The list of reports for that turbine.
   * @return {void}
   */
  verifyReportExist() {
    console.log('this.report type', this.inspectionReportType);
    if (this.inspectionReportType === 'Master') {
      this.bladeType = 'M';
      this.navigated = true;
      // if (reports && reports.length > 0) {
      //   for (const id in reports) {
      //     if (reports[id] && reports[id].bladeType && reports[id].bladeType.indexOf(this.inspectionReportType) !== -1) {
      //       this.errorMsg = 'Master report already exist for this turbine id. Do you want to create another one?';
      //       this.displayMessage = true;
      //       break;
      //     }
      //   }
      //   if (!this.displayMessage) {
      //     this.navigated = true;
      //   }
      // } else {
      //   this.navigated = true;
      // }
    } else {
      this.bladeView = true;
    }
  }
  /**
   * Component OnDestroy lifecycle hook.
   * And unsubscribe all the subscriptions done in the component.
   * @return {void}
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
  /**
   * Method which is triggered when the windTurbine index selected from the dropdown of the windTurbinelist.
   * @param value Selected Value in the dropdown.
   * @return {void}
   */
  optionSelected(value) {
    this.turbineId = value ? value.id : null;
    this.offlineStorage.getTurbineBladeReportType(this.turbineId).then((report) => {
      const reports = [];
      for (let i = 0; i < report.rows.length; i++) {
        reports.push(report.rows.item(i));
      }
      this.verifyReportExist();
    }).catch((e) => {
      console.log('error in get turbine blde type', e.message);
    });
  }
  /**
  * Method which is used to cancel the inspection and navigate back to the asssign inspection page.
  * @param cancel local reference variable.
  */
  onCancelInspection() {
    this.router.navigate(['app/inspection/assignedinspection']);
    // After hiding the bottom navbar during the inspection to display that back.
    this.offlineStorage.focusMode.next(false);
  }
  /**
   * Method is used to inform the user when moving out from the page without saving.
   * @return {boolean}
   */
  canDeactivate(): boolean {
    if (this.navigated) {
      return this.childComponent.canDeactivate();
    } else {
      return true;
    }
  }
}
