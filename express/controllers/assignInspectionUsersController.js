
/**
 * asnync function to get assigned inspection details.
 * If error occurs return the error response 
 * otherwise return the suceess response with assigned inspection details.
 */
const get = async function (req, res) {
    let body = req.body;
    //get the assigned inspection row for the given id
    [err, assignedInspection] = await to(AssignInspectionUsers.findOne({
        where: { id: body.assigndInspectionId },
        attributes: ['id', 'inspectionHeaderId', 'windMillFormId']
    }));
    if (err) return ReE(res, err, 422);

    return ReS(res, { assignedInspection: assignedInspection.toWeb() });
};
module.exports.get = get;

/**
 * asnync function to assign inspection to the user.
 * If error occurs return the error response 
 * otherwise return the suceess response with assigned inspection details.
 */
const addAssignInspection = async function (req, res) {
    let body = req.body;

    [err, assignedInspection] = await to(AssignInspectionUsers.create(body));
    if (err) return ReE(res, err, 422);

    return ReS(res, { assignedInspection: assignedInspection.toWeb() });
}
module.exports.addAssignInspection = addAssignInspection;

const ReassignInspection = async function (req, res) {
    let body = req.body;

    [err, reassignedInspection] = await to(AssignInspectionUsers.update({
        userId: body.technicianId,
        modified: new Date(Date.now())
    },
        {
            where: {
                id: body.inspectionId
            }
        }));
    if (err) return ReE(res, err, 422);

    return ReS(res, { reassignedInspection: reassignedInspection });
}
module.exports.ReassignInspection = ReassignInspection;

const groupAssignInspection = async function (req, res) {
    let body = req.body;
    let assignedInspections = [];
    [err, members] = await to(GroupMembers.findAll({
        where: {
            groupId: body.userId
        },
        include: [{
            required: true,
            model: UserAccount,
            where: { active: CONFIG.activeStatusId },
        }]
    }));
    if (err) return ReE(res, err, 422);
    if (members) {
        for (let i = 0; i < members.length; i++) {
            [err, assignInspectionarr] = await to(AssignInspectionUsers.create({
                inspectionHeaderId: body.inspectionHeaderId,
                inspectionStatusId: body.inspectionStatusId,
                comments: body.comments,
                attachments: body.attachments,
                dueDate: body.dueDate,
                userId: members[i].memberId,
                windMillFormId: body.windMillFormId,
                groupId: body.userId
            }));
            assignedInspections.push(assignInspectionarr);
        }
    }
    return ReS(res, { assigned: assignedInspections });
}
module.exports.groupAssignInspection = groupAssignInspection;





