
const addInspectionHeader = async function (req, res) {
  let body = req.body;
  [err, inspectionNewHeader] = await to(InspectionHeader.create({
    name: body.name,
    instructions: body.desc,
    isForm: 0,
    inspectionReportType: body.type,
    customerId: req.user.customerId
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { inspectionHeader: inspectionNewHeader.toWeb() });
}
module.exports.addInspectionHeader = addInspectionHeader;

const getInputModelProperties = async function (req, res) {
  let body = req.body;
  [err, inputModelProperties] = await to(DynamicInputModelProperties.findAll({
    where: { inputTypeId: body.inputTypeId },
    attributes: { exclude: ['created', 'modified'] }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { inputModelProperties: inputModelProperties });
}
module.exports.getInputModelProperties = getInputModelProperties;

const addInputProperties = async function (req, res) {
  let body = req.body;
  let question = {
    'inputPropertyId': null,
    'optionGroupId': null,
    'optionChoiceId': [],
    'questionId': null,
    'validatorId': []
  };
  if (body.properties) {
    let validators = body.properties.validator ? body.properties.validator : [];
    if (validators) {
      for (let i = 0; i < validators.length; i++) {
        if (validators[i]) {
          if (validators[i].keyName === 'minLength') {
            body.properties.min = validators[i].keyValue;
          }
          if (validators[i].keyName === 'maxLength') {
            body.properties.max = validators[i].keyValue;
          }
        }
      }
    }
    [err, inputProperties] = await to(InputTypeProperties.create((body.properties)));
    if (err) return ReE(res, err, 422);
    if (inputProperties) {
      question = { 'inputPropertyId': inputProperties.propertyId };
    }
    if (body.properties.optionGroup) {
      body.properties.optionGroup.optionGroupName = 'customGroup' + question['inputPropertyId'];
      [err, optionGroups] = await to(OptionGroups.create((body.properties.optionGroup)));
      if (err) return ReE(res, req, 422);
      if (optionGroups) {
        question['optionGroupId'] = optionGroups.id;
      }
    }
    if (body.properties.optionChoices && question && question['optionGroupId']) {
      for (let i = 0; i < body.properties.optionChoices.length; i++) {
        body.properties.optionChoices[i].optionGroupId = question['optionGroupId'];
        [err, optionChoices] = await to(OptionChoices.create((body.properties.optionChoices[i])));
        if (!question['optionChoiceId']) {
          question['optionChoiceId'] = [];
        }
        if (optionChoices) {
          question['optionChoiceId'].push(optionChoices.id);
        }
      }
      if (err) return ReE(res, req, 422);
    }

    if (body.properties && body.properties.resourceId) {
      question['optionGroupId'] = body.properties ? body.properties.resourceId : null;
    }
    let questionObj = {
      inspectionSectionId: body.properties.sectionId, inputTypeId: body.properties.inputTypeId,
      questionName: body.properties.id, optionGroupId: question['optionGroupId'], dynamicFieldQuestionId: null,
      inputTypePropertyId: inputProperties.propertyId, displayPositionIndex: body.properties.position
    };
    if (body.properties.dynamicFieldId) {
      questionObj.dynamicFieldQuestionId = body.properties.dynamicFieldId;
    }
    [err, inspectionQuestions] = await to(Questions.create((questionObj)));
    if (err) return ReE(res, err, 422);
    question['questionId'] = inspectionQuestions.id;

    if (validators) {
      for (let i = 0; i < validators.length; i++) {
        if (validators[i]) {
          validators[i].questionId = question['questionId'];
          [err, validator] = await to(Validators.create(validators[i]));
          if (err) return ReE(res, err, 422);
          if (validator) {
            if (!question['validatorId']) {
              question['validatorId'] = [];
            }
            question.validatorId.push(validator.id);
          }
        }
      }
    }
  }
  return ReS(res, { response: question });
}
module.exports.addInputProperties = addInputProperties;

const updateInputProperties = async function (req, res) {
  let body = req.body;
  let validators = body.property.validator;
  if (validators) {
    for (let i = 0; i < validators.length; i++) {
      if (validators[i]) {
        if (validators[i].keyName === 'minLength') {
          body.property.min = validators[i].keyValue ? validators[i].keyValue : null;
        }
        if (validators[i].keyName === 'maxLength') {
          body.property.max = validators[i].keyValue ? validators[i].keyValue : null;
        }
        if (((!validators[i].keyValue && validators[i].keyName !== 'required') ||
          (!validators[i].errorMessage && validators[i].keyName === 'required')) &&
          body.indices.validatorId && body.indices.validatorId[i]) {
          [err, updatedValidator] = await to(Validators.destroy({
            where: {
              id: body.indices.validatorId[i]
            }
          }));
          if (err) return ReE(res, err, 422);

        } else if (validators[i].keyName && validators[i].keyValue && body.indices && body.indices.validatorId && body.indices.validatorId[i]) {
          [err, updateValidator] = await to(Validators.update(validators[i], {
            where: {
              id: body.indices.validatorId[i]
            }
          }));
          if (err) return ReE(res, err, 422);

        } else if (((body.indices.validatorId && !body.indices.validatorId[i]) || (!body.indices.validatorId)) && validators[i] &&
          validators[i].keyName) {
          validators[i].questionId = body.indices.questionId;
          [err, validator] = await to(Validators.create(validators[i]));
          if (err) return ReE(res, err, 422);
          if (body.indices && !body.indices.validatorId) {
            body.indices.validatorId = [];
          }
          if (body.indices && body.indices.validatorId) {
            body.indices.validatorId.push(validator.id);
          }
        }
      }
    }
  }
  if (body.property.optionChoices && body.indices && body.indices['optionGroupId']) {
    for (let i = 0; i < body.property.optionChoices.length; i++) {
      body.property.optionChoices[i].optionGroupId = body.indices['optionGroupId'];
      if (body.property.optionChoices && body.property.optionChoices[i] && body.property.optionChoices[i].id !== undefined && body.property.optionChoices[i].id !== null) {
        [err, optionsupdated] = await to(OptionChoices.update(body.property.optionChoices[i], {
          where: { id: body.property.optionChoices[i].id }
        }));
      } else if (body.property && body.property.optionChoices && body.property.optionChoices[i]
        && !body.property.optionChoices[i].id) {
        [err, optionChoices] = await to(OptionChoices.create((body.property.optionChoices[i])));
        if (optionChoices) {
          body.indices['optionChoiceId'].push(optionChoices.id);
        }
      }
    }
  }
  if (body.property.optionChoices && body.indices && !body.indices['optionGroupId']) {
    for (let i = 0; i < body.property.optionChoices.length; i++) {
      body.property.optionChoices[i].optionGroupId = body.indices['optionGroupId'] ? body.indices['optionGroupId'] : null;
      [err, optionChoiceAdded] = await to(OptionChoices.create((body.property.optionChoices[i])));
      if (optionChoiceAdded) {
        body.indices['optionChoiceId'].push(optionChoiceAdded.id);
      }
    }
  }
  if (body.property && body.property.resourceId) {
    body.indices['optionGroupId'] = body.property.resourceId;
  }
  if (body.indices && body.indices.inputPropertyId) {
    [err, inputProperties] = await to(InputTypeProperties.update(body.property, {
      where: { propertyId: body.indices.inputPropertyId }
    }));
  }

  let questionObj = {
    questionName: body ? (body.property ? body.property.id : null) : null,
    optionGroupId: body.indices ? (body.indices.optionGroupId ? body.indices.optionGroupId : null) : null
  };
  if (body.indices && body.indices.questionId) {
    [err, inspectionQuestions] = await to(Questions.update(questionObj, {
      where: { id: body.indices.questionId }
    }));
  }

  if (err) return ReE(res, err, 422);
  return ReS(res, { response: body.indices['optionChoiceId'] });
}
module.exports.updateInputProperties = updateInputProperties;

const addInspectionSection = async function (req, res) {
  let body = req.body;
  [err, inspectionSections] = await to(InspectionSection.create((body.section)));
  if (err) return ReE(res, err, 422);
  return ReS(res, { inspectionSections: inspectionSections.toWeb() });
}
module.exports.addInspectionSection = addInspectionSection;

const addOptionGroup = async function (req, res) {
  let body = req.body;
  [err, optionGroups] = await to(OptionGroups.create((body)));
  if (err) return ReE(res, req, 422);
  return ReS(res, { optionGroup: optionGroups.toWeb() });
}
module.exports.addOptionGroup = addOptionGroup;

const addOptionChoices = async function (req, res) {
  let body = req.body;
  let optionsadded = [];
  if (body.optionChoices.length > 0) {
    for (let i = 0; i < body.optionChoices.length; i++) {
      [err, optionChoices] = await to(OptionChoices.create((body.optionChoices[i])));
      optionsadded.push(optionChoices);
    }
  }
  if (err) return ReE(res, req, 422);
  return ReS(res, { optionChoices: optionsadded });
}
module.exports.addOptionChoices = addOptionChoices;

const addMoreOptionChoices = async function (req, res) {
  let body = req.body;
  let optionsadded = [];
  for (let i = 1; i < body.optionChoices.length; i++) {
    let data = String(body.optionChoices[i]).split(',');
    if (body.optionChoices[i] !== '') {
      //add wind turbine detail
      [err, optionGroup] = await to(OptionGroups.findOne({
        where: { optionGroupName: data[0] }
      }));
      if (err) return ReE(res, err, 422);
      [err, optionChoices] = await to(OptionChoices.findOrCreate({
        where: {
          optionGroupId: optionGroup ? optionGroup.id : null,
          optionChoiceName: data[1],
          optionChoicesValue: data[1]
        },
        defaults: {
          optionGroupId: optionGroup ? optionGroup.id : null,
          optionChoiceName: data[1],
          optionChoicesValue: data[1]
        }
      }));
      if (optionChoices) {
        optionsadded.push(optionChoices[0]);
      }
    }
  }
  if (err) return ReE(res, err, 422);
  return ReS(res, { optionChoices: optionsadded });
}
module.exports.addMoreOptionChoices = addMoreOptionChoices;

const editSectionName = async function (req, res) {
  let body = req.body;
  [err, inspectionSection] = await to(InspectionSection.update({ sectionName: body.editedName }, { where: { id: body.sectionId } }));

  if (err) return ReE(res, err, 422);
  return ReS(res, { inspectionSection: inspectionSection })
}
module.exports.editSectionName = editSectionName;

const getSectionDetails = async function (req, res) {
  let body = req.body;
  [err, inspectionSection] = await to(InspectionSection.findAll(
    {
      where: { inspectionHeaderId: body.headerId, id: body.sectionId },
      attributes: ['id', 'inspectionHeaderId', 'sectionName'],
      include: [{
        model: Questions,
        attributes: { exclude: ['created', 'modified'] },
        include: [{
          model: InputTypeProperties,
          attributes: { exclude: ['created', 'modified'] }
        }, { model: Validators, as: 'validators', attributes: { exclude: ['created', 'modified'] } },
        {
          model: InputTypes,
          attributes: ['inputTypeName', 'iconName']
        }, {
          model: OptionGroups,
          include: [{
            model: OptionChoices
          }]
        }]
      }]
    }))
  if (err) return ReE(res, err, 422);
  return ReS(res, { inspectionSection: inspectionSection })
}
module.exports.getSectionDetails = getSectionDetails;

const deleteInputProperty = async function (req, res) {
  let body = req.body;
  [err, inputProperty] = await to(InputTypeProperties.destroy({
    where: { propertyId: body.id['inputPropertyId'] }
  }));
  if (err) return ReE(res, err, 422);
  if (body.id.dynamicPro) {
    for (let i = 0; i < body.id.dynamicPro.length; i++) {
      if (body.id.dynamicPro[i] && body.id.dynamicPro[i]['inputPropertyId']) {
        [err, inputProperties] = await to(InputTypeProperties.destroy({
          where: { propertyId: body.id.dynamicPro[i]['inputPropertyId'] }
        }));
      }
      if (body.id.dynamicPro[i] && body.id.dynamicPro[i]['optionGroupId']) {
        [err, optionGroups] = await to(OptionGroups.destroy({
          where: Sequelize.and({ id: body.id.dynamicPro[i]['optionGroupId'] }, { isResource: 0 })
        }));
      }
    }
  }
  if (body.id.optionGroupId) {
    [err, optionGroups] = await to(OptionGroups.destroy({
      where: { id: body.id['optionGroupId'] }
    }));
    if (err) return ReE(res, err, 422);
  }
  return ReS(res, { inputProperty: inputProperty });
}
module.exports.deleteInputProperty = deleteInputProperty;

const deleteOptionGroup = async function (req, res) {
  let body = req.body;
  let err;
  [err, questions] = await to(Questions.findOne({
    where: { optionGroupId: body.id }, attributes: ['optionGroupId']
  }));
  if (questions == null) {
    [err, optionGroups] = await to(OptionGroups.destroy({
      where: { id: body.id }
    }));
  } else if (questions.optionGroupId) {
    err = ERROR.invalid_resource_deletion;
  }
  if (err) return ReE(res, err, 422);
  return ReS(res, { optionGroups: optionGroups })
}
module.exports.deleteOptionGroup = deleteOptionGroup;

const deleteOptionChoices = async function (req, res) {
  let body = req.body;
  [err, optionChoices] = await to(OptionChoices.destroy({
    where: { id: body.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { optionChoices: optionChoices })
}
module.exports.deleteOptionChoices = deleteOptionChoices;


const deleteInspectionSection = async function (req, res) {
  let body = req.body;
  [err, inspectionSection] = await to(InspectionSection.findAll(
    {
      where: { id: body.id },
      include: [{
        model: Questions,
      }]
    }));
  if (inspectionSection) {
    for (let i = 0; i < inspectionSection.length; i++) {
      if (inspectionSection[i]) {
        for (let j = 0; j < inspectionSection[i].questions.length; j++) {
          if (inspectionSection[i].questions[j]) {
            [err, inputTypeProperty] = await to(InputTypeProperties.destroy({
              where: { propertyId: inspectionSection[i].questions[j].inputTypePropertyId }
            }));
            if (inspectionSection[i].questions[j].optionGroupId !== null) {
              [err, optionGroup] = await to(OptionGroups.destroy({
                where: { id: inspectionSection[i].questions[j].optionGroupId }
              }));
            }
          }
        }
      }

    }
  }
  [err, inspectionSection] = await to(InspectionSection.destroy({
    where: { id: body.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { inspectionSection: inspectionSection })
}
module.exports.deleteInspectionSection = deleteInspectionSection;


const updateOptionChoices = async function (req, res) {
  let body = req.body;
  const options = [];
  for (let i = 0; i < body.options.length; i++) {
    if (body.options && body.options[i].id !== undefined && body.options[i].id !== null) {
      [err, optionsupdated] = await to(OptionChoices.update(body.options[i], {
        where: { id: body.options[i].id }
      }));
    } else if (body.options[i].id === undefined) {
      [err, optionChoices] = await to(OptionChoices.create((body.options[i])));
      options.push(optionChoices);
    }
  }
  if (err) return ReE(res, err, 422);
  return ReS(res, { optionChoices: options })
}
module.exports.updateOptionChoices = updateOptionChoices;

const editInspectionHeader = async function (req, res) {
  let body = req.body;
  [err, inspectionHeader] = await to(InspectionHeader.update({
    name: body.name,
    instructions: body.desc,
    inspectionReportType: body.type
  }, {
      where: {
        id: body.id
      }
    }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { inspectionHeader: inspectionHeader });
}
module.exports.editInspectionHeader = editInspectionHeader;

const deleteInspectionHeader = async function (req, res) {
  let body = req.body;
  [err, inspectionSection] = await to(InspectionSection.findAll(
    {
      where: { inspectionHeaderId: body.id },
      include: [{
        model: Questions,
      }]
    }));
  if (inspectionSection) {
    for (let i = 0; i < inspectionSection.length; i++) {
      if (inspectionSection[i]) {
        for (let j = 0; j < inspectionSection[i].questions.length; j++) {
          if (inspectionSection[i].questions[j]) {
            [err, inputTypeProperty] = await to(InputTypeProperties.destroy({
              where: { propertyId: inspectionSection[i].questions[j].inputTypePropertyId }
            }));
            if (inspectionSection[i].questions[j].optionGroupId !== null) {
              [err, optionGroup] = await to(OptionGroups.destroy({
                where: { id: inspectionSection[i].questions[j].optionGroupId }
              }));
            }
          }
        }
      }

    }
  }
  [err, inspectionHeader] = await to(InspectionHeader.destroy({
    where: { id: body.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { inspectionHeader: inspectionHeader });
}
module.exports.deleteInspectionHeader = deleteInspectionHeader;

const changeInspectionStatus = async function (req, res) {
  let body = req.body;
  let err, inspectionHeader;
  [err, inspectionHeader] = await to(InspectionHeader.update({
    isActive: body.isActive,
    modified: new Date(Date.now())
  },
    {
      where: {
        id: body.inspectionHeaderId
      }
    }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { inspectionHeader: inspectionHeader });
}
module.exports.changeInspectionStatus = changeInspectionStatus;


const getResourceList = async function (req, res) {
  [err, resourcelist] = await to(OptionGroups.findAll(
    {
      where: { isResource: 1 },
      attributes: ['id', 'optionGroupName', 'created'],
      include: [{
        model: OptionChoices,
        attributes: { exclude: ['id', 'created', 'modified'] }
      }]
    }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { resourcelist: resourcelist });
}
module.exports.getResourceList = getResourceList;

const updateOptionGroup = async function (req, res) {
  let body = req.body;
  [err, optionGroup] = await to(OptionGroups.update(body.optionGroup, {
    where: { id: body.optionGroup.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { optionGroup: optionGroup })
}
module.exports.updateOptionGroup = updateOptionGroup;