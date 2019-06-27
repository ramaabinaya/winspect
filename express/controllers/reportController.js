
var _ = require('lodash');
var PdfPrinter = require('pdfmake/src/printer');
var fs = require('fs');
const path = require('path');

/**
 * asnync function to get report details.
 * If error occurs return the error response 
 * otherwise return the sucess response.
 */
const getReport = async function (req, res) {
  let body = req.body;
  //get report table row for the given id

  [err, report] = await to(reportService.getReport(req.user, body.reportId));
  if (err) return ReE(res, err, 422);
  // To get signed url for the image filename in s3 bucket for display.
  if (report && report.assignInspectionUser && report.assignInspectionUser.inspectionHeader) {
    if (report.assignInspectionUser.inspectionHeader.inspectionSections && report.assignInspectionUser.inspectionHeader.inspectionSections.length > 0) {
      const sections = report.assignInspectionUser.inspectionHeader.inspectionSections;

      for (let i = 0; i < sections.length; i++) {
        const questions = sections[i] ? sections[i].questions : [];
        if (questions && questions.length > 0) {
          for (let j = 0; j < questions.length; j++) {
            const answersCopy = questions[j].answers;
            if (answersCopy && answersCopy.length > 0) {
              for (let k = 0; k < answersCopy.length; k++) {

                if (answersCopy[k].imageAnswers && answersCopy[k].imageAnswers.length > 0) {
                  [err, imgWithUrl] = await to(s3DataService.getImageUrl(answersCopy[k].imageAnswers));
                  if (err) {
                    logger.error('error in get image url' + err);
                  } else if (imgWithUrl) {
                    answersCopy[k].imageAnswers = imgWithUrl;
                    if (j === questions.length - 1 && i === sections.length - 1 && answersCopy.length - 1 === k) {
                      return ReS(res, { report: report });
                    }
                  }
                } else if (answersCopy.length - 1 === k && j === questions.length - 1 && i === sections.length - 1) {
                  return ReS(res, { report: report });
                }
              }
            } else if (j === questions.length - 1 && i === sections.length - 1) {
              return ReS(res, { report: report });
            }
          }
        } else if (i === sections.length - 1) {
          return ReS(res, { report: report });
        }
      }
    }
  }

};
module.exports.getReport = getReport;

const create = async function (req, res) {
  let body = req.body;
  [err, assignInspectionUsers] = await to(AssignInspectionUsers.update(
    {
      inspectionStatusId: body.status,
      modified: new Date(Date.now())
    },
    { where: { id: body.report.assignedInspectionUserId } }));
  if (err) TE(err.message);

  [err, report] = await to(Report.create(body.report));
  if (err) return ReE(res, err, 422);

  return ReS(res, { report: report });
};
module.exports.create = create;

const createSection = async function (req, res) {
  let body = req.body;
  let optionChoiceAnswers;
  let answers = [];

  for (i = 0; i < body.answers.length; i++) {
    body.answers[i].elementArray = body.answers[i].elementArray > -1 ? body.answers[i].elementArray : null;
    if (body.answers[i].Id !== undefined && body.answers[i].Id !== null && body.answers[i].mode) {
      if (body.answers[i].mode === 'D') {
        [err, updatedAnswer] = await to(Answers.destroy({
          where: {
            Id: body.answers[i].Id
          }
        }));
        if (err) return TE(err.message);
        answers.push(updatedAnswer);
      } else if (body.answers[i].mode === 'U') {
        [err, updatedAnswer] = await to(Answers.update(body.answers[i], {
          where: {
            Id: body.answers[i].Id
          }
        }));
        if (err) return TE(err.message);
        answers.push(updatedAnswer);
      }
    } else {
      [err, answer] = await to(Answers.findOrCreate({
        where: {
          reportId: body.answers[i].reportId,
          questionId: body.answers[i].questionId,
          elementArray: {
            [Sequelize.Op.eq]: body.answers[i].elementArray
          }
        },
        defaults: body.answers[i]
      }));
      if (err) TE(err.message);
      if (answer[0] && answer[1]) {
        answers.push(answer[0]);
      } else if (answer[0]) {
        [err, answer] = await to(Answers.update(body.answers[i], {
          where: {
            reportId: body.answers[i].reportId,
            questionId: body.answers[i].questionId,
            elementArray: {
              [Sequelize.Op.eq]: body.answers[i].elementArray
            }
          }
        }));
        if (err) TE(err.message);
        answers.push(answer);
      }
    }
  }

  if (body.optionChoiceAnswers) {
    [err, optionChoiceAnswers] = await to(storOptionChoiceService.storeChoices(body.optionChoiceAnswers));
    if (err) TE(err.message);
  }

  return ReS(res, { answers: answers, optionChoiceAnswers: optionChoiceAnswers });

};
module.exports.createSection = createSection;

