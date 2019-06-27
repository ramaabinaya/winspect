const express = require('express');
const router = express.Router();

const passport = require('passport');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: "success", message: "Parcel Pending API", data: { "version_number": "v1.0.0" } })
});

router.get('/userlist', passport.authenticate('jwt', { session: false }), UserAccountController.getAll);
router.post('/adduser', passport.authenticate('jwt', { session: false }), UserAccountController.addUser);
router.post('/user/status', passport.authenticate('jwt', { session: false }), UserAccountController.changeUserStatus);
router.post('/user/edit', passport.authenticate('jwt', { session: false }), UserAccountController.editUser);
router.post('/users/login', UserAccountController.login);
router.post('/user/changepassword', passport.authenticate('jwt', { session: false }), UserAccountController.changepassword);
router.get('/getCurrentUser', passport.authenticate('jwt', { session: false }), UserAccountController.getUser);
router.post('/checkEmail', passport.authenticate('jwt', { session: false }), UserAccountController.checkEmail);

router.get('/inspection', passport.authenticate('jwt', { session: false }), InspectionHeaderController.getAll);
router.post('/checkTemplateName', passport.authenticate('jwt', { session: false }), InspectionHeaderController.checkTemplateName);

router.post('/assigninspection', passport.authenticate('jwt', { session: false }), AssignInspectionUsersController.addAssignInspection);
router.post('/assignedinspection', passport.authenticate('jwt', { session: false }), AssignInspectionUsersController.get);
router.post('/groupassigninspection', passport.authenticate('jwt', { session: false }), AssignInspectionUsersController.groupAssignInspection)

router.get('/windfarmlist', passport.authenticate('jwt', { session: false }), WindmillController.getAllWindFarms);
router.post('/windturbinelist', passport.authenticate('jwt', { session: false }), WindmillController.getWindTurbines);
router.get('/getwindfarmsandturbines', passport.authenticate('jwt', { session: false }), WindmillController.getWindFarmsAndTurbines);
router.post('/getwindfarms', passport.authenticate('jwt', { session: false }), WindmillController.getWindFarms);
router.post('/checkWindFarmName', passport.authenticate('jwt', { session: false }), WindmillController.checkWindFarmName);

router.post('/getforms', passport.authenticate('jwt', { session: false }), FormController.getForms);
router.post('/getworkflowform', passport.authenticate('jwt', { session: false }), FormController.getWorkFlowForms);
router.post('/getoptionchoices', passport.authenticate('jwt', { session: false }), FormController.getOptionChoices);
router.get('/getAllInputTypes', passport.authenticate('jwt', { session: false }), FormController.getAllInputTypes);
router.post('/getDynamicFieldQuestion', passport.authenticate('jwt', { session: false }), FormController.getDynamicFieldQuestions)
router.get('/getAllInputTypeProperties', passport.authenticate('jwt', { session: false }), FormController.getAllInputTypeProperties);

router.post('/getallreports', passport.authenticate('jwt', { session: false }), ReportController.getallreports);
router.post('/reportlist', passport.authenticate('jwt', { session: false }), ReportController.reportlist);
router.post('/create', passport.authenticate('jwt', { session: false }), ReportController.create);
router.post('/report/status', passport.authenticate('jwt', { session: false }), ReportController.changeReportStatus);
router.post('/deletereport', passport.authenticate('jwt', { session: false }), ReportController.deleteReport);
router.post('/getDynamicFieldAnswers', passport.authenticate('jwt', { session: false }), ReportController.getDynamicFieldAnswers);
router.post('/getreport', passport.authenticate('jwt', { session: false }), ReportController.getReport);
router.post('/getturbinereport', passport.authenticate('jwt', { session: false }), ReportController.getTurbineReport);
// router.post('/getturbinebladetype', passport.authenticate('jwt', { session: false }), ReportController.getTurbineBladeType);
router.post('/createSection', passport.authenticate('jwt', { session: false }), ReportController.createSection);
router.post('/storeImage', passport.authenticate('jwt', { session: false }), ReportController.storeImage);
router.post('/getanswer', passport.authenticate('jwt', { session: false }), ReportController.getAnswers);
router.post('/changeAssignedInspectionStatus', passport.authenticate('jwt', { session: false }), ReportController.changeAssignedInspectionStatus);
router.post('/createpdf', passport.authenticate('jwt', { session: false }), ReportController.createPDF);
router.get('/getAssignedInspection', passport.authenticate('jwt', { session: false }), ReportController.getAssignedInspections)

router.post('/getsections', passport.authenticate('jwt', { session: false }), FormController.getInspectionSections);

router.get('/getInspectionStatus', passport.authenticate('jwt', { session: false }), InspectionStatusController.getAll);

router.get('/getAllClients', passport.authenticate('jwt', { session: false }), ClientController.getAll);
router.get('/getClientDetails', passport.authenticate('jwt', { session: false }), ClientController.getClient);

router.get('/getreportlistdetails', passport.authenticate('jwt', { session: false }), ReportController.getreportlistdetails);

