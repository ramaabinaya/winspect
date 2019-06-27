
/**
 * asnync function to get all inspection header details.
 * If error occurs return the error response 
 * otherwise return the suceess response with inspection list.
 */
const getAll = async function (req, res) {
    let body = req.user;
    //get all rows from the inspection header table
    [err, inspectionHeader] = await to(InspectionHeader.findAll({
        where: { customerId: body.customerId, isForm: 0 },
        include: [{
            model: InspectionSection
        }]
    }));
    if (err) return ReE(res, err, 422);

    return ReS(res, { inspectionHeader: inspectionHeader });
};
module.exports.getAll = getAll;

const checkTemplateName = async function (req, res) {
    const body = req.body;
    [err, inspection] = await to(InspectionHeader.findOne({
        where: { name: body.templateName }
    }));
    if (err) ReE(res, err, 422);
    return ReS(res, { templateNameExist: inspection ? true : false });
};
module.exports.checkTemplateName = checkTemplateName;
