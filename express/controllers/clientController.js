const getClient = async function (req, res) {
  let body = req.user;
  let client;

  if (body.clientId) {
    //get all rows from the assigned inspection table
    [err, client] = await to(Client.findAll({
      where: { id: body.clientId },
      include: [{
        model: ClientWindFarm,
        attributes: ['windFarmId']
      }]
    }));
    if (err) return ReE(res, err, 422);
  }

  return ReS(res, { client: client });
};
module.exports.getClient = getClient;

const getAll = async function (req, res) {
  let body = req.user;

  //get all rows from the assigned inspection table
  [err, client] = await to(Client.findAll({
    where: { customerId: body.customerId }
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { client: client });
};
module.exports.getAll = getAll;