router.post('/getInputProperties', passport.authenticate('jwt', { session: false }), DynamicInspectionController.getInputModelProperties);
router.post('/addInspection', passport.authenticate('jwt', { session: false }), DynamicInspectionController.addInspectionHeader);
router.post('/addInspectionSection', passport.authenticate('jwt', { session: false }), DynamicInspectionController.addInspectionSection);
router.post('/addinputProperties', passport.authenticate('jwt', { session: false }), DynamicInspectionController.addInputProperties);
router.post('/editSectionName', passport.authenticate('jwt', { session: false }), DynamicInspectionController.editSectionName);
router.get('/getAllOptionGroups', passport.authenticate('jwt', { session: false }), FormController.getAllOptionGroups);
router.post('/addOptionGroup', passport.authenticate('jwt', { session: false }), DynamicInspectionController.addOptionGroup)
router.post('/addOptionChoices', passport.authenticate('jwt', { session: false }), DynamicInspectionController.addOptionChoices);

router.post('/deleteproperty', passport.authenticate('jwt', { session: false }), DynamicInspectionController.deleteInputProperty);
router.post('/deleteoptionchoices', passport.authenticate('jwt', { session: false }), DynamicInspectionController.deleteOptionChoices);
router.post('/deleteoptiongroups', passport.authenticate('jwt', { session: false }), DynamicInspectionController.deleteOptionGroup);

router.post('/deleteSection', passport.authenticate('jwt', { session: false }), DynamicInspectionController.deleteInspectionSection);

router.post('/updateproperties', passport.authenticate('jwt', { session: false }), DynamicInspectionController.updateInputProperties);
router.post('/updateoptions', passport.authenticate('jwt', { session: false }), DynamicInspectionController.updateOptionChoices);
router.post('/updateoptiongroup', passport.authenticate('jwt', { session: false }), DynamicInspectionController.updateOptionGroup);

router.post('/getDynamicFieldElementQuestion', passport.authenticate('jwt', { session: false }), FormController.getDynamicFieldElementQuestion);
router.post('/getsectiondetails', passport.authenticate('jwt', { session: false }), DynamicInspectionController.getSectionDetails);
router.post('/storeAnswerForImages', passport.authenticate('jwt', { session: false }), ReportController.storeAnswerForImages);

//New Code
router.post('/changeAssignedInspectionDueDate', passport.authenticate('jwt', { session: false }), ReportController.changeAssignedInspectionDueDate);
router.get('/getcustomerdetails', passport.authenticate('jwt', { session: false }), CustomerController.getAllCustomer);
router.post('/reassignedinspection', passport.authenticate('jwt', { session: false }), AssignInspectionUsersController.ReassignInspection);

router.post('/allreport/status', passport.authenticate('jwt', { session: false }), ReportController.changeAllReportStatus);
router.post('/convertImageToBase64String', passport.authenticate('jwt', { session: false }), ReportController.convertImageToBase64String);
router.get('/getAllUserRole', passport.authenticate('jwt', { session: false }), UserRoleController.getAll);

router.post('/editInspection', passport.authenticate('jwt', { session: false }), DynamicInspectionController.editInspectionHeader);
router.post('/deleteInspection', passport.authenticate('jwt', { session: false }), DynamicInspectionController.deleteInspectionHeader);
router.post('/changeInspectionStatus', passport.authenticate('jwt', { session: false }), DynamicInspectionController.changeInspectionStatus);
router.post('/addwindfarm', passport.authenticate('jwt', { session: false }), WindmillController.addWindFarm);
router.post('/addwindturbine', passport.authenticate('jwt', { session: false }), WindmillController.addWindTurbine);
router.post('/addwindturbines', passport.authenticate('jwt', { session: false }), WindmillController.addMoreWindTurbines);
router.post('/addwindfarms', passport.authenticate('jwt', { session: false }), WindmillController.addMoreWindFarms);

router.post('/addMoreOptionChoices', passport.authenticate('jwt', { session: false }), DynamicInspectionController.addMoreOptionChoices);

router.post('/addEmail', EmailController.addEmail);
router.post('/configurePassword', EmailController.configurePassword);
router.post('/user/configurePassword', UserAccountController.configurePassword);
router.get('/getResourceList', DynamicInspectionController.getResourceList);
router.post('/createGroup', passport.authenticate('jwt', { session: false }), GroupController.createGroup);
router.get('/getAllGroups', passport.authenticate('jwt', { session: false }), GroupController.getAllGroups);
router.post('/removeGroup', passport.authenticate('jwt', { session: false }), GroupController.removeGroup);
router.post('/editGroup', passport.authenticate('jwt', { session: false }), GroupController.editGroup);
router.post('/addtoGroup', passport.authenticate('jwt', { session: false }), GroupMemberController.addtoGroup);
router.post('/removeMember', passport.authenticate('jwt', { session: false }), GroupMemberController.removeMember);

router.get('/getDeviceInfo', passport.authenticate('jwt', { session: false }), DeviceController.getDeviceInfo);
router.post('/removeDevice', passport.authenticate('jwt', { session: false }), DeviceController.removeDevice);

router.get('/menulist', passport.authenticate('jwt', { session: false }), MenuController.getMenuList);
router.post('/refreshToken', UserAccountController.refreshToken);
module.exports = router;