const getDeviceInfo = async function (req, res) {
  let body = req.user;
  [err, devices] = await to(Devices.findAll({
    where: { userId: body.id },
    attributes: { exclude: ['deviceUid', 'userId', 'modified'] }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { devices: devices });
}
module.exports.getDeviceInfo = getDeviceInfo;

const removeDevice = async function (req, res) {
  let body = req.body;
  [err, devices] = await to(Devices.destroy({
    where: { id: body.deviceId }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { devices: devices });
}
module.exports.removeDevice = removeDevice;