const storeAnswerForImages = async function (req, res) {
  let answers;
  const body = req.body;
  [err, answer] = await to(Answers.findOrCreate({
    where: {
      reportId: body.reportId,
      questionId: body.questionId,
      elementArray: {
        [Sequelize.Op.eq]: body.elementArray
      }
    },
    defaults: body
  }));
  if (err) TE(err.message);

  if (answer[0]) {
    answers = answer[0];
  }
  return ReS(res, { answer: answers });
};
module.exports.storeAnswerForImages = storeAnswerForImages;

const storeImage = async function (req, res) {
  let imageAnswers;
  let thumanilImgData;
  const body = req.body;
  const image = body.image;
  body.image.elementArray = body.image.elementArray > -1 ? body.image.elementArray : null;
  if (image && image.id) {
    if (image.mode === 'D') {

      [err, thumnailImageData] = await to(s3DataService.deleteImage(image.thumnailImage));
      if (err) return ReE(res, err, 422);
      else logger.info('image deleted ' + thumnailImageData);

      [err, imageData] = await to(s3DataService.deleteImage(image.imageLocation));
      if (err) return ReE(res, err, 422);
      else logger.info('image deleted ' + imageData);

      [err, imageAnswer] = await to(ImageAnswers.destroy({
        where: { id: image.id }
      }));
      if (err) TE(err.message);
      imageAnswers = imageAnswer;
    } else if (image.mode === 'R' && image.imageUrl) {

      const paths = image.imageUrl.split('/');
      let imagePath = paths[paths.length - 1];
      imagePath = imagePath.split('?');
      // for the thumnail image.
      const thumnailImgPaths = image.thumnailImgUrl ? image.thumnailImgUrl.split('/') : [];
      let thumnailPath = thumnailImgPaths[thumnailImgPaths.length - 1];
      thumnailPath = thumnailPath.split('?');
      const thumnailImgData = image.thumnailImage.split(';base64,').pop();
      console.log('filenme in image upload', thumnailPath[0], imagePath[0]);

      const thumanilImageCopy = { filename: thumnailPath[0], imageData: thumnailImgData };
      [err, data] = s3DataService.uploadImage(thumanilImageCopy);
      if (err) {
        return ReE(res, err, 422);
      } else {
        logger.info('thumnail edited');
      }
      image.imageLocation = filename;
      image.thumnailImage = thumanilImageName;
      [err, imageAnswer] = await to(ImageAnswers.create(image));
      if (err) TE(err.message);

      const imageData = image.imageLocation.split(';base64,').pop();
      const imageCopy = { filename: imagePath[0], imageData: imageData };
      [error, imagedata] = s3DataService.uploadImage(imageCopy);
      if (err) {
        return ReE(res, err, 422);
      } else {
        if (image.description) {
          [err, imageAnswer] = await to(ImageAnswers.update({ description: image.description }, {
            where: { id: image.id }
          }));

          if (err) TE(err.message);
          imageAnswers = imageAnswer;
        }
      }

    } else {
      [err, imageAnswer] = await to(ImageAnswers.update({ description: image.description }, {
        where: { id: image.id }
      }));
      if (err) TE(err.message);
      imageAnswers = imageAnswer;
    }
  } else if (image) {
    console.log('in image upload', image);
    const imageData = image.imageLocation.split(';base64,').pop();

    if (image.thumnailImage) {
      thumanilImgData = image.thumnailImage.split(';base64,').pop();
    }

    if (err) {
      logger.error('error in thumanail image updation' + err);
    }

    const filename = "image" + (new Date().getTime().toString()) + ".png";
    const thumanilImageName = "previewImg" + (new Date().getTime().toString()) + ".png";
    const imageCopy = { filename: filename, imageData: imageData };
    [err, data] = await to(s3DataService.uploadImage(imageCopy));
    if (err) {
      return err;
    } else {
      const thumnailImage = { filename: thumanilImageName, imageData: thumanilImgData };
      [err, thumnailData] = await to(s3DataService.uploadImage(thumnailImage));
      if (err) return ReE(res, err, 422);
      if (thumnailData) {
        image.imageLocation = filename;
        image.thumnailImage = thumanilImageName;
        [err, imageAnswer] = await to(ImageAnswers.create(image));
        if (err) TE(err.message);
        imageAnswers = imageAnswer;
      }
    }
  }
  return ReS(res, { imageAnswers: imageAnswers });
};
module.exports.storeImage = storeImage;

