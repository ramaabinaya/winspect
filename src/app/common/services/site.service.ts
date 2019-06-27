import { Injectable } from '@angular/core';
import { HttpRoutingService } from './httpRouting.service';
/**
 * SiteService is used to get the windFarm details from the database by the api call.
 */
@Injectable()
export class SiteService {
  /**
   * Serive constructor which defines the needed services to inject here.
   * @param http To get the HttpRoutingService service.
   */
  constructor(private http: HttpRoutingService) { }
  /**
   * Method which is used to get all the wind farm details.
   */
  getAllWindFarms() {
    return this.http.getMethod('windfarmlist');
  }
  /**
   * Method which is used to get wind turbines list for the given wind farm id.
   * @param windMillId {number} which is used to define the wind farm id
   */
  getAllWindTurbines(windMillId: number) {
    const data = { windMillId: windMillId };
    return this.http.postMethod('windturbinelist', data);
  }
  /**
   * Method which is used to get all the wind farm details and wind turbine list.
   */
  getWindFarmsAndTurbines() {
    return this.http.getMethod('getwindfarmsandturbines');
  }
  /**
   *  Method which is used to get wind turbines list with report details, for the given windfarm id.
   * @param windFarmId {number} which is used to define the wind farm id
   */
  getWindFarms(windFarmId: number) {
    const data = { windFarmId: windFarmId };
    return this.http.postMethod('getwindfarms', data);
  }
  /**
   *  Method which is used to add wind farm details in the database.
   * @param FarmData {any} which is used to define the wind farm data
   */
  addWindFarm(FarmData: any) {
    return this.http.postMethod('addwindfarm', FarmData);
  }
  /**
   * Method which is used to add windfarm details by uploading the csv file.
   * @param windfarm {any} which is used to define the array of wind farm data
   */
  addMoreWindFarms(windfarm: any[]) {
    const data = { windfarm: windfarm };
    return this.http.postMethod('addwindfarms', data);
  }
  /**
   *  Method which is used to add wind turbine details in the database.
   * @param turbineData {any} which is used to define the wind turbine data
   */
  addWindTurbine(turbineData: any) {
    return this.http.postMethod('addwindturbine', turbineData);
  }
  /**
   * Method which is used to add windTurbine details by uploading the csv file.
   * @param windTurbine {any} which is used to define the array of windturbine data
   */
  addMoreWindTurbines(windTurbine: any[]) {
    const data = { windTurbine: windTurbine };
    return this.http.postMethod('addwindturbines', data);
  }
  /**
   * Method which is used to check whether the windfarm name already used or not.
   * @param windFarmName {string} The name of the windfarm to check.
   */
  checkWindFarmName(windFarmName: string) {
    const data = { windFarmName: windFarmName };
    return this.http.postMethod('checkWindFarmName', data);
  }
}
