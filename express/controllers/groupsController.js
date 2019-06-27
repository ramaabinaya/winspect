
/**
* asnync function to create new group.
* If error occurs return the error response 
* otherwise return the suceess response with created group details.
*/
const createGroup = async function (req, res) {
    let body = req.body;
    body.creatorId = req.user.id;
    [err, creategroup] = await to(Groups.create(body));
    if (err) return ReE(res, err, 422);
    return ReS(res, { created: creategroup });
}
module.exports.createGroup = createGroup;
/**
* asnync function to get all group details.
* If error occurs return the error response 
* otherwise return the suceess response with all group details.
*/
const getAllGroups = async function (req, res) {
    [err, groups] = await to(Groups.findAll({
        attributes: { exclude: ['modified'] },
        include: [{
            model: GroupMembers,
            attributes: { exclude: ['created', 'modified'] }
        },

        ]
    }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { groups: groups });
}
module.exports.getAllGroups = getAllGroups;
/**
* asnync function to remove the group.
* If error occurs return the error response 
* otherwise return the suceess response with removed group details.
*/
const removeGroup = async function (req, res) {
    let body = req.body;
    [err, group] = await to(Groups.destroy({
        where: {
            id: body.id
        }
    }))
    return ReS(res, { deletedGroup: group });
}
module.exports.removeGroup = removeGroup;
/**
* asnync function to edit the already created group details.
* If error occurs return the error response 
* otherwise return the suceess response with edited group details.
*/
const editGroup = async function (req, res) {
    let id = req.body.id;
    let data = req.body.editgroup;
    [err, editgroup] = await to(Groups.update({
        name: data.name,
        description: data.description,
        modified: new Date(Date.now())
    },
        {
            where: {
                id: id
            }
        }))
    return ReS(res, { edited: editgroup });
}
module.exports.editGroup = editGroup;