const getAnswers = async function (req, res) {
  let body = req.body;

  [err, answers] = await to(Answers.findAll({
    where: { reportId: body.reportId },
    include: [{
      model: OptionChoiceAnswers,
    }, {
      model: ImageAnswers
    }]
  }));
  if (answers && answers.length > 0) {
    for (let k = 0; k < answers.length; k++) {

      if (answers[k].imageAnswers && answers[k].imageAnswers.length > 0) {
        [err, imgWithUrl] = await to(s3DataService.getImageUrl(answers[k].imageAnswers));
        if (err) {
        } else if (imgWithUrl) {
          answers[k].imageAnswers = imgWithUrl;
          if (answers.length - 1 === k) {
            return ReS(res, { answers: answers });
          }
        }
      } else if (answers.length - 1 === k) {
        return ReS(res, { answers: answers });
      }
    }
  }
  if (err) return ReE(res, err, 422);

  return ReS(res, { answers: answers });
};
module.exports.getAnswers = getAnswers;

const getreportlistdetails = async function (req, res) {
  let body = req.user;
  [err, assignInspectionUsers] = await to(AssignInspectionUsers.findAll(
    {
      where: {
        userId: body.id
      },
      include: [{
        model: Report,
        as: 'report',
        include: [{
          model: Answers,
          include: [{
            model: OptionChoiceAnswers
          },
          {
            model: ImageAnswers,
          }],
        }]

      }, {
        model: InspectionStatus,
        attributes: ['name']
      }]
    }));
  if (err) TE(err.message);

  return ReS(res, { assignInspectionUsers: assignInspectionUsers });
};
module.exports.getreportlistdetails = getreportlistdetails;


const reportlist = async function (req, res) {
  let body = req.body;
  [err, assignInspectionUsers] = await to(AssignInspectionUsers.findAll(
    {
      where: { userId: req.user.id },
      include: [{
        model: Report,
        as: 'report',
        where: { active: body.active }
      },
      {
        model: InspectionHeader,
        as: 'inspectionHeader',
        attributes: ['name']
      },
      {
        model: InspectionStatus,
        attributes: ['name']
      }, {
        model: Windfarm,
        as: 'windfarm',
        attributes: ['name']
      }, {
        model: UserAccount,
        as: 'user',
        attributes: ['firstName', 'lastName']
      }]
    },
  ));
  if (err) TE(err.message);

  return ReS(res, { assignInspectionUsers: assignInspectionUsers });
};
module.exports.reportlist = reportlist;

const getallreports = async function (req, res) {
  let body = req.body;
  let user = req.user;
  if (user && user.userRole === 'Technician' && user.id) {
    body.userId = user.id;
  } else if (user && user.userRole === 'Client') {
    [err, windFarms] = await to(ClientWindFarm.findAll({
      where: { clientId: user.clientId },
      attributes: ['windFarmId']
    }));
    body.windFarmId = windFarms[0].windFarmId;
    if (err) ReE(res, err, 422);
  }

  [err, assignInspectionUsers] = await to(AssignInspectionUsers.findAll(

    {
      include: [
        {
          model: Report,
          as: 'report',
          where: { active: body.active != undefined ? body.active : { [Sequelize.Op.ne]: null } }
        },
        {
          required: true,
          model: InspectionHeader,
          as: 'inspectionHeader',
          attributes: ['name']
        },
        {
          required: true,
          model: InspectionStatus,
          attributes: ['name'],
          where: { name: body.status ? body.status : { [Sequelize.Op.ne]: null } }
        },
        {
          model: Windfarm,
          as: 'windfarm',
          attributes: ['name'],
          where: { id: body.windFarmId ? body.windFarmId : { [Sequelize.Op.ne]: null } }
        }, {
          model: UserAccount,
          as: 'user',
          attributes: ['firstName', 'lastName'],
          where: { id: body.userId ? body.userId : { [Sequelize.Op.ne]: null } }
        }],
      offset: body.offset,
      limit: body.limit,
      subQuery: false
    },
  ));

  if (err) TE(err.message);

  return ReS(res, { assignInspectionUsers: assignInspectionUsers });
};
module.exports.getallreports = getallreports;

