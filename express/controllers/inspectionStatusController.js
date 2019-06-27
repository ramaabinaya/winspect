
const getAll = async function (req, res) {
    //get all rows from the inspection header table
    [err, inspectionStatus] = await to(InspectionStatus.findAll({
        attributes: ['id', 'name']
    }));
    if (err) return ReE(res, err, 422);

    return ReS(res, { inspectionStatus: inspectionStatus });
};
module.exports.getAll = getAll;