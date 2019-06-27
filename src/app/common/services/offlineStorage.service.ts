import { Injectable, EventEmitter } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs';
import { HttpRoutingService } from './httpRouting.service';
import { filter } from 'rxjs/internal/operators/filter';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
/**
 * Variable which is used to define the window screen.
 * @type {any}
 */
declare let window: any;

/**
 * Class which is used to create offline database and create tables and insert data into table.
 */
@Injectable()
export class OfflineStorageService {
  /**
   * Variable which is used to define the how much percentage synchronization completed.
   * @type {number}
   */
  syncedPercentage: number;
  /**
   * Variable which is used to emit the value to find the network is connected or not.
   * @type {boolean}
   */
  networkDisconnected = new BehaviorSubject<boolean>(false);
  /**
   * Variable which is used to emit the synchronization completed value.
   * @type {number}
   */
  changedsyncedPercentage = new BehaviorSubject<number>(0);
  /**
   * Variable which is used to check the app is running in device or not.
   * @type {boolean}
   */
  applicationMode = new BehaviorSubject<boolean>(false);
  /**
   * Variable which is used to check the navbar hide or not.
   * @type {boolean}
   */
  focusMode = new BehaviorSubject<any>(false);
  /**
   * Variable which is used to define the sqlite database object.
   * @type {any}
   */
  db = null;
  syncButtonPressed = new EventEmitter<boolean>();
  /**
   * Constructor which is used to inject the required service.
   * @param sqlite To create and access the sqlite database.
   * @param http To access the HttpRoutingService service.
   */
  constructor(private sqlite: SQLite, private http: HttpRoutingService) { }

  /**
   * Method which is used to create sqlite database in device.
   */
  createDatabase() {
    // To check whether the cordova is availabe or not.
    if (window && window.cordova) {
      console.log('Cordova Is Available!');
      // To crete sqlite database with windInspection name and default location.
      this.sqlite.create({
        name: 'windInspection.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.db = db;
        console.log('db created successfully');
        this.createUserTable();
        // To run the following query to perform the cascade deletion
        this.db.executeSql('PRAGMA foreign_keys = ON;', [], function (res) {
          console.log(JSON.stringify(res));
        });
      })
        .catch((e) => console.log('error', e.message));
    }
  }

  /**
   * Method which is used to create user table for offline database.
   */
  createUserTable() {
    // To check the database is opened or not.
    if (this.db) {
      this.db.executeSql(`CREATE TABLE IF NOT EXISTS userAccount (id INTEGER NOT NULL PRIMARY KEY,
        customerId INTEGER NOT NULL ,userRoleId INTEGER NOT NULL,
        firstName VARCHAR(45) NOT NULL,lastName VARCHAR(45) NOT NULL,email VARCHAR(45) UNIQUE NOT NULL,
        password VARCHAR(20) NOT NULL,active INTEGER NOT NULL DEFAULT 1,role VARCHAR(20) NOT NULL,
        created DATETIME NULL DEFAULT current_timestamp,modified DATETIME NULL DEFAULT current_timestamp)`, {})
        .then(() => console.log('Executed SQL userAccount'))
        .catch((e) => console.log('error catched in userAccount', e.message));
    }
  }

  /**
   * Method which is used to insert new user into sqlite user table.
   * @param user {any} which is used to define current user.
   * @param password {string} which is used to define password.
   */
  insertUser(user: any, password: string) {
    if (this.db) {
      this.deleteUserDetails();
      if (user) {
        // To check the current user role
        if (user.role === 'Technician') {
          // To insert a new user
          this.db.executeSql(`INSERT INTO userAccount (id, customerId, userRoleId, firstName, lastName, email,password,
            active,role) VALUES (?,?,?,?,?,?,?,?,?)`, [user.id, user.customerId, user.userRoleId, user.firstName,
            user.lastName, user.email, password, 1, user.role]).then((insertedUser) => {
              console.log('user saved into normal db!', JSON.stringify(user), JSON.stringify(insertedUser.rows.item(0)));
            }).catch((e) => {
              console.log('error got in user detail save!', e.message);
            });
        }
      }
    }
  }

