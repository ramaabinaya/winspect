// InspectionService is used to get the list of inspections and assignedInspections from database
// and assign the inspections to the tecnicians.
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../common/services/httpRouting.service';
/**
 * Service which is used to get the inspection and assignedinspection details from the database
 * and also assign the inspections to the user.
 */
@Injectable()
export class InspectionService {
  /**
   * Service constructor to inject the other needed services here.
   * @param http Service to send the api request to the server.
   */
  constructor(private http: HttpRoutingService) { }
  /**
   * Method which is used to get the all inspections from the database.
   * @return {Observable<any>}
   */
  getInspections() {
    return this.http.getMethod('inspection').pipe(map((res) => {
      if (res && res['inspectionHeader']) {
        return res['inspectionHeader'];
      }
    }),
      catchError(err => {
        return err;
      }));
  }
  /**
   * Method which is used to assign the inspection to the technician.
   * @param inspection The Inspection which is to be assigned to the technician.
   * @return {Observable<Object>}
   */
  assignInspection(inspection) {
    return this.http.postMethod('assigninspection', inspection);
  }
  /**
   * Method which is used to assign the inspection to the users group.
   * @param inspection The Inspection which is to be assigned to the users group.
   */
  groupAssignInspection(inspection) {
    return this.http.postMethod('groupassigninspection', inspection);
  }
  /**
   * Method which is used to get the assignInspection detail of the particular assignedInspection
   * by the provided assignInspectionId.
   * @param assigndInspectionId {number} The index of the assignedInspection to get the details.
   * @return {Observable<Object>}
   */
  getAssignedInspectionDetails(assigndInspectionId: number) {
    const data = { assigndInspectionId: assigndInspectionId };
    return this.http.postMethod('assignedinspection', data);
  }
  /**
   * Method which is used to get the customer details from database
   */
  getCustomerDetails() {
    return this.http.getMethod('getcustomerdetails');
  }
}
