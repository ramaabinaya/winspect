
/**
* asnync function to add a member into group.
* If error occurs return the error response 
* otherwise return the suceess response with added member details.
*/
const addtoGroup = async function (req, res) {
    let body = req.body;
    [err, memberAdded] = await to(GroupMembers.create(body));
    if (err) return (res, err, 422);
    return ReS(res, { added: memberAdded });
}
module.exports.addtoGroup = addtoGroup;
/**
* asnync function to remove group member.
* If error occurs return the error response 
* otherwise return the suceess response with removed member details.
*/
const removeMember = async function (req, res) {
    let body = req.body;
    [err, removedMember] = await to(GroupMembers.destroy({
        where: Sequelize.and(
            { groupId: body.groupId },
            { memberId: body.technicianId }
        )
    }))
    return ReS(res, { removed: removedMember });
}
module.exports.removeMember = removeMember;