// service which is used to create pdf, image and emails
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Service which is used to make the report ready
 *  to export as pdf,image or send via email.
 */
@Injectable()
export class ExportService {
  /**
   * Service constructor which is used to inject the services that needed here.
   * @param geolocation To get the current location in latitudes and longitudes.
   */
  constructor(private geolocation: Geolocation) { }
  /**
   * Method which is used to get the current location coordinates.
   * @return {Observable<any>}
   */
  getLocation(): Observable<any> {
    const self = this;
    if (window && window['cordova']) {
      return Observable.create((observer: Observer<any>) => {
        this.geolocation.getCurrentPosition().then((resp) => {
          if (resp && resp.coords) {
            observer.next(resp.coords);
            observer.complete();
          } else {
            observer.complete();
          }
        }).catch((error) => {
          alert('Unable to get GPS Location');
          console.log('Error getting location', error);
        });
      });
    } else if (navigator.geolocation) {
      return Observable.create((observer: Observer<any>) => {
        navigator.geolocation.getCurrentPosition(function (response) {
          if (response && response.coords) {
            observer.next(response.coords);
            observer.complete();
          } else {
            observer.complete();
          }
        }, function () {
          alert('Unable to get GPS Location');
        }, {
            enableHighAccuracy: false
          });
      });
    }
  }
}
