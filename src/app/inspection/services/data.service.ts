// service which is used to create and download pdf
import { Injectable } from '@angular/core';
import { HttpRoutingService } from '../../common/services/httpRouting.service';
import { environment } from '../../../environments/environment';
/**
 * DataService is used to create and download the pdf for the selected report
 */
@Injectable()
export class DataService {
  /**
   * Variable which define the database's api url.
   * @type {string}
   */
  apiUrlDb = environment.apiUrldb;
  serverPort = environment.serverPort;
  /**
   * Service constructor to inject the other needed services here.
   * @param http Service to send the api request to the server.
   */
  constructor(private http: HttpRoutingService) {
  }
  /**
   * Method which is used to create the pdf.
   * @param index {number} The id of the report to which the pdf was created.
   * @return {Observable<Object>}
   */
  createPDF(index: number, emailDetails?) {
    const data = {
      reportId: index,
      to: emailDetails ? emailDetails.to : null,
      subject: emailDetails ? emailDetails.subject : null,
      message: emailDetails ? emailDetails.message : null
    };
    return this.http.postMethod('createpdf', data);
  }
  /**
   * Method which is used to download the created pdf.
   * @param index {number} The id of the report to which the pdf was created.
   * @return {Observable<Object>}
   */
  downoadPDF(filepath: string) {
    const serverPortCopy = ':' + this.serverPort + '/';
    const url = this.apiUrlDb.replace('/api/', serverPortCopy) + filepath;
    return url;
  }
}


