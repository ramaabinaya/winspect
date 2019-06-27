/**
 * asnync function to get all windFarm details.
 * If error occurs return the error response 
 * otherwise return the suceess response with windFarm detail list.
 */
const getAllWindFarms = async function (req, res) {
  let body = req.user;
  //get all rows from the windFarm table
  [err, windFarms] = await to(Windfarm.findAll({
    where: {
      customerId: body.customerId
    }
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { windFarms: windFarms });
};
module.exports.getAllWindFarms = getAllWindFarms;

/**
 * asnync function to get wind Turbines list for the given windfarm id.
 * If error occurs return the error response 
 * otherwise return the suceess response with  wind Turbines list.
 */
const getWindTurbines = async function (req, res) {
  let body = req.body;
  //get wind Turbines list for the given windfarm id
  [err, windTurbines] = await to(WindTurbine.findAll({
    where: { windMillId: body.windMillId },
    include: [{
      model: Windfarm,
      attributes: ['name']
    }]
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { windTurbines: windTurbines });
};
module.exports.getWindTurbines = getWindTurbines;

const getWindFarmsAndTurbines = async function (req, res) {
  let body = req.user;
  //get all rows from the windFarm table
  [err, windFarms] = await to(Windfarm.findAll({
    where: { customerId: body.customerId },
    include: [{
      model: WindTurbine,
      include: [{
        model: Report,
        as: 'report'
      }]
    }]
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { windFarms: windFarms });
};
module.exports.getWindFarmsAndTurbines = getWindFarmsAndTurbines;

const getWindFarms = async function (req, res) {
  let body = req.body;
  //get all rows from the windFarm table
  [err, windFarms] = await to(Windfarm.findOne({
    where: { id: body.windFarmId },
    include: [{
      model: WindTurbine,
      include: [{
        model: Report,
        as: 'report'
      }]
    }]
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { windFarms: windFarms });
};
module.exports.getWindFarms = getWindFarms;

/**
 * asnync function to add wind farms to the wind farm table.
 * If error occurs return the error response 
 * otherwise return the suceess response with  wind farm data.
 */
const addWindFarm = async function (req, res) {
  let body = req.body;
  body.customerId = req.user.customerId;
  //add wind farm details
  [err, windFarm] = await to(Windfarm.create(body));
  if (err) return ReE(res, err, 422);
  [err, client] = await to(Client.create({
    customerId: body.customerId,
    clientName: body.name
  }));
  if (err) return ReE(res, err, 422);
  if (windFarm && client) {
    [err, clientWindFarm] = await to(ClientWindFarm.create({
      clientId: client.id,
      windFarmId: windFarm.id
    }));
    if (err) return ReE(res, err, 422);
  }
  return ReS(res);
};
module.exports.addWindFarm = addWindFarm;

/**
 * asnync function to add wind turbine to the wind turbines table.
 * If error occurs return the error response 
 * otherwise return the suceess response with  wind turbine data.
 */
const addWindTurbine = async function (req, res) {
  let body = req.body;
  //add wind turbine details
  [err, windTurbine] = await to(WindTurbine.create({
    buildYear: body.buildYear,
    latitude: body.latitude,
    longitude: body.longitude,
    windMillId: body.windFarm.id
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res);
};
module.exports.addWindTurbine = addWindTurbine;

const addMoreWindFarms = async function (req, res) {
  let body = req.body;
  let err, windFarm, client;
  for (let i = 1; i < body.windfarm.length; i++) {
    if (body.windfarm[i] !== '') {
      let data = String(body.windfarm[i]).split(',');
      [err, windFarm] = await to(Windfarm.findOrCreate({
        where: {
          name: data[0]
        },
        defaults: {
          customerId: req.user.customerId,
          country: data[1],
          state: data[2]
        }
      }));
      if (err) return ReE(res, err, 422);
      [err, client] = await to(Client.findOrCreate({
        where: {
          clientName: data[0]
        },
        defaults: {
          customerId: req.user.customerId
        }
      }));
      if (err) return ReE(res, err, 422);
      if (windFarm[0] && windFarm[1] && client[0] && client[1]) {
        [err, clientWindFarm] = await to(ClientWindFarm.create({
          clientId: client[0].id,
          windFarmId: windFarm[0].id
        }));
        if (err) return ReE(res, err, 422);
      };
    }
  }
  if (err) return ReE(res, err, 422);
  return ReS(res);
}
module.exports.addMoreWindFarms = addMoreWindFarms;

const addMoreWindTurbines = async function (req, res) {
  let body = req.body;
  let err;
  for (let i = 1; i < body.windTurbine.length; i++) {
    let data = String(body.windTurbine[i]).split(',');
    if (body.windTurbine[i] !== '') {
      //add wind turbine details
      [err, windFarm] = await to(Windfarm.findOne({
        where: { name: data[3] }
      }));
      if (err) return ReE(res, err, 422);
      if (windFarm !== null) {
        [err, windTurbine] = await to(WindTurbine.create({
          buildYear: data[0],
          latitude: data[1],
          longitude: data[2],
          windMillId: windFarm.id
        }));
      } else {
        if (err) return ReE(res, ERROR.invalid_windfarm_name, 422);
      }
    }
  }
  if (err) return ReE(res, err, 422);
  return ReS(res);
};
module.exports.addMoreWindTurbines = addMoreWindTurbines;

const checkWindFarmName = async function (req, res) {
  let body = req.body;
  [err, windFarm] = await to(Windfarm.findOne({
    where: { name: body.windFarmName }
  }));
  if (err) ReE(res, err, 422);
  return ReS(res, { windFarmNameExist: windFarm ? true : false });
}
module.exports.checkWindFarmName = checkWindFarmName;