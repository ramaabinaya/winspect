// Groups service which is used to get the list of groups, create new group, edit and remove group ect,.
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpRoutingService } from './httpRouting.service';
/**
 * GroupService is used to create the group of users into the database by the api call.
 */
@Injectable()
export class GroupService {
  /**
  * Serive constructor which defines the needed services to inject here.
  * @param http To get the HttpRoutingService service.
  */
  constructor(private http: HttpRoutingService) { }
  /**
   * Method Which is used to create the new group.
   * @param data The data whic is used to define the group details
   */
  createGroup(data) {
    return this.http.postMethod('createGroup', data)
      .pipe(map((res) => {
        return res['created'];
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to get all group details include members.
   */
  getAllGroups() {
    return this.http.getMethod('getAllGroups')
      .pipe(map((res) => {
        return res['groups'];
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to remove the group.
   * @param id The id which is define the selected group id.
   */
  removeGroup(id) {
    const data = { id: id };
    return this.http.postMethod('removeGroup', data)
      .pipe(map((res) => {
        return data;
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to edit the already created group.
   * @param editgroup The editgroup which is define the edited form details.
   */
  editGroup(editgroup) {
    return this.http.postMethod('editGroup', editgroup)
      .pipe(map((res) => {
        return editgroup;
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to add a new technician into group.
   * @param data Which is define the group id and technician Id.
   */
  addtoGroup(data) {
    return this.http.postMethod('addtoGroup', data)
      .pipe(map((res) => {
        return res['added'];
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to remove the member from the group.
   * @param groupId Which is define the group id.
   * @param memberId Which is define the technician id.
   */
  removeMember(dataDetails) {
    return this.http.postMethod('removeMember', dataDetails)
      .pipe(map((res) => {
        return dataDetails;
      }),
        catchError(err => {
          return err;
        }));
  }
  /**
   * Method which is used to get information about the devices which were connected currently.
   */
  getDeviceInfo() {
    return this.http.getMethod('getDeviceInfo');
  }
  /**
   * Method which is used to remove the connected device
   * @param deviceId which defines the device id
   */
  removeDevice(deviceId) {
    const data = { deviceId: deviceId };
    return this.http.postMethod('removeDevice', data);
  }
}
