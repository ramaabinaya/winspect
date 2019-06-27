// HttpRouting Service is used to get the routes using Http request,
// to get or set data from the database.
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
// httpRoting service is used to create the send request to the server by the api call.
@Injectable()
/**
 * HttpRouting Service is used to get the routes from the
 * specified services and to connect the database using,
 * http request.
*/
export class HttpRoutingService {
  /**
   * Variable which is used to define the url of the api from environment variable.
   * @type {string}
   */
  apiUrlDb = environment.apiUrldb;
  /**
   * Component constructor used to inject the required services.
   * @param httpClient To define the HttpClient.
   */
  constructor(private httpClient: HttpClient) { }
  /**
   * Method which is used to get the details from the server through the http request.
   * @param url {string} Url route to get the data from the server.
   */
  getMethod(url: string) {
    return this.httpClient.get(this.apiUrlDb + 'v1/' + url);
  }
  /**
   * Method which is used to get and update the details in the server through the http request.
   * @param url {string} Url route to get the data from the server.
   * @param data Data to be add or update in the server.
   */
  postMethod(url: string, data: any) {
    return this.httpClient.post(this.apiUrlDb + 'v1/' + url, data);
  }
  /**
   * Method which is used to get the JSON file.
   * @param url Which is used to define the file location.
   */
  getJsonData(url: string) {
    return this.httpClient.get('http://dev.winspect.centizenapps.com/assets' + url);
  }
}
