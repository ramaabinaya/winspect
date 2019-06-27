
const getAll = async function (req, res) {
    [err, userRole] = await to(UserRole.findAll());
    if (err) TE(err.message);

    return ReS(res, { userRole: userRole });
}
module.exports.getAll = getAll;



