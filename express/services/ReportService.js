const getReport = async function (req, reportId) {
  const user = req;
  //get report table row for the given id
  [err, data] = await to(Report.findOne({
    where: { id: reportId },
    include: [{
      model: AssignInspectionUsers,
      where: {
        userId: user.userRoleId === 1 ? user.id : { [Sequelize.Op.ne]: null }
      },
      include: [{
        model: InspectionHeader,
        as: 'inspectionHeader',
        include: [{
          model: InspectionSection,
          include: [{
            model: Questions,
            include: [{
              model: Answers,
              where: {
                reportId: reportId
              },
              include: [{
                model: OptionChoiceAnswers,
                include: [{
                  model: OptionChoices
                }]
              },
              {
                model: ImageAnswers,
              }],
            }, {
              model: InputTypeProperties
            }]
          }],
        }]
      }]
    }], order: [
      [AssignInspectionUsers, InspectionHeader, InspectionSection, 'id', 'asc'],
      [AssignInspectionUsers, InspectionHeader, InspectionSection, Questions, 'displayPositionIndex', 'asc']
    ],
  }));
  console.log('data1: ', data);
  if (err) {
    TE(err.message);
  }
  else if (data === null) {
    TE(ERROR.invalid_report);
  }
  else {
    return data;
  }
};
module.exports.getReport = getReport;