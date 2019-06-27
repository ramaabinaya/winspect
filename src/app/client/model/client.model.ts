/**
 * Class which is used to define the Client properties.
 * @type {Client}
 */
export class Client {
  /**
   * Public Variable which is used to define the name of the client.
   * @type {string}
   */
  public clientName: string;
  /**
   * Public Variable which is used to define the name of the site that belongs to the client.
   * @type {string}
   */
  public siteName: string;
  /**
   * Public Variable which is used to define the invoice of the client.
   * @type {string}
   */
  public invoice: string;
  /**
   * Public Variable which is used to define the reports that belongs to the client.
   * @type {any[]}
   */
  public reports: any[];
  /**
   * Public Variable which is used to define the status of the client.
   * @type {string}
   */
  public status: string;

  /**
   * Class constructor used to define the default parameters of the client class.
   * @param clientName To define the name of the client.
   * @param reports To define the reports belongs to that client.
   * @param status To define the status of the client.
   */
  constructor(clientName: string, reports: any[], status: string) {
    this.clientName = clientName;
    this.reports = reports;
    this.status = status;
  }
}
/**
 * Variable which is used to define the initial value of the client model.
 */
export const initialClientModel: Client[] = [];
