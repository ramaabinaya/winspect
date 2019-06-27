
/**
 * Class service which is used to set,get and clear the headers for specific url request.
 */
export class HeaderService {
  /**
   * Variable which is used to define the header for url.
   */
  headers: { [url: string]: { [key: string]: string } } = {};

  /**
   * Method which is used to set the headers for the given url.
   * @param url {string} To define the url.
   * @param key {string} To define the  key.
   * @param value {string} To define the  value.
   */
  public setHeaders(url: string, key: string, value: string) {
    // To check the headers have given url as property
    if (this.headers && this.headers.hasOwnProperty(url)) {
      this.headers[url][key] = value;
    } else {
      this.headers[url] = { [key]: value };
    }
  }
  /**
   * Method which is used to clear the headers for the given url.
   * @param url {string} To define the url.
   * @param key {string} To define the  key.
   * @return {string}
   */
  public clearHeaders(url: string, key: string): string {
    // To check the headers have given url as property and key
    if (this.headers && this.headers.hasOwnProperty(url) && this.headers[url].hasOwnProperty(key)) {
      const val = this.headers[url][key];
      delete this.headers[url][key];
      return val;
    }
  }
  /**
   * Method which is used to get the headers for the given url.
   * @param url {string} To define the url of the request.
   */
  public getHeaders(url: string) {
    // To check the headers have given url as property
    if (this.headers && this.headers.hasOwnProperty(url)) {
      return this.headers[url];
    } else {
      return this.headers['default'];
    }
  }
}