const changeReportStatus = async function (req, res) {
  let body = req.body;
  //update the active column of the report to inactive when condition satisfied
  [err, report] = await to(Report.update({ active: body.active, modified: new Date(Date.now()) }, { where: { id: body.reportId } }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { report: report });
};
module.exports.changeReportStatus = changeReportStatus;

const changeAllReportStatus = async function (req, res) {
  let body = req.body;
  let archId = body.archId;
  let err, report;
  //update the active column of the report to inactive when condition satisfied
  for (let i = 0; i < archId.length; i++) {
    [err, report] = await to(Report.update({ active: body.active }, { where: { id: archId[i] } }));
  }
  if (err) return ReE(res, err, 422);

  return ReS(res, { report: report });
};
module.exports.changeAllReportStatus = changeAllReportStatus;

const getTurbineReport = async function (req, res) {
  let body = req.body;

  [err, report] = await to(Report.findAll({
    where: { windturbineId: body.turbineId },
    include: [{
      model: AssignInspectionUsers,
      attributes: ['userId'],
    }, {
      model: Answers,
      include: [{
        model: OptionChoiceAnswers
      },
      {
        model: ImageAnswers,
      }],
    }], order: [
      ['bladeType', 'desc'],
    ],
  }));
  if (err) TE(err.message);

  return ReS(res, { report: report });
}
module.exports.getTurbineReport = getTurbineReport;

const deleteReport = async function (req, res) {
  let body = req.body;
  //To delete the report that match with the provided report id.
  [err, report] = await to(Report.findOne({
    where: {
      assignedInspectionUserId: body.assignedInspectionUserId
    }, include: [{
      model: Answers,
      include: [{
        model: ImageAnswers,
        where: {
          imageLocation: {
            [Sequelize.Op.ne]: null
          }
        }
      }],
    }]
  }));

  if (report && report.answers && report.answers.length > 0) {
    report.answers.forEach((item) => {
      if (item && item.imageAnswers && item.imageAnswers.length > 0) {
        item.imageAnswers.forEach((image) => {
          if (image && image.thumnailImage) {
            [err, thumnailImageData] = s3DataService.deleteImage(image.thumnailImage);
            if (err) return ReE(res, err, 422);
            else logger.info('image deleted ' + thumnailImageData);
          }
          if (image.imageLocation) {
            [err, imageData] = s3DataService.deleteImage(image.imageLocation);
            if (err) return ReE(res, err, 422);
            else logger.info('image deleted ' + imageData);

            // [err, imageAnswer] = await to(ImageAnswers.destroy({
            //   where: { id: image.id }
            // }));
          }
        });
      }
    });
  }

  [err, assignedInspectionUser] = await to(AssignInspectionUsers.destroy({
    where: {
      id: body.assignedInspectionUserId
    }
  }));
  if (err) return ReE(res, err, 422);

  assignedInspectionUser.report = report;
  return ReS(res, { assignedInspectionUser: assignedInspectionUser });
};
module.exports.deleteReport = deleteReport;

const changeAssignedInspectionStatus = async function (req, res) {
  let body = req.body;
  [err, report] = await to(Report.findOne({
    where: { Id: body.reportId }
  }));
  if (err) return ReE(res, err, 422);

  [err, updatedAssignInspectionUsers] = await to(AssignInspectionUsers.update({
    inspectionStatusId: body.statusId,
    modified: new Date(Date.now())
  }, {
      where: {
        id: report.assignedInspectionUserId
      }
    }));
  if (err) return ReE(res, err, 422);

  [err, assignInspectionUsers] = await to(AssignInspectionUsers.findOne({
    where: {
      id: report.assignedInspectionUserId
    }, include: [{
      model: InspectionStatus,
      attributes: ['name']
    }]
  }
  ));

  return ReS(res, { assignInspectionUsers: assignInspectionUsers });
};
module.exports.changeAssignedInspectionStatus = changeAssignedInspectionStatus;

//new code
const changeAssignedInspectionDueDate = async function (req, res) {
  let body = req.body;
  let err, assignInspectionUsers;
  [err, assignInspectionUsers] = await to(AssignInspectionUsers.update({
    dueDate: body.dueDate,
    modified: new Date(Date.now())
  }, {
      where: {
        Id: body.reportId
      }
    }));

  return ReS(res, { changeAssignInspectiondate: assignInspectionUsers });
};
module.exports.changeAssignedInspectionDueDate = changeAssignedInspectionDueDate;


const createPDF = async function (req, res) {
  const body = req.body;
  let loopCompleted = false;
  [err, customerarr] = await to(Customer.findAll({
    where: { id: req.user.customerId }
  }));
  let logoImage;
  if (customerarr && customerarr[0]) {
    const logoPath = customerarr[0].logoLocation;
    if (logoPath) {
      const imageData = [{ imageLocation: logoPath }];
      [err, logo] = await to(s3DataService.getImage(imageData, CONFIG.aws_logo_dir_name));
      if (err) ReE(res, err, 422);
      logoImage = logo[0].imageLocation;
    }
  }
  [err, report] = await to(reportService.getReport(req.user, body.reportId));
  if (err) return ReE(res, err, 422);
  if (report) {
    if (report && report.assignInspectionUser && report.assignInspectionUser.inspectionHeader) {
      if (report.assignInspectionUser.inspectionHeader.inspectionSections && report.assignInspectionUser.inspectionHeader.inspectionSections.length > 0) {
        const sections = report.assignInspectionUser.inspectionHeader.inspectionSections;

        for (let i = 0; i < sections.length; i++) {
          const questions = sections[i] ? sections[i].questions : [];
          if (questions && questions.length > 0) {
            for (let j = 0; j < questions.length; j++) {
              const answersCopy = questions[j].answers;
              if (answersCopy && answersCopy.length > 0) {
                for (let k = 0; k < answersCopy.length; k++) {

                  if (answersCopy[k].imageAnswers && answersCopy[k].imageAnswers.length > 0) {
                    [err, imgWithUrl] = await to(s3DataService.getImage(answersCopy[k].imageAnswers, CONFIG.aws_img_dir_name));
                    if (err) {
                      logger.error('error in getting image url err', err);
                    } else {
                      answersCopy[k].imageAnswers = imgWithUrl;
                      if (j === questions.length - 1 && i === sections.length - 1 && answersCopy.length - 1 === k) {
                        loopCompleted = true;
                      }
                    }
                  } else if (answersCopy.length - 1 === k && j === questions.length - 1 && i === sections.length - 1) {
                    loopCompleted = true;
                  }
                }
              } else if (j === questions.length - 1 && i === sections.length - 1) {
                loopCompleted = true;
              }
            }
          }
        }
      }
    }
  }
  if (report && loopCompleted) {

    var fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
      }
    };
    var content = [];
    var fieldContent = [];
    // var logo_path = logoLocation;
    var tableObject = {
      style: 'tableExample',
      table: {
        widths: ['40%', '60%'],
        body: []
      }
    };
    var docDefinition = {
      // pageSize: 'A5',
      content:
        [

        ],
      styles: {
        tableExample: {
          margin: [0, 10, 0, 15],
        }, tableHeader: {
          bold: true,
          fontSize: 13,
          margin: [0, 0, 0, 0],
        }, header: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 0],
        }, subHeader: {
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 0],
        },
      }
    }
    var printer = new PdfPrinter(fonts);
    var i = 0;
    if (report.assignInspectionUser && report.assignInspectionUser.inspectionHeader && report.assignInspectionUser.inspectionHeader.inspectionSections) {
      for (section of report.assignInspectionUser.inspectionHeader.inspectionSections) {
        let answerTable = [];
        let dynamicFieldQuestions = [];
        let questionsWithAnswers = [];
        let sectionAdded = false;
        let subCategoryQuestion;
        if (section && section.questions && section.questions.length > 0) {
          sectionAdded = false;
          questionsWithAnswers = [];
          dynamicFieldQuestions = [];
          for (let qusId in section.questions) {
            let question = section.questions[qusId] ? section.questions[qusId] : null;
            i++;
            bodyData = [];
            answerTable = ['No Response']
            if (question && (question.answerRequiredYN === 1 || question.subCategory !== 1)) {
              if (question.answers !== null && question.answers !== undefined && question.answers.length > 0) {
                answerTable = [];
                if (!sectionAdded) {
                  sectionAdded = true;
                  if (section.isCommon) {
                    if (logoImage) {
                      docDefinition.content.push({
                        columns: [
                          { text: section.sectionName, style: 'header' },
                          {
                            image: logoImage,
                            width: 100
                          },]
                      });
                      logoImage = null;
                    } else {
                      docDefinition.content.push({
                        columns: [
                          { text: section.sectionName, style: 'header' }]
                      });
                    }
                  } else {
                    if (logoImage) {
                      docDefinition.content.push({
                        columns: [
                          {},
                          {
                            image: logoImage,
                            width: 100
                          },]
                      });
                      logoImage = null;
                    }
                    tableObject.table.body.push([{ text: section.sectionName, colSpan: 2, style: 'tableHeader' }, {}]);
                  }
                }
                if (subCategoryQuestion) {
                  if (section.isCommon) {
                    docDefinition.content.push({
                      columns: [
                        { text: subCategoryQuestion, style: 'subHeader' }]
                    });
                  } else {
                    questionsWithAnswers.push({ subCategoryQuestion: subCategoryQuestion });
                  }
                  subCategoryQuestion = null;
                }
                if (question.dynamicFieldQuestionId === null || question.dynamicFieldQuestionId === undefined) {

                  for (answer of question.answers) {
                    if (answer && (answer.questionId == question.id) && body && (answer.reportId == body.reportId)) {
                      if (answer.answer_numeric) {
                        answerTable.push(answer.answer_numeric);
                      } else if (answer.answer_text) {
                        answerTable.push(answer.answer_text);
                      } else if (answer.answer_yn) {
                        answerTable.push(answer.answer_yn);
                      }
                      else if (answer.optionChoiceAnswers && answer.optionChoiceAnswers.length > 0) {
                        for (option of answer.optionChoiceAnswers) {
                          if (option && option.optionChoice && option.optionChoice.optionChoicesValue) {
                            answerTable.push(option.optionChoice.optionChoicesValue);
                          }
                        }
                      }
                      else if (answer.imageAnswers && answer.imageAnswers.length > 0) {
                        for (img in answer.imageAnswers) {
                          if (answer.imageAnswers[img] && answer.imageAnswers[img].imageLocation) {
                            const filePath = answer.imageAnswers[img].imageLocation;
                            content.push({ imagePath: filePath, description: answer.imageAnswers[img].description });
                          }
                        }
                      }
                    }
                  }
                  if (section.isCommon) {
                    docDefinition.content.push({
                      columns: [
                        { text: question.questionName + ': ' + answerTable }]
                    });
                  } else {
                    questionsWithAnswers.push({ question: question, answer: answerTable });
                  }
                } else {
                  let flag;
                  for (let answer of question.answers) {
                    dynamicFieldQuestions.forEach((fieldQuestion) => {
                      if (fieldQuestion && fieldQuestion.dynamicFieldQuestionId === question.dynamicFieldQuestionId) {
                        flag = true;
                        const value = fieldQuestion.answers.find((fieldAnswer) => {
                          answer.questionName = question.questionName;
                          if (answer && fieldAnswer && (answer.elementArray === fieldAnswer.elementArray)) {
                            if (answer.imageAnswers && answer.imageAnswers.length > 0) {

                              for (img in answer.imageAnswers) {
                                if (answer.imageAnswers[img] && answer.imageAnswers[img].imageLocation) {
                                  const filePath = answer.imageAnswers[img].imageLocation;
                                  fieldContent.push({ imagePath: filePath, description: answer.imageAnswers[img].description });
                                }
                              }
                            } else if (answer.optionChoiceAnswers && answer.optionChoiceAnswers.length > 0) {
                              for (option of answer.optionChoiceAnswers) {
                                if (option && option.optionChoice && option.optionChoice.optionChoicesValue) {
                                  answer.value = option.optionChoice.optionChoicesValue;
                                  fieldAnswer.value.push(answer);
                                }
                              }
                            } else {
                              fieldAnswer.value.push(answer);
                            }
                            return fieldAnswer;
                          }
                        });
                        if (value === null || value === undefined) {
                          answer.questionName = question.questionName;
                          if (fieldQuestion.answers) {
                            fieldQuestion.answers.push({
                              elementArray: answer.elementArray,
                              value: [answer]
                            });
                          } else {
                            fieldQuestion.answers = [];
                            fieldQuestion.answers.push({
                              elementArray: answer.elementArray,
                              value: [answer]
                            });
                          }
                        }
                      }
                    });
                    if (!flag) {
                      const answers = [];
                      answer.questionName = question.questionName;
                      answers.push({
                        elementArray: answer.elementArray,
                        value: [answer]
                      });
                      dynamicFieldQuestions.push({
                        dynamicFieldQuestionId: question.dynamicFieldQuestionId,
                        answers: answers
                      });
                      [err, questionRes] = await to(Questions.findOne({
                        where: { id: question.dynamicFieldQuestionId },
                        include: [{
                          model: InputTypes
                        }, {
                          model: InputTypeProperties
                        }]
                      }));
                      if (questionRes) {
                        dynamicFieldQuestions.forEach((item, index) => {
                          if (item && item.dynamicFieldQuestionId === questionRes.id) {
                            questionRes.dynamicFieldQuestionId = item.dynamicFieldQuestionId;
                            dynamicFieldQuestions[index] = Object.assign({}, item, questionRes);
                            questionsWithAnswers.push({ question: dynamicFieldQuestions[index] });
                          }
                        });
                      }
                    }

                  }
                }

              }
            } else if (question && question.subCategory === 1) {
              subCategoryQuestion = question.questionName;
            }
          }
        }
        for (let id = 0; id < questionsWithAnswers.length; id++) {
          if (questionsWithAnswers[id] && questionsWithAnswers[id].subCategoryQuestion !== null && questionsWithAnswers[id].subCategoryQuestion !== undefined) {
            tableObject.table.body.push([{ text: questionsWithAnswers[id].subCategoryQuestion, colSpan: 2, style: 'subHeader' }, {}]);
          } else if (questionsWithAnswers[id] && questionsWithAnswers[id].question && questionsWithAnswers[id].question.dynamicFieldQuestionId === null) {
            tableObject.table.body.push([
              questionsWithAnswers[id].question.questionName,
              questionsWithAnswers[id].answer]);
          } else if (questionsWithAnswers[id] && questionsWithAnswers[id].question) {
            const questionWithAnswer = questionsWithAnswers[id].question;
            if (questionWithAnswer.answers && questionWithAnswer.answers.length > 0) {
              questionWithAnswer.answers.forEach((answer, index) => {
                const element = questionWithAnswer.inputTypesProperty ? questionWithAnswer.inputTypesProperty.element : null;
                const elementName = element ? (element + ' ' + index) : 'Element';
                tableObject.table.body.push([
                  { text: elementName, colSpan: 2 }, {}]);
                if (answer && answer.value && answer.value.length > 0) {
                  answer.value.forEach((answerValue) => {
                    if (answerValue) {
                      tableObject.table.body.push([
                        answerValue.questionName, answerValue.value]);
                    }
                  });
                }
              });
            }
          }
        }
      }
    }
  }
  // docDefinition.content.push([{columns:[tableObject]}]);
  if (content) {
    for (i = 0; i < content.length; i++) {
      if (content[i] && content[i].description !== null) {
        tableObject.table.body.push([
          { image: content[i].imagePath, colSpan: 2, alignment: 'center', maxWidth: 500, maxHeight: 250, border: [true, true, true, false] }, {}]);
        tableObject.table.body.push([
          { text: content[i].description, border: [true, false, true, true], alignment: 'center', fontSize: 14, bold: true, colSpan: 2 }, {}
        ]);
      } else {
        tableObject.table.body.push([
          { image: content[i].imagePath, colSpan: 2, alignment: 'center', maxWidth: 500, maxHeight: 250 }, {}]);
      }
    }
  }
  if (fieldContent && fieldContent.length > 0) {
    tableObject.table.body.push([
      { text: 'Dynamic Field Images', border: [true, false, true, true], fontSize: 14, bold: true, colSpan: 2 }, {}
    ]);
    for (index = 0; index < fieldContent.length; index++) {
      if (fieldContent[index] && fieldContent[index].description !== null) {
        tableObject.table.body.push([
          { image: fieldContent[index].imagePath, colSpan: 2, alignment: 'center', maxWidth: 500, maxHeight: 250, border: [true, true, true, false] }, {}]);
        tableObject.table.body.push([
          { text: fieldContent[index].description, border: [true, false, true, true], alignment: 'center', fontSize: 14, bold: true, colSpan: 2 }, {}
        ]);
      } else {
        tableObject.table.body.push([
          { image: fieldContent[index].imagePath, colSpan: 2, alignment: 'center', maxWidth: 500, maxHeight: 250 }]);
      }
    }
  }
  if (tableObject && tableObject.table.body && tableObject.table.body.length > 0) {
    docDefinition.content.push(tableObject);
  }
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  const pdfFilename = 'Report_' + report.windturbineId + '_' + new Date().getTime() + '.pdf';
  const pdfDataCopy = pdfDoc;
  pdfDoc.end();
  [err, pdf] = await to(s3DataService.uploadPDF(pdfDataCopy, pdfFilename));
  const pdfUrl = pdf ? pdf.url : null;

  if (body && body.to !== null) {
    var fileSizeInBytes = pdf ? pdf.size : null;
    // Convert the file size to megabytes (optional)
    var fileSizeInMegabytes = fileSizeInBytes / 1000000;
    // Check whether the pdf file size is less than 15 mb.
    if (fileSizeInMegabytes < 10) {
      var mailOptions = {
        from: "Centizen <info@centizen.net>",
        to: body.to,
        subject: body.subject,
        text: body.message,
        attachments: [{
          filename: 'Inspection Report.pdf',
          path: pdfUrl,
          contentType: 'application/pdf'
        }]
      }
      let status;
      body.email = body.to;
      [err, status] = await to(mailService.sendEmail(req.body, mailOptions));
      if (err) return ReE(res, err, 422);
      logger.info('status of export as email in pdf' + status);
      return ReS(res, { emailSend: ERROR.report_sent });
    } else {
      return ReE(res, ERROR.size_too_large, 422);
    }
  } else {
    return ReS(res, { filePath: pdfUrl });
  }
}
module.exports.createPDF = createPDF;

