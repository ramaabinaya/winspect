import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../common/services/httpRouting.service';
/**
 * Class which is used to get the client information from database.
 */
@Injectable()
export class ClientService {
  /**
   * Constructor which is used to inject the required services.
   * @param http To access the HttpRoutingService service.
   */
  constructor(private http: HttpRoutingService) {
  }
  /**
   * Method which is used to get the information about the logged in client.
   */
  getClientDetails() {
    return this.http.getMethod('getClientDetails');
  }
}
