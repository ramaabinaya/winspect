Answers = require('../models').answers;
AssignInspectionUsers = require('../models').assignInspectionUsers;
Client = require('../models').client;
ClientWindFarm = require('../models').clientWindFarm;
Customer = require('../models').customer;
Devices = require('../models').devices;
DynamicInputModelProperties = require('../models').dynamicInputModelProperties;
GroupMembers = require('../models').groupMembers;
Groups = require('../models').groups;
ImageAnswers = require('../models').imageAnswers;
InputTypes = require('../models').inputTypes;
InputTypeProperties = require('../models').inputTypesProperties;
InspectionSection = require('../models').inspectionSections;
InspectionHeader = require('../models').inspectionHeader;
InspectionStatus = require('../models').inspectionStatus;
OptionChoiceAnswers = require('../models').optionChoiceAnswers;
OptionChoices = require('../models').optionChoices;
OptionGroups = require('../models').optionGroups;
Questions = require('../models').questions;
Report = require('../models').report;
UserAccount = require('../models').userAccount;
UserRole = require('../models').userRole;
Validators = require('../models').validators;
Windfarm = require('../models').windFarm;
WindTurbine = require('../models').windTurbines;
MenuItems = require('../models').menuItems;
RoleBasedMenu = require('../models').roleBasedMenu;
Permission = require('../models').permission;

UserAccountController = require('./../controllers/userAccountController');
UserRoleController = require('./../controllers/userRoleController');
InspectionHeaderController = require('./../controllers/inspectionHeaderController');
WindmillController = require('./../controllers/windmillController');
AssignInspectionUsersController = require('./../controllers/assignInspectionUsersController');
FormController = require('./../controllers/formController');
ReportController = require('./../controllers/reportController');
InspectionStatusController = require('./../controllers/inspectionStatusController');
ClientController = require('./../controllers/clientController');
DynamicInspectionController = require('./../controllers/dynamicInspectionController');
CustomerController = require('./../controllers/customerController');
EmailController = require('./../controllers/email');
GroupController = require('./../controllers/groupsController');
GroupMemberController = require('./../controllers/groupMemberController');
DeviceController = require('./../controllers/deviceController');
MenuController = require('./../controllers/menuController');

authService = require('./../services/AuthService');
mailService = require('./../services/MailServices');
reportService = require('./../services/ReportService');
s3DataService = require('./../services/S3DataService');
storOptionChoiceService = require('./../services/StoreOptionChoiceService');

Sequelize = require('sequelize');
logger = require('../log');