  /**
   * Method which is used to create aws database table into offline database.
   */
  createTables() {
    this.syncButtonPressed.emit(true);
    console.log('sync per init', this.syncedPercentage);
    this.deleteDatabase();
    if (window && window.cordova) {
      console.log('Cordova Is Available!');
      if (this.db) {
        // To create customer table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS customer(id INTEGER NOT NULL PRIMARY KEY,
          name TEXT NOT NULL, active TINYINT NOT NULL DEFAULT 1,
          created DATE NOT NULL DEFAULT current_timestamp, modified DATE NOT NULL DEFAULT current_timestamp)`, {})
          .then(() => {
            console.log('Executed SQL customer');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create inspectionHeader table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS inspectionHeader(id INTEGER NOT NULL PRIMARY KEY,
          customerId INTEGER NOT NULL,name TEXT NOT NULL, instructions TEXT NULL, fileAttachment TEXT NULL,
          created DATETIME NOT NULL, modified DATETIME NOT NULL,
          isForm INTEGER DEFAULT O,inspectionReportType TEXT NOT NULL DEFAULT "M", isActive INTEGER NOT NULL DEFAULT 1)`, {})
          .then(() => {
            console.log('Executed SQL inspectionHeader');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create windFarm table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS windFarm(id INTEGER NOT NULL PRIMARY KEY, customerId INTEGER NOT NULL,
          name TEXT NOT NULL,country TEXT NOT NULL, state TEXT NOT NULL,active INTEGER DEFAULT 1 NOT NULL,
          created DATETIME NOT NULL DEFAULT current_timestamp,modified DATETIME NOT NULL DEFAULT current_timestamp)`, {})
          .then(() => {
            console.log('Executed SQL windFarm');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create windTurbines table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS windTurbines(id INTEGER NOT NULL PRIMARY KEY, buildYear INTEGER NOT NULL ,
          longitude DECIMAL NOT NULL , latitude DECIMAL NOT NULL , windMillId INTEGER NOT NULL,
          created DATETIME NOT NULL DEFAULT current_timestamp,modified DATETIME NOT NULL DEFAULT current_timestamp,
          FOREIGN KEY (windMillId) REFERENCES windFarm (id))`, {})
          .then(() => {
            console.log('Executed SQL windTurbines');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create InspectionStatus table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS InspectionStatus(id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL UNIQUE,
          created DATETIME NOT NULL DEFAULT current_timestamp, modified DATETIME  NOT NULL DEFAULT current_timestamp)`, {})
          .then(() => {
            console.log('Executed SQL InspectionStatus');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create assignInspectionUsers table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS assignInspectionUsers(id INTEGER NOT NULL PRIMARY KEY,userId INTEGER NOT NULL,
          inspectionHeaderId INTEGER NOT NULL,inspectionStatusId INTEGER NOT NULL,updateIndicator TEXT DEFAULT "N",comments TEXT NULL,
          windMillFormId INTEGER NOT NULL,attachments TEXT NULL,dueDate DATE NULL,created DATE NOT NULL,
          modified DATE NOT NULL,FOREIGN KEY (inspectionHeaderId) REFERENCES inspectionHeader (id),
          FOREIGN KEY (inspectionStatusId) REFERENCES InspectionStatus (id),FOREIGN KEY (windMillFormId) REFERENCES windFarm (id))`, {})
          .then(() => {
            console.log('Executed SQL assignInspectionUsers');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create inspectionSections table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS inspectionSections(id INTEGER NOT NULL PRIMARY KEY,
          inspectionHeaderId INTEGER NOT NULL,sectionName TEXT NOT NULL,sectionDesc TEXT DEFAULT NULL,condition TEXT DEFAULT NULL,
          sectionState TEXT DEFAULT NULL,showPrev INTEGER,showNext INTEGER, created DATETIME NOT NULL DEFAULT current_timestamp,
          modified DATETIME NOT NULL DEFAULT current_timestamp,isCommon INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (inspectionHeaderId) REFERENCES inspectionHeader (id))`, {})
          .then(() => {
            console.log('Executed SQL inspectionSections');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create inputTypes table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS inputTypes(id INTEGER NOT NULL PRIMARY KEY, inputTypeName TEXT UNIQUE  NOT NULL,
          created DATETIME NOT NULL DEFAULT current_timestamp, modified DATETIME NOT NULL DEFAULT current_timestamp,
          displayName TEXT NULL, iconName TEXT NULL, description TEXT NULL)`, {})
          .then(() => {
            console.log('Executed SQL inputTypes');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create inputTypesProperties table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS inputTypesProperties(id INTEGER NOT NULL,
          propertyId INTEGER NOT NULL PRIMARY KEY,created DATETIME NOT NULL DEFAULT current_timestamp,filterable INTEGER DEFAULT 0,
          modified DATETIME NOT NULL DEFAULT current_timestamp, autoFocus INTEGER NOT NULL DEFAULT 0, cols INTEGER NULL,
          focusedDate DATETIME NULL,format VARCHAR(80) NULL, inline INTEGER DEFAULT 0, inputType VARCHAR(45) NULL, label VARCHAR(45) NULL,
          legend VARCHAR(45) NULL,mask VARCHAR(45) NULL, max INTEGER NULL, meridian INTEGER DEFAULT 0, min INTEGER NULL,
          mutliple INTEGER DEFAULT 0,pattern VARCHAR(45) NULL, placeHolder VARCHAR(45) NULL,prefix VARCHAR(45) NULL,
          readOnly INTEGER DEFAULT 0, rows INTEGER NULL,showSeconds INTEGER DEFAULT 0, step INTEGER NULL,suffix VARCHAR(45) NULL,
          toggleIcon INTEGER DEFAULT 0, vertical INTEGER DEFAULT 0,wrap VARCHAR(45) NULL, disabled INTEGER NULL ,hasMethod INTEGER NULL,
          buttonType  VARCHAR(100), value VARCHAR(110), hidden INTEGER DEFAULT 0, fieldId INTEGER NULL, element VARCHAR(110) NULL) `, {})
          .then(() => {
            console.log('Executed SQL inputTypesProperties');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch((e) => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create optionGroups table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS optionGroups(id INTEGER NOT NULL PRIMARY KEY, optionGroupName TEXT UNIQUE NOT NULL,
         created DATETIME NOT NULL DEFAULT current_timestamp, modified DATETIME NOT NULL DEFAULT current_timestamp)`, {})
          .then(() => {
            console.log('Executed SQL optionGroups');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create questions table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS questions(id INTEGER NOT NULL PRIMARY KEY, inspectionSectionId INTEGER NOT NULL,
          inputTypePropertyId INTEGER NULL, inputTypeId INTEGER NULL,questionName TEXT,questionRequiredYN INTEGER,
          optionGroupId INTEGER NULL,allowMultipleOptionsAnswerYN INTEGER NOT NULL DEFAULT 0,answerRequiredYN INTEGER NOT NULL DEFAULT 1,
          subCategory INTEGER NULL DEFAULT 0,dynamicFieldQuestionId INTEGER NULL,
          displayPositionIndex INTEGER NOT NULL, created DATETIME NOT NULL DEFAULT current_timestamp,modified DATETIME NOT NULL
          DEFAULT current_timestamp,FOREIGN KEY (inputTypePropertyId) REFERENCES inputTypesProperties (propertyId),
          FOREIGN KEY (inputTypeId) REFERENCES inputTypes (id),FOREIGN KEY (inspectionSectionId) REFERENCES inspectionSections (id),
          FOREIGN KEY (optionGroupId) REFERENCES optionGroups (id))`, {})
          .then(() => {
            console.log('Executed SQL questions');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create optionChoices table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS optionChoices(id INTEGER NOT NULL PRIMARY KEY, optionGroupId INTEGER NOT NULL,
        optionChoiceName TEXT NOT NULL,optionChoicesValue TEXT NULL, created DATETIME NOT NULL DEFAULT current_timestamp,
        modified DATETIME NOT NULL DEFAULT current_timestamp, FOREIGN KEY (optionGroupId) REFERENCES optionGroups (id))`, {})
          .then(() => {
            console.log('Executed SQL optionChoices');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });

        // To create report table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS report(id INTEGER NOT NULL PRIMARY KEY,
          assignedInspectionUserId INTEGER NOT NULL,windturbineId INTEGER NOT NULL,updateIndicator TEXT DEFAULT "N",
          bladeType TEXT NOT NULL DEFAULT "M",name VARCHAR(45) UNIQUE NOT NULL,active TINYINT NOT NULL DEFAULT 1,
          created DATETIME NOT NULL,
          modified DATETIME NOT NULL,
          FOREIGN KEY (assignedInspectionUserId) REFERENCES assignInspectionUsers (id) ON DELETE CASCADE ,
          FOREIGN KEY (windTurbineId) REFERENCES windTurbines (id))`, {})
          .then(() => {
            console.log('Executed SQL report');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch((e) => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create answers table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS answers(Id INTEGER NOT NULL PRIMARY KEY,updateIndicator TEXT DEFAULT "N",
         reportId INTEGER NOT NULL, questionId INTEGER NOT NULL, answer_numeric INTEGER NULL, answer_text TEXT NULL, answer_yn INTEGER NULL,
         created DATETIME NOT NULL DEFAULT current_timestamp, modified DATETIME NOT NULL DEFAULT current_timestamp,value VARCHAR(45) NULL,
         elementArray INTEGER NULL,FOREIGN KEY (questionId) REFERENCES questions (id),
         FOREIGN KEY (reportId) REFERENCES report (id)ON DELETE CASCADE)`, {}).then(() => {
            console.log('Executed SQL answers');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create imageAnswers table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS imageAnswers(id INTEGER NOT NULL PRIMARY KEY,updateIndicator TEXT DEFAULT "N",
        answerId INTEGER NOT NULL, sectionName TEXT NOT NULL,imageFileUri TEXT NULL,imageLocation TEXT NULL,description TEXT NULL,
        thumnailImage TEXT NULL,
        created DATETIME NOT NULL DEFAULT current_timestamp, modified DATETIME NOT NULL DEFAULT current_timestamp,
        FOREIGN KEY (answerId) REFERENCES answers (Id) ON DELETE CASCADE)`, {})
          .then(() => {
            console.log('Executed SQL imageAnswers');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create optionChoiceAnswers table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS optionChoiceAnswers(id INTEGER NOT NULL PRIMARY KEY,updateIndicator TEXT DEFAULT "N",
        answerId INTEGER NOT NULL,optionChoiceId INTEGER NOT NULL, created DATETIME NOT NULL DEFAULT current_timestamp,
        modified DATETIME NOT NULL DEFAULT current_timestamp,FOREIGN KEY (optionChoiceId) REFERENCES optionChoices (id),
        FOREIGN KEY (answerId) REFERENCES answers (Id) ON DELETE CASCADE)`, {})
          .then(() => {
            console.log('Executed SQL optionChoiceAnswers');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch(e => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create userRole table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS userRole (id INTEGER NOT NULL PRIMARY KEY,name VARCHAR(60) UNIQUE NOT NULL,
          descripton VARCHAR(100) NULL,created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`, {})
          .then(() => {
            console.log('Executed SQL userrole');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          })
          .catch((e) => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
        // To create validators table
        this.db.executeSql(`CREATE TABLE IF NOT EXISTS validators (id INTEGER NOT NULL PRIMARY KEY,questionId INTEGER NOT NULL,
        keyName VARCHAR(20) NOT NULL,keyValue VARCHAR(20) NOT NULL,errorMessage VARCHAR(200) NOT NULL,
        created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`, {})
          .then(() => {
            console.log('Executed SQL validators');
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
            this.insertData();
          })
          .catch((e) => {
            console.log('error catched', e.message);
            this.syncedPercentage += 2;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          });
      }
    } else {
      console.log('Cordova Not Available!');
    }
  }

  /**
   * Method which is used to insert logged in user data from aws database to offline database.
   */
  insertData() {
    if (this.db) {
      // To get all customer details from the aws database.
      this.http.getMethod('getcustomerdetails').subscribe((res) => {
        if (res && res['customerdetails'] && res['customerdetails'].length > 0) {
          res['customerdetails'].forEach((customer, customerId) => {
            if (customer && customer.id) {
              // To insert customer data
              this.db.executeSql('INSERT OR IGNORE INTO customer (id,name,active,created,modified) VALUES (?,?,?,?,?)',
                [customer.id, customer.name, customer.active, customer.created, customer.modified]).
                then(() => {
                  console.log('data inserted properly in customer!');
                  this.syncedPercentage += 1;
                  this.changedsyncedPercentage.next(this.syncedPercentage);
                })
                .catch((e) => {
                  console.log('error catched', e.message);
                  this.syncedPercentage += 1;
                  this.changedsyncedPercentage.next(this.syncedPercentage);
                });
            }
          });
        }

      }, (err) => {
        console.log('error in get customer details', err);
      });
      // To get all windfarm details from the aws database.
      this.http.getMethod('windfarmlist').subscribe((res) => {
        if (res && res['windFarms'] && res['windFarms'].length > 0) {
          res['windFarms'].forEach((windFarm, windFarmId) => {
            if (windFarm && windFarm.id) {
              // To insert windfarm data
              this.db.executeSql('INSERT OR IGNORE INTO windFarm (id,customerId,name,country,state,active) VALUES (?,?,?,?,?,?)',
                [windFarm.id, windFarm.customerId, windFarm.name, windFarm.country, windFarm.state, windFarm.active]).
                then(() => {
                  console.log('data inserted properly in windfarms!');
                  if (res['windFarms'].length - 1 === windFarmId) {
                    this.syncedPercentage += 3;
                    this.changedsyncedPercentage.next(this.syncedPercentage);
                  }
                })
                .catch((e) => {
                  console.log('error catched', e.message);
                  if (res['windFarms'].length - 1 === windFarmId) {
                    this.syncedPercentage += 3;
                    this.changedsyncedPercentage.next(this.syncedPercentage);
                  }
                });
            } else if (res['windFarms'].length - 1 === windFarmId) {
              this.syncedPercentage += 3;
              this.changedsyncedPercentage.next(this.syncedPercentage);
            }
          });
        } else {
          this.syncedPercentage += 3;
          this.changedsyncedPercentage.next(this.syncedPercentage);
        }

      }, (err) => {
        console.log('error in get windFarms', err);
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      // To get all windturbine  list
      this.http.getMethod('getwindfarmsandturbines').subscribe((res) => {
        if (res && res['windFarms']) {
          res['windFarms'].forEach((windfarms, windFarmId) => {
            if (windfarms) {
              if (windfarms.windTurbines && windfarms.windTurbines.length > 0) {
                windfarms.windTurbines.forEach((windTurbines, windTurbinesId) => {
                  if (windTurbines) {
                    // To insert data into windturbine table
                    this.db.executeSql('INSERT INTO windTurbines (id, buildYear, longitude, latitude, windMillId) VALUES (?,?,?,?,?)',
                      [windTurbines.id, windTurbines.buildYear, windTurbines.longitude, windTurbines.latitude, windTurbines.windMillId]).
                      then(() => {
                        console.log('data inserted properly in windturbines!');
                        // tslint:disable-next-line:max-line-length
                        console.log('windturbinesLength: ', res['windFarms'].length - 1, windFarmId, windfarms.windTurbines.length - 1, windTurbinesId);
                        if (res['windFarms'].length - 1 === windFarmId && windfarms.windTurbines.length - 1 === windTurbinesId) {
                          this.syncedPercentage += 3;
                          this.changedsyncedPercentage.next(this.syncedPercentage);
                        }
                      })
                      .catch((e) => {
                        console.log('error catched in windturbines', e.message);
                        if (res['windFarms'].length - 1 === windFarmId && windfarms.windTurbines.length - 1 === windTurbinesId) {
                          this.syncedPercentage += 3;
                          this.changedsyncedPercentage.next(this.syncedPercentage);
                        }
                      });
                  }
                });
              } else if (res['windFarms'].length - 1 === windFarmId) {
                this.syncedPercentage += 3;
                this.changedsyncedPercentage.next(this.syncedPercentage);
              }
            } else if (res['windFarms'].length - 1 === windFarmId) {
              this.syncedPercentage += 3;
              this.changedsyncedPercentage.next(this.syncedPercentage);
            }
          });

        } else {
          this.syncedPercentage += 3;
          this.changedsyncedPercentage.next(this.syncedPercentage);
        }
      }, (err) => {
        console.log('error in get windTurbines', err);
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      // To get inspectionstatus details
      this.http.getMethod('getInspectionStatus').subscribe((res) => {
        if (res && res['inspectionStatus'] && res['inspectionStatus'].length > 0) {
          res['inspectionStatus'].forEach((inspectionStatus, inspectionStatusId) => {
            if (inspectionStatus) {
              // To insert data into inspectionStatus table
              this.db.executeSql('INSERT INTO InspectionStatus(id,name) VALUES (?,?)', [inspectionStatus.id, inspectionStatus.name])
                .then(() => {
                  console.log('data inserted properly in inspectionStatus!');
                  if (res['inspectionStatus'].length - 1 === inspectionStatusId) {
                    this.syncedPercentage += 2;
                    this.changedsyncedPercentage.next(this.syncedPercentage);
                  }
                })
                .catch((e) => {
                  console.log('error catched', e.message);
                  if (res['inspectionStatus'].length - 1 === inspectionStatusId) {
                    this.syncedPercentage += 2;
                    this.changedsyncedPercentage.next(this.syncedPercentage);
                  }
                });
            }
          });

        } else {
          this.syncedPercentage += 2;
          this.changedsyncedPercentage.next(this.syncedPercentage);
        }
      }, (err) => {
        console.log('error in get inspectionStatus', err);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });

      // To  get inputtypes details
      this.http.getMethod('getAllInputTypes').subscribe((res) => {
        if (res && res['inputTypes'] && res['inputTypes'].length > 0) {
          res['inputTypes'].forEach((inputType, inputTypeId) => {
            if (inputType) {
              // To insert data into inputtypes table
              this.db.executeSql('INSERT INTO inputTypes(id,inputTypeName,displayName,iconName,description) VALUES (?,?,?,?,?)',
                [inputType.id, inputType.inputTypeName, inputType.displayName, inputType.iconName, inputType.description])
                .then((response) => {
                  console.log('inputtypes inserted proerly');
                  if (res['inputTypes'].length - 1 === inputTypeId) {
                    this.syncedPercentage += 3;
                    this.changedsyncedPercentage.next(this.syncedPercentage);
                  }
                })
                .catch((e) => {
                  console.log('failed to insert input type', e.message);
                  if (res['inputTypes'].length - 1 === inputTypeId) {
                    this.syncedPercentage += 3;
                    this.changedsyncedPercentage.next(this.syncedPercentage);
                  }
                });
            }

          });
        } else {
          this.syncedPercentage += 3;
          this.changedsyncedPercentage.next(this.syncedPercentage);
        }
      }, (err) => {
        console.log('error in get inputTypes', err);
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      // To get inputTypesProperties details
      this.http.getMethod('getAllInputTypeProperties').subscribe((res) => {
        if (res && res['inputTypeProperties'] && res['inputTypeProperties'].length > 0) {
          res['inputTypeProperties'].forEach((inputTypesProperty, inputTypesPropertyId) => {
            if (inputTypesProperty) {
              // To insert data into inputTypesProperties table
              this.db.executeSql(`INSERT INTO inputTypesProperties(id,propertyId,autoFocus,cols,filterable,focusedDate,format,inline,
                inputType,label,legend,mask,max,meridian,min,mutliple,pattern,placeHolder,prefix,readOnly,rows,showSeconds,step,suffix,
                toggleIcon,vertical,wrap,disabled,hasMethod,buttonType,value,hidden,fieldId,element) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [inputTypesProperty.id, inputTypesProperty.propertyId,
                inputTypesProperty.autoFocus, inputTypesProperty.cols, inputTypesProperty.filterable, inputTypesProperty.focusedDate,
                inputTypesProperty.format, inputTypesProperty.inline, inputTypesProperty.inputType, inputTypesProperty.label,
                inputTypesProperty.legend, inputTypesProperty.mask, inputTypesProperty.max, inputTypesProperty.meridian,
                inputTypesProperty.min, inputTypesProperty.mutliple, inputTypesProperty.pattern, inputTypesProperty.placeHolder,
                inputTypesProperty.prefix, inputTypesProperty.readOnly, inputTypesProperty.rows, inputTypesProperty.showSeconds,
                inputTypesProperty.step, inputTypesProperty.suffix, inputTypesProperty.toggleIcon, inputTypesProperty.vertical,
                inputTypesProperty.wrap, inputTypesProperty.disabled, inputTypesProperty.hasMethod, inputTypesProperty.buttonType,
                inputTypesProperty.value, inputTypesProperty.hidden, inputTypesProperty.fieldId, inputTypesProperty.element]).then(() => {
                  console.log('inputtypeproperties inserted proerly');
                  if (res['inputTypeProperties'].length - 1 === inputTypesPropertyId) {
                    this.syncedPercentage += 3;
                    this.changedsyncedPercentage.next(this.syncedPercentage);
                    this.insertInspectionData();
                  }
                })
                .catch((e) => {
                  console.log('failed to insert inputtypeproperties', e.message);
                  if (res['inputTypeProperties'].length - 1 === inputTypesPropertyId) {
                    this.syncedPercentage += 3;
                    this.changedsyncedPercentage.next(this.syncedPercentage);
                  }
                });

            }
          });
        } else {
          this.syncedPercentage += 3;
          this.changedsyncedPercentage.next(this.syncedPercentage);
        }
      }, (err) => {
        console.log('error in get inputTypesProperty', err);
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });

      // To  get optionGroups details
      this.http.getMethod('getAllOptionGroups').subscribe((res) => {
        if (res && res['optionGroups'] && res['optionGroups'].length > 0) {
          res['optionGroups'].forEach((optionGroup, optionGroupId) => {
            if (optionGroup) {
              // To insert data into inputtypes table
              this.db.executeSql('INSERT INTO optionGroups( id,optionGroupName) VALUES (?,?)',
                [optionGroup.id, optionGroup.optionGroupName])
                .then(() => {
                  console.log('optionGrop inserted properly!');
                })
                .catch((e) => {
                  console.log('failed to insert option group', e.message);
                });

              if (optionGroup.optionChoices && optionGroup.optionChoices.length > 0) {
                optionGroup.optionChoices.forEach((optionChoice) => {
                  // To insert data into optionChoices table
                  this.db.executeSql(`INSERT INTO optionChoices( id,optionGroupId,optionChoiceName,optionChoicesValue)
                                 VALUES (?,?,?,?)`, [optionChoice.id, optionChoice.optionGroupId, optionChoice.optionChoiceName,
                    optionChoice.optionChoicesValue]).then(() => console.log('optionChoice inserted properly!'))
                    .catch((e) => console.log('failed to insert optionchoices', e.message));

                });
              }
              if (res['optionGroups'].length - 1 === optionGroupId) {
                this.syncedPercentage += 3;
                this.changedsyncedPercentage.next(this.syncedPercentage);
              }
            }
          });
        } else {
          this.syncedPercentage += 3;
          this.changedsyncedPercentage.next(this.syncedPercentage);
        }
      }, (err) => {
        console.log('error in get optionGroups', err);
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
    }
  }

  insertInspectionData() {
    // To get inspection header details
    this.http.getMethod('inspection').pipe(filter((res) => {

      if (res && res['inspectionHeader'] && res['inspectionHeader'].length > 0) {
        res['inspectionHeader'].forEach((inspectionHeader, inspectionHeaderId) => {
          if (inspectionHeader) {
            // To insert data into inspectionHeader table
            this.db.executeSql(`INSERT INTO inspectionHeader(id,customerId,name,instructions,fileAttachment,isForm,
              inspectionReportType,created,modified, isActive) VALUES (?,?,?,?,?,?,?,?,?,?)`,
              [inspectionHeader.id, inspectionHeader.customerId, inspectionHeader.name, null, null,
              inspectionHeader.isForm, inspectionHeader.inspectionReportType, inspectionHeader.created,
              inspectionHeader.modified, inspectionHeader.isActive])
              .then(() => {
                if (res['inspectionHeader'].length - 1 === inspectionHeaderId) {
                  this.syncedPercentage += 5;
                  this.changedsyncedPercentage.next(this.syncedPercentage);
                }
                console.log('data inserted properly in inspectionHeader!');
              })
              .catch((e) => {
                if (res['inspectionHeader'].length - 1 === inspectionHeaderId) {
                  this.syncedPercentage += 5;
                  this.changedsyncedPercentage.next(this.syncedPercentage);
                }
                console.log('error catched', e.message);
              });
            if (inspectionHeader.name) {
              const data = { headerId: inspectionHeader.id };
              this.http.postMethod('getworkflowform', data).subscribe((response) => {
                response['inspectionHeader'].inspectionSections.forEach((section, sectionId) => {
                  if (section) {
                    // To insert data into inspectionSections table
                    this.db.executeSql(`INSERT INTO inspectionSections(id,inspectionHeaderId,sectionName,sectionDesc,condition,
                      sectionState,showNext,showPrev,isCommon) VALUES (?,?,?,?,?,?,?,?,?)`, [section.id, section.inspectionHeaderId,
                      section.sectionName, section.sectionDesc, section.condition, section.sectionState, section.showNext,
                      section.showPrev, section.isCommon]).then(() => {
                        console.log('inspectionSections inserted proerly');
                      })
                      .catch((e) => {
                        console.log('failed to insert inspectionSections', e.message);
                      });
                    section.questions.forEach((question, questionId) => {

                      if (question) {
                        // To insert data into questions table
                        this.db.executeSql(`INSERT INTO questions( id,inspectionSectionId,inputTypeId,questionName,questionRequiredYN,
                          optionGroupId,allowMultipleOptionsAnswerYN,answerRequiredYN,inputTypePropertyId,displayPositionIndex,
                          subCategory,dynamicFieldQuestionId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [question.id, question.inspectionSectionId,
                          question.inputTypeId, question.questionName, question.questionRequiredYN, question.optionGroupId,
                          question.allowMultipleOptionsAnswerYN, question.answerRequiredYN, question.inputTypePropertyId,
                          question.displayPositionIndex, question.subCategory, question.dynamicFieldQuestionId]).then(() => {
                            console.log('questions inserted properly!');
                          })
                          .catch((e) => {
                            console.log('failed to insert questions', e.message);
                          });
                      }
                    });
                  }
                });
              }, (err) => {
                this.syncedPercentage += 5;
                console.log('err', err.message);
                this.changedsyncedPercentage.next(this.syncedPercentage);
              });
            }
          } else if (res['inspectionHeader'].length - 1 === inspectionHeaderId) {
            this.syncedPercentage += 5;
            this.changedsyncedPercentage.next(this.syncedPercentage);
          }
        });

      } else {
        this.syncedPercentage += 5;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }
      return true;
    }), mergeMap(() => {
      return this.http.getMethod('getreportlistdetails');
    })).subscribe((res) => {
      if (res && res['assignInspectionUsers'] && res['assignInspectionUsers'].length > 0) {
        res['assignInspectionUsers'].forEach((assignInspectionUser, assignInspectionUserId) => {
          if (assignInspectionUser) {

            // To insert or replace data into assignInspectionUsers table
            this.db.executeSql(`REPLACE INTO assignInspectionUsers(id,userId,inspectionHeaderId,inspectionStatusId,windMillFormId,
              comments,attachments,dueDate,created,modified) VALUES (?,?,?,?,?,?,?,?,?,?)`, [assignInspectionUser.id,
              assignInspectionUser.userId, assignInspectionUser.inspectionHeaderId, assignInspectionUser.inspectionStatusId,
              assignInspectionUser.windMillFormId, assignInspectionUser.comments, assignInspectionUser.attachments,
              assignInspectionUser.dueDate, assignInspectionUser.created, assignInspectionUser.modified]).then(() => {
                console.log('data inserted properly in assignInspection Users !');
                if (res['assignInspectionUsers'].length - 1 === assignInspectionUserId) {
                  this.syncedPercentage += 5;
                  this.changedsyncedPercentage.next(this.syncedPercentage);
                }
              })
              .catch((e) => {
                console.log('error catched asssign Users', e.message);
                if (res['assignInspectionUsers'].length - 1 === assignInspectionUserId) {
                  this.syncedPercentage += 5;
                  this.changedsyncedPercentage.next(this.syncedPercentage);
                }
              });
            if (assignInspectionUser.report !== null && assignInspectionUser.report !== undefined) {
              // To insert or replace data into report table
              this.db.executeSql(`REPLACE INTO report( id,windturbineId,name,assignedInspectionUserId,active,bladeType,created,modified)
               VALUES (?,?,?,?,?,?,?,?)`, [assignInspectionUser.report.id, assignInspectionUser.report.windturbineId,
                assignInspectionUser.report.name, assignInspectionUser.report.assignedInspectionUserId,
                assignInspectionUser.report.active, assignInspectionUser.report.bladeType, assignInspectionUser.report.created,
                assignInspectionUser.report.modified]).then(() => {
                  console.log('data inserted properly in report!');
                })
                .catch((e) => {
                  console.log('error catched report', e.message);
                });
              if (assignInspectionUser.report.answers !== null && assignInspectionUser.report.answers.length > 0) {
                assignInspectionUser.report.answers.forEach((answer, answerId) => {
                  if (answer) {
                    // To insert or replace data into answers table
                    this.db.executeSql(`REPLACE INTO answers( Id,reportId,questionId,answer_numeric,answer_text,answer_yn,value,
                    elementArray) VALUES(?,?,?,?,?,?,?,?)`, [answer.Id, answer.reportId, answer.questionId, answer.answer_numeric,
                      answer.answer_text, answer.answer_yn, answer.value, answer.elementArray]).then(() => {
                        console.log('data inserted properly in answer !');
                      })
                      .catch((e) => {
                        console.log('error catched answer', e.message);
                      });

                    if (answer.imageAnswers) {
                      answer.imageAnswers.forEach((imageAnswer, imageAnswerId) => {
                        if (imageAnswer) {
                          // To insert or replace data into imageAnswers  table
                          // tslint:disable-next-line:max-line-length
                          this.db.executeSql(`REPLACE INTO imageAnswers( id,answerId,sectionName,imageLocation,description, thumnailImage) VALUES
                         (?,?,?,?,?,?)`, [imageAnswer.id, imageAnswer.answerId, imageAnswer.sectionName, imageAnswer.imageLocation,
                            imageAnswer.description, imageAnswer.thumnailImage]).then(() => {
                              console.log('data inserted properly in imageAnswers !');
                            })
                            .catch((e) => {
                              console.log('error catched imageAnswers', e.message);
                            });
                        }
                      });
                    }
                    if (answer.optionChoiceAnswers) {
                      answer.optionChoiceAnswers.forEach((optionChoiceAnswer, optionChoiceAnswerId) => {
                        if (optionChoiceAnswer) {
                          // To insert or replace data into optionChoiceAnswers  table
                          this.db.executeSql('REPLACE INTO optionChoiceAnswers( id,answerId,optionChoiceId) VALUES (?,?,?)',
                            [optionChoiceAnswer.id, optionChoiceAnswer.answerId, optionChoiceAnswer.optionChoiceId])
                            .then(() => {
                              console.log('data inserted properly in optionChoiceAnswers !');
                            })
                            .catch((e) => {
                              console.log('error catched asssign Users', e.message);
                            });
                        }
                      });

                    }

                  }
                });
              }

            }
          } else {
            if (res['assignInspectionUsers'].length - 1 === assignInspectionUserId) {
              this.syncedPercentage += 5;
              this.changedsyncedPercentage.next(this.syncedPercentage);
            }
          }
        });

      } else {
        this.syncedPercentage += 5;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }
    }, (err) => {
      console.log('error in get assignInspectionUsers', err);
      this.syncedPercentage += 5;
      this.changedsyncedPercentage.next(this.syncedPercentage);
    });
  }
  /**
   * Method which is used to delete the database in device.
   */
  deleteDatabase() {
    // this.sqlite.deleteDatabase({ name: 'windInspection.db', location: 'default' })
    //     .then(() => {
    //         console.log('database deleted successfully !');
    //     }).catch((e) => {
    //         console.log('failed to delete database !', e.message);
    //     });
    if (this.db) {
      this.syncedPercentage = 0;
      this.changedsyncedPercentage.next(this.syncedPercentage);
      this.db.executeSql('DELETE  FROM  validators WHERE validators.id > 0', {}).then(() => {
        console.log('Validators successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in Validators deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  imageAnswers WHERE imageAnswers.id > 0', {}).then(() => {
        console.log('imageAnswers successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in imageAnswers deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  optionChoiceAnswers WHERE optionChoiceAnswers.id > 0', {}).then(() => {
        console.log('optionChoiceAnswers successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in optionChoiceAnswers deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  answers WHERE answers.Id > 0', {}).then(() => {
        console.log('answers successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in answers deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  questions WHERE questions.id > 0', {}).then(() => {
        console.log('questions successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in questions deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  inputTypes WHERE inputTypes.id > 0', {}).then(() => {
        console.log('inputTypes successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in inputTypes deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  inputTypesProperties WHERE inputTypesProperties.propertyId > 0', {}).then(() => {
        console.log('inputTypesProperties successfully deleted!');
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in inputTypesProperties deletion', e.message);
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  optionChoices WHERE optionChoices.id > 0', {}).then(() => {
        console.log('optionChoices successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in optionChoices deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  optionGroups  WHERE optionGroups.id > 0', {}).then(() => {
        console.log('optionGroups successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in optionGroups deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  inspectionSections WHERE inspectionSections.id > 0', {}).then(() => {
        console.log('inspectionSections successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in inspectionSections deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  report WHERE report.id > 0', {}).then(() => {
        console.log('report successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in report deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  assignInspectionUsers WHERE assignInspectionUsers.id > 0', {}).then(() => {
        console.log('assignInspectionUsers successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in assignInspectionUsers deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });

      this.db.executeSql('DELETE FROM  inspectionHeader WHERE inspectionHeader.id > 0', {}).then(() => {
        console.log('inspectionHeader successfully deleted!');
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in inspectionHeader deletion', e.message);
        this.syncedPercentage += 3;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  windTurbines WHERE windTurbines.id > 0', {}).then(() => {
        console.log('windTurbines successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in windTurbines deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE FROM  windFarm WHERE windFarm.id > 0', {})
        .then(() => {
          console.log('windFarm successfully deleted!');
          this.syncedPercentage += 2;
          this.changedsyncedPercentage.next(this.syncedPercentage);
        }).catch((e) => {
          console.log('error in windFarm deletion', e.message);
          this.syncedPercentage += 2;
          this.changedsyncedPercentage.next(this.syncedPercentage);
        });
      this.db.executeSql('DELETE  FROM  InspectionStatus WHERE InspectionStatus.id > 0', {}).then(() => {
        console.log('InspectionStatus successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in InspectionStatus deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
      this.db.executeSql('DELETE  FROM  customer WHERE customer.id > 0', {}).then(() => {
        console.log('customer successfully deleted!');
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      }).catch((e) => {
        console.log('error in customer deletion', e.message);
        this.syncedPercentage += 2;
        this.changedsyncedPercentage.next(this.syncedPercentage);
      });
    }
  }

  deleteUserDetails() {
    this.db.executeSql('DELETE  FROM  userAccount WHERE userAccount.id > 0', {}).then(() => {
      console.log('userAccount successfully deleted!');
    }).catch((e) => {
      console.log('error in userAccount deletion', e.message);
    });
    this.db.executeSql('DELETE  FROM  userRole WHERE userRole.id > 0', {}).then(() => {
      console.log('userRole successfully deleted!');
    }).catch((e) => {
      console.log('error in userRole deletion', e.message);
    });
  }

  /**
   * Method which is used to get the inspection header details with the inspectionSections from the sqlite offline database.
   * @param name {string} Which is used to define the inspectionHeader name.
   */
  getInspectionDetails(name: string) {
    if (this.db) {
      // To get inspectionHeader details with inspectionSection details
      return (this.db.executeSql(`SELECT * FROM inspectionHeader AS inspectionHeader
                LEFT JOIN inspectionSections AS inspectionSections ON inspectionSections.inspectionHeaderId = inspectionHeader.id
                where inspectionHeader.name = (?) ORDER BY inspectionSections.id ASC `, [name]));
    }
  }

  /**
   * Method which is used to get the inspection header details from the sqlite offline database.
   * @param name {string} Which is used to define the inspectionHeader name.
   */
  getInspectionHeader(name: string) {
    if (this.db) {
      // To get the inspectionHeader details for the given header name
      return (this.db.executeSql(`SELECT * from inspectionHeader where Name = (?)`, [name]));
    }
  }

  /**
  * Method which is used to get the inspection sections list from the sqlite offline database.
  * @param id {number} Which is used to define the inspectionHeader id.
  */
  getInspectionSections(id: number) {
    console.log('inspectionSections in sdffd ,', id);
    if (this.db) {
      console.log('db exist');
      // To get the inspectioSections list for the given header id
      return (this.db.executeSql(`SELECT * from inspectionSections where inspectionHeaderId= (?) ORDER BY id ASC`, [id]));
    }

  }

  /**
   * Method which is used to get the question list detalis from the sqlite offline database.
   * @param sectionId {number} Which is used to define the inspectionsection id.
   */
  getQuestions(sectionId: number) {
    if (this.db) {
      // To get the questions list for the given inspectionSection id and ordering the questions with displayPositionIndex
      return (this.db.executeSql(`SELECT * from questions where inspectionSectionId= (?) and dynamicFieldQuestionId IS NULL
        ORDER BY displayPositionIndex ASC`, [sectionId]));
    }

  }

  /**
   * Method which is used to get the question list with dynamic field questions  from the sqlite offline database.
   * @param sectionId {number} Which is used to define the inspectionsection id.
   */
  getQuestionsWithDynamicField(sectionId: number) {
    if (this.db) {
      // To get the questions list for the given inspectionSection id and ordering the questions with displayPositionIndex
      return (this.db.executeSql(`SELECT * from questions where inspectionSectionId= (?)
        ORDER BY displayPositionIndex ASC`, [sectionId]));
    }

  }

  /**
   * Method which is used to get the optionGroup details from the sqlite offline database.
   * @param questionId {number} Which is used to define the question id.
   */
  getOptionGroups(questionId: number) {
    if (this.db) {
      // To get the optionGroups for the given questionId
      return (this.db.executeSql(`SELECT * from optionGroups where id= (?)`, [questionId]));
    }


  }

  /**
   * Method which is used to get the inputTypes details from the sqlite offline database.
   * @param inputTypeId {number} Which is used to define the inputType id.
   */
  getInputTypes(inputTypeId: number) {
    // To get the inputTypes details for the given inputTypeId
    if (this.db) {
      return (this.db.executeSql(`SELECT * from inputTypes where id= (?)`, [inputTypeId]));
    }

  }

  /**
   * Method which is used to get the inputTypeProperty details from the sqlite offline database.
   * @param inputTypePropertyId {number} Which is used to define the inputTypeProperty id.
   */
  getInputTypeProperties(inputTypePropertyId: number) {
    if (this.db) {
      // To get the inputTypeProperty details for the given property id
      return (this.db.executeSql(`SELECT * from inputTypesProperties where propertyId= (?)`, [inputTypePropertyId]));

    }
  }

  /**
   * Method which is used to get the windFarm list from the sqlite offline database.
   * @param id {number} Which is used to define the customer id.
   */
  getWindFarmsList(id: number) {
    if (this.db) {
      // To get the windFarm list for given customer id
      return (this.db.executeSql(`SELECT * FROM windFarm AS windFarm
            where windFarm.customerId = (?)`, [id]));
    }
  }

  /**
  * Method which is used to get the windTurbines list from the sqlite offline database.
  * @param id {number} Which is used to define the windFarm id.
  */
  getWindTurbines(id: number) {
    if (this.db) {
      // To get the windTurbine list for the given windFarm id
      return (this.db.executeSql(`SELECT * FROM windTurbines AS windTurbines
            where windTurbines.windMillId = (?)`, [id]));
    }
  }

  /**
   * Method which is used to insert new inspection to the assignInspetionUser table.
   * @param assignInspectionUser {any} Which is used to define the assignInspectionUser.
   */
  assignInspection(assignInspectionUser: any) {
    const currentDate = new Date(Date.now()).toISOString();
    if (this.db) {
      // To insert the data into assignInspectionUser table
      return (this.db.executeSql(`INSERT INTO assignInspectionUsers(userId,inspectionHeaderId,inspectionStatusId,windMillFormId,comments,
      attachments,dueDate,updateIndicator,created,modified) VALUES (?,?,?,?,?,?,?,?,?,?)`, [assignInspectionUser.userId,
        assignInspectionUser.inspectionHeaderId,
        assignInspectionUser.inspectionStatusId, assignInspectionUser.windMillFormId, assignInspectionUser.comments,
        assignInspectionUser.attachments, assignInspectionUser.dueDate, 'I', currentDate, currentDate]));

    }
  }

  /**
   * Method which is used to get inspectionHeader details from the offline database.
   * @param id {number} Which is used to define the inspectionHeader Id.
   */
  getInspection(id: number) {
    if (this.db) {
      // To get the inspectionHeader details for the given header id
      return (this.db.executeSql('SELECT * FROM inspectionHeader where inspectionHeader.id = (?)', [id]));
    }
  }

  /**
  * Method which is used to get assignInspectionUsers details from the offline database.
  * @param id {number} Which is used to define the assignedInspectionUSer Id.
  */
  getAssignedInspectiondetails(id: number) {
    if (this.db) {
      // To get the assignInspectionUser details for the given id
      return (this.db.executeSql(`SELECT assignInspectionUsers.*,inspectionHeader.inspectionReportType AS inspectionReportType FROM
      assignInspectionUsers left join inspectionHeader on inspectionHeader.id = assignInspectionUsers.inspectionHeaderId
      where assignInspectionUsers.id = (?)`, [id]));
    }
  }

  /**
  * Method which is used to store report details to the offline database.
  * @param answers {any[]} Which is used to define the insert data into answers table.
  * @param optionChoiceAnswers {any[]}Which is used to define the insert data into optionChoiceAnswers table.
  */
  createSections(answers: any[], optionChoiceAnswers: any[]) {
    if (this.db) {
      for (let i = 0; i < answers.length; i++) {
        // To find the answers data for given reportId and questionId
        this.db.executeSql(`SELECT * FROM answers where reportId = (?) AND questionId = (?)`, [answers[i].reportId, answers[i].questionId]).
          then((result) => {
            if (result.rows.length > 0) {
              // If answer rows is returned then update the row with given data in offline database
              for (let index = 0; index < result.rows.length; index++) {
                this.db.executeSql(`UPDATE answers SET reportId= (?), questionId = (?), answer_numeric = (?), answer_text = (?),
                answer_yn = (?), updateIndicator = (?) where Id= (?)`, [answers[i].reportId, answers[i].questionId,
                  answers[i].answer_numeric, answers[i].answer_text, answers[i].answer_yn, 'Y', result.rows.item(index).Id]).
                  then(() => {
                    console.log('successfully stored!!!!!!!!');
                  }).catch((e) => {
                    console.log('error in update answer', e.message);
                  });
              }
            } else {
              // If answer rows is not returned then insert the new answers rows with given details
              this.db.executeSql(`INSERT INTO answers (reportId, questionId, answer_numeric, answer_text, answer_yn,
               updateIndicator) values (?,?,?,?,?,?) `, [answers[i].reportId, answers[i].questionId, answers[i].answer_numeric,
                answers[i].answer_text, answers[i].answer_yn, 'Y']).then(() => {
                  console.log('successfully stored!!!!!!!!');
                }).catch((e) => {
                  console.log('error in insert answer', e.message);
                });
            }
          }).catch((e) => {
            console.log('error in select answer');
          });
      }
      for (let optId = 0; optId < optionChoiceAnswers.length; optId++) {
        // To find the answers data for given reportId and questionId
        this.db.executeSql(`SELECT * FROM answers where reportId = (?) and questionId = (?)`, [optionChoiceAnswers[optId].reportId,
        optionChoiceAnswers[optId].questionId]).then((result) => {
          if (result.rows.length > 0) {
            for (let index = 0; index < result.rows.length; index++) {
              // If answer rows is returned then update the row to change updateIndicator value offline database
              this.db.executeSql(`UPDATE answers SET updateIndicator= (?) WHERE Id= (?)`, ['Y', result.rows.item(index).Id])
                .then(() => {
                  // To find the optionChoiceAnswers data for given answerId
                  this.db.executeSql(`SELECT * FROM optionChoiceAnswers where answerId = (?)`, [result.rows.item(index).Id]).
                    then((optionAnswer) => {
                      if (optionAnswer.rows.length > 0) {
                        for (let optionId = 0; optionId < optionAnswer.rows.length; optionId++) {
                          // If optionChoiceAnswers rows is returned then update the row with given data in offline database
                          this.db.executeSql(`UPDATE optionChoiceAnswers  SET optionChoiceId = (?), updateIndicator = (?) WHERE id= (?) `,
                            [optionChoiceAnswers[optId].optionChoiceId, 'Y', optionAnswer.rows.item(optionId).id]).then((value) => {
                              console.log('successfully update option answer', value);
                            }).catch((e) => {
                              console.log('error in update option answer', e.message);
                            });
                        }
                      } else {
                        // If optionChoiceAnswers rows is not returned then insert the new optionChoiceAnswers rows with given details
                        this.db.executeSql(`INSERT INTO optionChoiceAnswers (answerId, optionChoiceId, updateIndicator) values (?,?,?) `,
                          [result.rows.item(index).Id, optionChoiceAnswers[optId].optionChoiceId, 'Y']).then(() => {
                            console.log('successfully insert option answer');
                          }).catch((e) => {
                            console.log('error in else find option answer', e.message);
                          });
                      }
                    }).catch((e) => {
                      console.log('error in find option answer', e.message);
                    });

                }).catch((e) => {
                  console.log('error in update answer', e.message);
                });

            }
          } else {
            // If answer rows is not returned then insert the new answers rows with given details
            this.db.executeSql(`INSERT INTO answers (reportId, questionId, updateIndicator) values (?,?,?) `,
              [optionChoiceAnswers[optId].reportId, optionChoiceAnswers[optId].questionId, 'Y']).then((answer) => {
                // To assign inserted new answer id to answerId
                const answerId = answer.insertId;
                console.log('sucessfully insert answer for storing option answer');
                // And insert the new optionChoiceAnswers with given details
                this.db.executeSql(`INSERT INTO optionChoiceAnswers (answerId, optionChoiceId, updateIndicator) values (?,?,?) `,
                  [answerId, optionChoiceAnswers[optId].optionChoiceId, 'Y']).then(() => {
                    console.log('suceessfully option answer stored');
                  }).catch((e) => {
                    console.log('error in insert option answer', e.message);
                  });
              }).catch((e) => {
                console.log('error in insert answer', e.message);
              });
          }
        }).catch((e) => {
          console.log('error in find answer', e.message);
        });

      }
    }
  }

  /**
   *  Method which is used to create report in the offline database.
   * @param assignedInspectionId {number} which is used to define the assignedInspectionId.
   * @param turbineId {number} which is used to define the turbineId.
   * @param reportName {string} which is used to define the reportName.
   * @param status {number} which is used to define the status.
   * @param bladeType {string} which is used to define the bladeType.
   */
  createReport(assignedInspectionId: number, turbineId: number, reportName: string, status: number, bladeType: string) {
    if (this.db) {
      const date = new Date(Date.now()).toISOString();
      // Update the assignInspectionUsers for given id and updateIndicator
      return this.db.executeSql(`UPDATE assignInspectionUsers SET inspectionStatusId = (?), modified = (?) , updateIndicator = (?)
      WHERE id= (?) and updateIndicator != (?)`, [status, date, 'Y', assignedInspectionId, 'I'])
        .then((result) => {
          if (result.rows.length > 0) {
            // If row is updated then insert new data into report table
            // tslint:disable-next-line:max-line-length
            return (this.db.executeSql(`INSERT INTO report(assignedInspectionUserId, windturbineId, bladeType, name, updateIndicator, created, modified)
          VALUES (?,?,?,?,?,?,?) `, [assignedInspectionId, turbineId, bladeType, reportName, 'Y', date, date]));
          } else {
            // If row is not updated then Update the assignInspectionUsers for given id
            return this.db.executeSql(`UPDATE assignInspectionUsers SET inspectionStatusId = (?), modified = (?)  WHERE id= (?)`,
              [status, date, assignedInspectionId])
              .then(() => {
                console.log('successfully assign inspection user updated');
                // If row is updated then insert new data into report table
                // tslint:disable-next-line:max-line-length
                return (this.db.executeSql(`INSERT INTO report(assignedInspectionUserId, windturbineId, bladeType, name, updateIndicator, created, modified)
              VALUES (?,?,?,?,?,?,?) `, [assignedInspectionId, turbineId, bladeType, reportName, 'Y', date, date]));
              }).catch((e) => {
                console.log('error in update assign inspection user ', e.message);
              });
          }
        }).catch((e) => {
          console.log('error update assign inspection user', e.message);
        });
    }
  }

  /**
   * Method which is used to get the optionChoices details for the given optionChoice id.
   * @param optionChoiceID {number} which is used to define the optionChoiceId.
   */
  getOptionChoicesById(optionChoiceID: number) {
    if (this.db) {
      return (this.db.executeSql('SELECT * FROM optionChoices AS optionChoices WHERE id = (?)', [optionChoiceID]));
    }
  }

  /**
   * Method which is used to get the optionChoices list for the given optionGroupId.
   * @param optionGroupId {number} which is used to define the optionGroupId.
   */
  getOptionChoices(optionGroupId: number) {
    if (this.db) {
      return (this.db.executeSql(`SELECT * FROM optionChoices AS optionChoices WHERE optionGroupId = (?)
        ORDER BY id ASC`, [optionGroupId]));
    }
  }

  /**
  * Method which is used to get the optionChoiceAnswers list for the given answerId.
  * @param id {number} which is used to define the answerId.
  */
  getOptionChoiceAnswers(id: number) {
    if (this.db) {
      return (this.db.executeSql('SELECT * FROM optionChoiceAnswers AS optionChoiceAnswers WHERE answerId = (?)', [id]));
    }
  }

  /**
   * Method which is used to get the imageAnswers list for the given answerId.
   * @param id {number} which is used to define the answerId.
   */
  getImageAnswers(id: number) {
    if (this.db) {
      return (this.db.executeSql('SELECT * FROM  imageAnswers AS imageAnswers WHERE answerId = (?) and updateIndicator != (?)', [id, 'D']));
    }
  }

  /**
   * Method which is used to get the answers list for the given reportId.
   * @param id {number} which is used to define the reportId.
   */
  getAnswers(id: number) {
    if (this.db) {
      return (this.db.executeSql(`SELECT * FROM answers AS answers WHERE reportId = (?)`, [id]));
    }
  }

  // /**
  //  * Method which is used to get the updated answers list from the offline database.
  //  */
  // restoreDataInAnswerDB() {
  //   if (this.db) {
  //     // To get answers list which have updateIndicator as 'Y'
  //     return (this.db.executeSql(`SELECT Id as ansId, reportId, questionId, answer_numeric, answer_text,answer_yn,value,
  //      elementArray as changedElementArray, updateIndicator FROM  answers AS answers WHERE updateIndicator IN ('Y','U','D','I')`, []));
  //   }
  // }

  /**
   * Method which is used to get the updated imageAnswers list from the offline database.
   * @param id {number} which is used to define the answerId.
   */
  restoreDataInImageAnswersDB(id: number) {
    if (this.db) {
      // To get imageAnswers list which have updateIndicator as 'Y' and given id
      // tslint:disable-next-line:max-line-length
      return (this.db.executeSql(`SELECT id,imageFileUri,imageLocation,sectionName,description,updateIndicator,thumnailImage FROM  imageAnswers AS
      imageAnswers WHERE updateIndicator IN ('Y', 'D') and answerId=(?)`, [id]));
    }
  }

  /**
   * Method which is used to get the updated optionChoiceAnswers list from the offline database.
   * @param answerId {number} which is used to define the answerId.
   */
  restoreDataInOptionChoiceAnswerDB(answerId: number) {
    if (this.db) {
      // To get optionChoiceAnswers list which have updateIndicator as 'Y' and given id
      return (this.db.executeSql(`SELECT optionChoiceId FROM optionChoiceAnswers AS optionChoiceAnswers
       WHERE updateIndicator = (?) and answerId=(?)`, ['Y', answerId]));
    }
  }
  /**
  * Method which is used to get the updated report list from the offline database.
  * @param assignedId {number} which is used to define the assignedInspectionUserId.
  */
  restoreDataInReportsDB(assignedId: number) {
    if (this.db) {
      // To get optionChoiceAnswers list report have updateIndicator as 'Y' and given assignedInspectionUserId
      return (this.db.executeSql(`SELECT id as reportIndex,assignedInspectionUserId,windturbineId,active,name,bladeType FROM  report AS
        report WHERE updateIndicator = (?) and assignedInspectionUserId=(?)`, ['Y', assignedId]));

    }
  }

  /**
   * Method which is used to get the updated assignInspectionUsers list from the offline database.
  */
  restoreDataInAssignInspectionUserssDB() {
    if (this.db) {
      // To get assignInspectionUsers list report have updateIndicator as 'Y', 'I' and 'C'
      return (this.db.executeSql(`SELECT id, userId, inspectionHeaderId, attachments, comments, windMillFormId, dueDate, inspectionStatusId,
        updateIndicator FROM  assignInspectionUsers AS assignInspectionUsers WHERE updateIndicator IN ('Y', 'I', 'C','U') `, []));

    }
  }

  /**
  * Method which is used to get the report list for the given assignedInspectionUserId.
  * @param assignInspectionId {number} which is used to define the assignedInspectionUserId.
  */
  getReportsByInspectionId(assignInspectionId: number) {
    if (this.db) {
      return (this.db.executeSql('SELECT * FROM report where assignedInspectionUserId = (?)', [assignInspectionId]));

    }
  }

  /**
  * Method which is used to get the updated answers list from the offline database.
  * @param id {number} which is used to define the id of the selected report.
  */
  restoreReportAnswer(id: number) {
    if (this.db) {
      return (this.db.executeSql(`SELECT Id as ansId,reportId, questionId, answer_numeric, answer_text, answer_yn,value,
      elementArray as changedElementArray, updateIndicator FROM
        answers AS answers WHERE reportId = (?)`, [id]));

    }
  }

  /**
   * Method which is used to get the assignInspectionUsers list for the given user id.
   * @param userId {number} which is used to define the userId.
   */
  getAssignInspectionUsers(userId: number) {
    if (this.db) {
      return (this.db.executeSql(`SELECT assignInspectionUsers.*,InspectionStatus.name as name,inspectionHeader.name as inspectionName,
       windFarm.name as siteName FROM assignInspectionUsers
       left join InspectionStatus on InspectionStatus.id = assignInspectionUsers.inspectionStatusId
       left join inspectionHeader on inspectionHeader.id = assignInspectionUsers.inspectionHeaderId
       left join windFarm on windFarm.id = assignInspectionUsers.windMillFormId
       where assignInspectionUsers.userId = (?)`, [userId]));
    }
  }

  /**
  * Method which is used to get the report list for the given turbineId.
  * @param turbineId {number} which is used to define the turbineId.
  */
  getTurbineBladeReportType(turbineId: number) {
    if (this.db) {
      return (this.db.executeSql(`SELECT * FROM report
                    where windturbineId = (?)`, [turbineId]));
    }
  }

  /**
  * Method which is used to get the report list for the given reportId.
  * @param reportId {number} which is used to define the reportId.
  */
  getReport(reportId: number) {
    if (this.db) {
      return (this.db.executeSql('SELECT * FROM report where id = (?)', [reportId]));
    }
  }

  /**
   * Method which is used to get the answer list for the given reportId and questionId.
   * @param reportId {number} which is used to define the reportId.
   * @param questionId {nubmer} which is used to define the questionId.
   */
  getAnswersByquestionId(reportId: number, questionId: number) {
    if (this.db) {
      return (this.db.executeSql('SELECT * FROM answers where questionId = (?) AND reportId = (?)', [questionId, reportId]));
    }
  }

  /**
   * Method which is used to update or insert the answer row for store images.
   * @param questionId {nubmer} which is used to define the questionId.
   * @param reportId {number} which is used to define the reportId.
   */
  storeAnswersForImage(questionId, reportId) {
    if (this.db) {
      return this.db.executeSql(`SELECT * FROM answers where reportId = (?) and questionId = (?)`, [reportId, questionId]).
        then((result) => {
          if (result.rows.length > 0) {
            for (let index = 0; index < result.rows.length; index++) {
              // If answer rows is returned then update the row to change updateIndicator value offline database
              return this.db.executeSql(`UPDATE answers SET updateIndicator= (?) WHERE Id= (?)`, ['I', result.rows.item(index).Id])
                .then((updatedanswer) => {
                  updatedanswer.insertId = result.rows.item(index).Id;
                  return updatedanswer;
                }).catch((e) => {
                  console.log('error in update answer', e.message);
                });
            }

          } else {
            // If answer rows is not returned then insert the new answers rows with given details
            return this.db.executeSql(`INSERT INTO answers (reportId, questionId, updateIndicator) values (?,?,?) `,
              [reportId, questionId, 'I']);
          }
        });
    }
  }

  /**
   * Method which is used to store the imageAnswers list for the given reportId and questionId.
   * @param image {any} To define the insert data.
   * @param answerId {number} To define the answer id.
   */
  storeImageAnswers(image: any, answerId: number) {
    if (this.db) {
      for (let imgId = 0; imgId < image.length; imgId++) {
        if (image[imgId].id) {
          if (image[imgId].mode === 'D' && image[imgId].imageFileUri !== undefined && image[imgId].imageFileUri !== null) {
            this.db.executeSql('DELETE  FROM  imageAnswers WHERE id = (?)', [image[imgId].id])
              .then(() => {
                console.log('imageAnswers successfully deleted!');
              }).catch((e) => {
                console.log('error in deletion', e.message);
              });
          } else if (image[imgId].mode === 'D') {
            // If image have id then update the imageAnswers with given data
            this.db.executeSql(`UPDATE imageAnswers SET updateIndicator = (?) WHERE id= (?) `,
              ['D', image[imgId].id]).then(() => {
                console.log('sucessfully imageAnswers updated');
              }).catch((e) => {
                console.log('error in update image answer', e.message);
              });
          } else if (image[imgId].mode !== null && image[imgId].mode !== undefined) {
            // If image have id then update the imageAnswers with given data
            this.db.executeSql(`UPDATE imageAnswers SET description= (?), updateIndicator = (?) WHERE id= (?) `,
              [image[imgId].description, 'Y', image[imgId].id]).then(() => {
                console.log('sucessfully imageAnswers updated');
              }).catch((e) => {
                console.log('error in update image answer', e.message);
              });
          }
        } else {
          // To insert new data into imageAnswers table
          this.db.executeSql(`INSERT INTO imageAnswers (answerId, imageFileUri, description, sectionName,
                      updateIndicator) values (?,?,?,?,?) `, [answerId, image[imgId].imageFileUri,
              image[imgId].description, image[imgId].sectionName, 'Y']).then(() => {
                console.log('sucessfully imageAnswers inserted');
              }).catch((e) => {
                console.log('error in insert new image answer', e.message);
              });

        }
      }
    }
  }

  /**
   * Method which is used to get the user details for given email and password.
   * @param email {string} Which is used to define the email.
   * @param password {string} which is used to define the password.
   */
  getCurrentUser(email: string, password: string) {
    if (this.db) {
      return (this.db.executeSql('SELECT * FROM userAccount where email = (?) and password = (?)', [email, password]));
    }
  }

  /**
   * Method which is used to delete the assignInspectionUsers row for given id.
   * @param id {number} Which is used to define the id.
   */
  deleteAssignInspectionUsers(id: number) {
    if (this.db) {
      this.db.executeSql('DELETE  FROM  assignInspectionUsers WHERE assignInspectionUsers.id = (?)', [id])
        .then(() => {
          console.log('assignInspectionUsers successfully deleted!');
        }).catch((e) => {
          console.log('error in deletion', e.message);
        });
    }
  }

  /**
   * Method which is used to update the assignInspectionUsers row for report id.
   * @param reportId {number} Which is used to define the reportId.
   * @param statusId {number} Which is used to define the statusId.
   * @param updateIndicator {string} Which is used to define the updateIndicator value.
   */
  changeAssignedInspectionStatus(reportId: number, statusId: number, updateIndicator: string) {
    if (this.db) {
      const date = new Date(Date.now());
      // To find the report list for given id
      this.db.executeSql('SELECT * from report where id=(?)', [reportId]).then((report) => {
        if (report.rows.length > 0) {
          for (let reportIndex = 0; reportIndex < report.rows.length; reportIndex++) {
            // To update the row for given id and updateIndicator
            this.db.executeSql(`UPDATE assignInspectionUsers SET inspectionStatusId = (?), modified = (?) , updateIndicator = (?) WHERE
          id= (?) and updateIndicator NOT IN ('I','Y')`, [statusId, date, updateIndicator,
                report.rows.item(reportIndex).assignedInspectionUserId]).then((result) => {
                  if (result.rows.length > 0) {
                    console.log('sucessfully assign inspection user updated');
                  } else if (updateIndicator !== 'U') {
                    // To update the row for given updateIndicator
                    this.db.executeSql(`UPDATE assignInspectionUsers SET inspectionStatusId = (?), modified = (?)  WHERE id= (?)`,
                      [statusId, date, report.rows.item(reportIndex).assignedInspectionUserId])
                      .then((value) => {
                        console.log('sucessfully assign inspection user updated');

                      }).catch((e) => {
                        console.log('error in update assign inspection user', e.message);
                      });
                  }
                }).catch((e) => {
                  console.log('error in update assign inspection user', e.message);
                });
          }
        }
      }).catch((e) => {
        console.log('error in find report', e.message);
      });
    }

  }

  /**
  * Method which is used to get the inspection header which have inspection form.
  * @param isForm {number} Which is used to check whether the form is inspection form or not.
  */
  getInspectionFormDetails(isForm: number) {
    if (this.db) {
      return this.db.executeSql('SELECT * FROM inspectionHeader where isForm = (?)', [isForm]);
    }
  }

  /**
  * Method which is used to get the user by given email id.
  * @param email {string} To define the user email id.
  */
  getUserByEmailId(email: string) {
    if (this.db) {
      return this.db.executeSql('SELECT * FROM userAccount where email = (?)', [email]);
    }
  }

  /**
  * Method which is used to get the dynamic field questions.
  * @param questionId {number} To define the dynamic field question id.
  */
  getDynamicFieldQuestion(questionId: number) {
    if (this.db) {
      return this.db.executeSql(`SELECT * from questions where dynamicFieldQuestionId = (?)
        ORDER BY displayPositionIndex ASC`, [questionId]);
    }
  }

  /**
  * Method which is used to get the dynamic field answers for given report id.
  * @param reportId {number} To define the dynamic field report id.
  */
  getDynamicFieldAnswers(reportId: number) {
    if (this.db) {
      return this.db.executeSql(`SELECT * from answers where reportId = (?) and NOT elementArray IS NULL
        and updateIndicator != 'D'`, [reportId]);
    }
  }

  /**
  * Method which is used to insert and delete and update the dynamic field answers for given report id.
  * @param data {any} To define the dynamic field answers.
  */
  updateDynamicFieldAnswers(answers: any) {
    if (this.db) {
      for (let i = 0; i < answers.length; i++) {
        if (answers[i].mode === 'D' && answers[i].Id !== undefined && answers[i].Id !== null) {
          if (answers[i].updateIndicator !== 'I') {
            this.db.executeSql(`UPDATE answers SET updateIndicator = (?) where Id= (?)`, ['D', answers[i].Id]).
              then(() => {
                console.log('successfully updated!!!');
              }).catch((e) => {
                console.log('error in update answer', e.message);
              });
          } else {
            this.db.executeSql('delete from answers where Id = (?)', [answers[i].Id]).then(() => {
              console.log('successfully deleted!!!');
            }).catch((e) => {
              console.log('error in delete answer', e.message);
            });
          }
        } else if (answers[i].mode === 'U' && answers[i].Id !== undefined && answers[i].Id !== null) {
          if (answers[i].updateIndicator !== 'I') {
            this.db.executeSql(`UPDATE answers SET  value = (?), elementArray = (?), updateIndicator = (?) where Id= (?)`,
              [answers[i].value, answers[i].changedElementArray, answers[i].mode, answers[i].Id]).
              then(() => {
                console.log('successfully updated!!');
              }).catch((e) => {
                console.log('error in update answer', e.message);
              });
          } else {
            this.db.executeSql(`UPDATE answers SET  value = (?), elementArray = (?) where Id= (?)`,
              [answers[i].value, answers[i].changedElementArray, answers[i].Id]).
              then(() => {
                console.log('successfully updated!!');
              }).catch((e) => {
                console.log('error in update answer', e.message);
              });
          }
        } else if (answers[i].Id === null || answers[i].Id === undefined) {
          this.db.executeSql(`INSERT INTO answers (reportId, questionId, value, elementArray,
               updateIndicator) values (?,?,?,?,?) `, [answers[i].reportId, answers[i].questionId, answers[i].value,
            answers[i].changedElementArray, 'I']).then(() => {
              console.log('successfully stored!!!!!!!!');
            }).catch((e) => {
              console.log('error in insert answer', e.message);
            });
        }
      }
    }

  }
  /**
  * Method which is used to get the dynamic field element questions.
  * @param questionId {number} To define the dynamic field question id.
  */
  getDynamicFieldElementQuestionById(questionId: number) {
    if (this.db) {
      return this.db.executeSql(`SELECT * from questions where id = (?)`, [questionId]);
    }
  }

  /**
  * Method which is used to get the option choices by group name.
  * @param groupName {string} To define the group name.
  */
  getOptionGroupByName(groupName: string) {
    if (this.db) {
      return this.db.executeSql(`SELECT * from optionGroups where optionGroupName = (?)`, [groupName]);
    }
  }

  /**
  * Method which is used to get the customer details for given id.
  * @param customerId {number} To define the customer id of the current user.
  */
  getCustomerDetails(customerId: number) {
    if (this.db) {
      return this.db.executeSql(`SELECT * from customer where id = (?)`, [customerId]);
    }
  }
}
