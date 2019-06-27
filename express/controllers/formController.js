
/**
 * asnync function to get form details.
 * If error occurs return the error response 
 * otherwise return the suceess response.
 */
const getForms = async function (req, res) {
  let body = req.body;
  //get inspection header table row for the given name
  [err, inspectionHeader] = await to(InspectionHeader.findOne({
    where: { Name: body.headerName },
    attributes: ['name', 'isForm', 'id'],
    include: [{
      model: InspectionSection,
      include: [{
        model: Questions,
        // as: 'questions',
        where: {
          dynamicFieldQuestionId: null
        },
        include: [{
          model: InputTypes,
          attributes: ['inputTypeName']
          // as: 'inputTypes',
        },
        {
          model: InputTypeProperties
        }, {
          model: Validators,
          as: 'validators'
        }, {
          model: OptionGroups,
          include: [{
            model: OptionChoices
          }]
        }]
      }]
    }],
    order: [
      [InspectionSection, 'id', 'asc'],
      [InspectionSection, Questions, 'displayPositionIndex', 'asc'],
      [InspectionSection, Questions, OptionGroups, OptionChoices, 'id', 'asc'],
    ],
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { inspectionHeader: inspectionHeader });
};
module.exports.getForms = getForms;

/**
 * asnync function to get form details for work flow wizard.
 * If error occurs return the error response 
 * otherwise return the suceess response.
 */
const getWorkFlowForms = async function (req, res) {
  let body = req.body;
  //get inspection header table row for the given name
  [err, inspectionHeader] = await to(InspectionHeader.findOne({
    where: { id: body.headerId },
    attributes: ['name', 'isForm'],
    include: [{
      model: InspectionSection,
      include: [{
        model: Questions,
        include: [{
          model: InputTypes,
          attributes: ['inputTypeName']
        }, {
          model: InputTypeProperties,
        }, {
          model: Validators,
          as: 'validators'
        }, {
          model: OptionGroups,
          include: [{
            model: OptionChoices
          }]
        }]
      }]
    }], order: [
      [InspectionSection, 'id', 'asc'],
    ],
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { inspectionHeader: inspectionHeader });
};
module.exports.getWorkFlowForms = getWorkFlowForms;

const getInspectionSections = async function (req, res) {
  let body = req.body;
  [err, inspectionHeader] = await to(InspectionHeader.findOne({
    where: { name: body.formName },
    include: [{
      model: InspectionSection,
    }], order: [
      [InspectionSection, 'id', 'asc'],
    ],
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { inspectionHeader: inspectionHeader });
};
module.exports.getInspectionSections = getInspectionSections;

const getOptionChoices = async function (req, res) {
  let body = req.body;
  [err, optionGroup] = await to(OptionGroups.findOne({
    where: {
      optionGroupName: body.optionGroupName
    }, include: [{
      model: OptionChoices
    }]

  }));

  if (err) return ReE(res, err, 422);

  return ReS(res, { optionGroup: optionGroup });
};
module.exports.getOptionChoices = getOptionChoices;

const getAllInputTypes = async function (req, res) {

  [err, inputTypes] = await to(InputTypes.findAll());

  if (err) return ReE(res, err, 422);

  return ReS(res, { inputTypes: inputTypes });
};
module.exports.getAllInputTypes = getAllInputTypes;

const getAllInputTypeProperties = async function (req, res) {

  [err, inputTypeProperties] = await to(InputTypeProperties.findAll());

  if (err) return ReE(res, err, 422);

  return ReS(res, { inputTypeProperties: inputTypeProperties });
};
module.exports.getAllInputTypeProperties = getAllInputTypeProperties;

const getAllOptionGroups = async function (req, res) {

  [err, optionGroups] = await to(OptionGroups.findAll({
    include: [{
      model: OptionChoices
    }]
  }));

  if (err) return ReE(res, err, 422);

  return ReS(res, { optionGroups: optionGroups });
};
module.exports.getAllOptionGroups = getAllOptionGroups;

const getDynamicFieldQuestions = async function (req, res) {
  let body = req.body;
  [err, question] = await to(Questions.findAll({
    where: Sequelize.or(
      { id: body.id },
      { dynamicFieldQuestionId: body.id }
    ), include: [{
      model: InputTypes
    }, {
      model: InputTypeProperties
    }, {
      model: OptionGroups,
      include: [{
        model: OptionChoices
      }]
    }, {
      model: Validators,
      as: 'validators'
    }]
  }));

  if (err) return ReE(res, err, 422);

  return ReS(res, { questions: question });
};
module.exports.getDynamicFieldQuestions = getDynamicFieldQuestions;

const getDynamicFieldElementQuestion = async function (req, res) {
  let body = req.body;
  [err, question] = await to(Questions.findOne({
    where: { id: body.id },
    include: [{
      model: InputTypes
    }, {
      model: InputTypeProperties
    }]
  }));

  if (err) return ReE(res, err, 422);

  return ReS(res, { question: question });
};
module.exports.getDynamicFieldElementQuestion = getDynamicFieldElementQuestion;
