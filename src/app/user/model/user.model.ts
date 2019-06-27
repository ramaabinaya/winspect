/**
 * Class which is used to declare user property
 */
export class User {
  /**
   * Variable which is used to define the unique id
   * @type {number}
  */
  public id: number;
  /**
   * Variable which is used to define the user email id
   * @type {string}
  */
  public email: string;
  /**
   * Variable which is used to define the user role
   * @type {string}
  */
  public role: string;
  /**
  * Variable which is used to define the user first name
  * @type {string}
 */
  public firstName: string;
  /**
   * Variable which is used to define the userlast  name
   * @type {string}
  */
  public lastName: string;
  /**
  * Variable which is used to define the user role id
  * @type {number}
 */
  public userRoleId: number;
  /**
   * Variable which is used to define the user customer id
   * @type {number}
  */
  public customerId: number;
  /**
   * Variable which is used to define the user status
   * @type {number}
  */
  public active: number;
  /**
   * Variable which is used to define the date of user created.
  */
  public created: any;
  /**
   * Variable which is used to define the date of user details last modified.
  */
  public modified: any;
  /**
  * Variable which is used to define the name of user.
  * @type {string}
 */
  public userName: string;
  /**
  * Variable which is used to define the clientId of user.
  * @type {number}
 */
  public clientId: number;
  /**
   * Class constructor with required user fields
   * @param email {string} To define the user email
   * @param role {string} To define the user role
   * @param firstName {string} To define the user firstname
   * @param lastNameto {string} define the user lastname
   * @param userRoleId {number} To define the user role id
   * @param customerId {number} To define the user customer id
   */
  constructor(email: string, role: string, firstName: string, lastName: string, userRoleId: number, customerId: number) {
    // this.userId = userId;
    this.email = email;
    this.role = role;
    this.firstName = firstName;
    this.lastName = this.lastName;
    this.userRoleId = userRoleId;
    this.customerId = customerId;
  }
}
/**
 * Variable which is used to define the initial value of the user model
 * @type {User[]}
 */
export const initialUserModel: User[] = null;