// const getTurbineBladeType = async function (req, res) {
//   let body = req.body;
//   //To delete the report that match with the provided report id.

//   [err, report] = await to(Report.findAll({
//     where: {
//       windturbineId: body.turbineId
//     }
//   }));
//   if (err) return ReE(res, err, 422);

//   return ReS(res, { report: report });
// };
// module.exports.getTurbineBladeType = getTurbineBladeType;

const getDynamicFieldAnswers = async function (req, res) {
  let body = req.body;
  [err, answer] = await to(Answers.findAll({
    where: {
      reportId: body.reportId,
      elementArray: {
        [Sequelize.Op.ne]: null
      }
    },
    attributes: { exclude: ['created', 'modified', 'answer_numeric', 'answer_yn', 'reportId'] },
    include: [{
      model: OptionChoiceAnswers,
      include: {
        model: OptionChoices
      }
    }, {
      model: ImageAnswers
    }]
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { answer: answer });
};
module.exports.getDynamicFieldAnswers = getDynamicFieldAnswers;

const convertImageToBase64String = async function (req, res) {
  let body = req.body;
  const paths = body.imageUrl.split('/');
  const imagePath = paths[paths.length - 1];
  const end = imagePath.split('?');
  console.log('filename', end[0]);
  const imageAnswers = [];
  imageAnswers.push({ imageLocation: end[0] });
  [err, data] = await to(s3DataService.getImage(imageAnswers, CONFIG.aws_img_dir_name));
  if (err) {
    logger.error('error in getting image err', err);
  } else {
    const imageData = data[0].imageLocation;
    // console.log('data', data);
    return ReS(res, { blobObject: imageData });
  }

  // return fs.readFile(path.join("/var/www/html/assets/uploadedImage", imagePath), await function (err, data) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   if (data) {
  //     var prefix = "data:" + 'image/png' + ";base64,";
  //     var base64 = new Buffer(data).toString('base64');
  //     var base64String = prefix + base64;
  //     return ReS(res, { blobObject: base64String });
  //   }
  // });
};
module.exports.convertImageToBase64String = convertImageToBase64String;

const getAssignedInspections = async function (req, res) {
  let body = req.body;
  let user = req.user;
  let err, assignInspectionUsers;
  if (user && user.userRole === 'Technician' && user.id) {
    body.userId = user.id;
  }
  if (err) ReE(res, err, 422);
  [err, assignedInspections] = await to(AssignInspectionUsers.findAll(
    {
      include: [
        {
          required: true,
          model: InspectionHeader,
          as: 'inspectionHeader',
          attributes: ['name']
        },
        {
          required: true,
          model: InspectionStatus,
          attributes: ['name'],
          where: { name: 'Assigned' }
        },
        {
          model: Windfarm,
          as: 'windfarm',
          attributes: ['name'],
          where: { id: body.windFarmId ? body.windFarmId : { [Sequelize.Op.ne]: null } }
        }, {
          model: UserAccount,
          as: 'user',
          attributes: ['firstName', 'lastName'],
          where: { id: body.userId ? body.userId : { [Sequelize.Op.ne]: null } }
        }],
      offset: body.offset,
      limit: body.limit,
      subQuery: false
    },
  ));

  if (err) TE(err.message);

  return ReS(res, { assignedInspections: assignedInspections });
};
module.exports.getAssignedInspections = getAssignedInspections;

