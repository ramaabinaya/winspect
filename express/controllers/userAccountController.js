const randToken = require('rand-token');
const refreshTokens = {};
/**
 * asnync function to checking the email and password for login.
 * If error occurs return the error response 
 * otherwise return the suceess response with token,user details and user role
 */
const login = async function (req, res) {
  let err, user;
  let body = req.body;
  [err, user] = await to(authService.authUser(req.body));
  if (err) return ReE(res, err, 401);
  if (user) {
    var refreshToken = randToken.uid(256);
    refreshTokens[refreshToken] = {
      expiryTime: Date.now() + 3600000,
      user: user
    }
  }
  //Sequalize findOne method to find the role name of the given userRoleId in userRole table.
  // [err, userRole] = await to(UserRole.findOne({ where: { id: user.userRoleId }, attributes: ['name'] }));
  if (err) TE(err.message);
  if (user && body.deviceUid !== null && body.deviceName !== null) {
    [err, count] = await to(Devices.count({ where: { userId: user.id } }));
    if (count < CONFIG.max_device_limit) {
      [err, deviceInfo] = await to(Devices.findOrCreate({
        where: {
          deviceUid: body.deviceUid
        },
        defaults: {
          deviceName: body.deviceName, deviceUid: body.deviceUid, userId: user.id
        }
      }));
      if (deviceInfo) {
        return ReS(res, { token: user.getJWT(), refreshToken: refreshToken, user: user.toWeb(), userRole: user.userRole.name });
      }
      if (err) ReE(res, err, 422);
    } else if (count == CONFIG.max_device_limit) {
      [err, devices] = await to(Devices.findOne({
        where: {
          deviceUid: body.deviceUid
        }
      }));
      if (devices) {
        return ReS(res, { token: user.getJWT(), refreshToken: refreshToken, user: user.toWeb(), userRole: user.userRole.name });
      } else {
        return ReE(res, ERROR.device_limit_exceeded, 422);
      }
    }
    logger.info("There are " + count + " devices with userId " + user.id);

  } else if (body.deviceUid === null && body.deviceName === null) {
    return ReS(res, { token: user.getJWT(), refreshToken: refreshToken, user: user.toWeb(), userRole: user.userRole.name });
  }
}
module.exports.login = login;

/**
 * asnync function to create new user with given information.
 * If error occurs return the error response 
 * otherwise return the suceess response with created new user
 */
const addUser = async function (req, res) {
  let body = req.body;
  let err, user;
  const mailOptions = {
    text: 'to add you as user.\n\n',
    route: 'addcredentails',
    process: 'add your credentials'
  };

  if (req.body) {
    const userRoleName = body.userRole;
    //Sequalize findOne method to find the role id of the given role in userRole table.
    [err, userRole] = await to(UserRole.findOne({ where: { name: userRoleName }, attributes: ['id'] }));
    if (err) TE(err.message);
    if (userRole) {
      body.userRoleId = userRole.id;
    }
  };
  //create new user
  [err, user] = await to(authService.createUser(body, mailOptions));
  if (err) return ReE(res, err, 422);


  return ReS(res, { user: user.toWeb() });
};
module.exports.addUser = addUser;

/**
 * asnync function to get all user details.
 * If error occurs return the error response 
 * otherwise return the suceess response with user list.
 */
const getAll = async function (req, res) {
  let body = req.user;
  if (body.userRole === 'Technician') {
    body.role = 'Technician';
    console.log('in technician role', body.role);
  } else {
    body.role = null;
  }
  //get all rows from the userAccount table
  [err, user] = await to(UserAccount.findAll({
    where: { customerId: body.customerId },
    attributes: { exclude: ['password', 'resetPasswordExpires', 'resetPasswordToken'] },
    include: [{
      model: UserRole,
      attributes: ['name'],
      where: { name: body.role ? body.role : { [Sequelize.Op.ne]: null } }
    }]
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { user: user });
};
module.exports.getAll = getAll;


/**
 * asnync function to change active status of the user.
 * If error occurs return the error response 
 * otherwise return the suceess response with updated user row count.
 */
const changeUserStatus = async function (req, res) {
  let body = req.body;
  //update the active column of the user account row when condition satisfied
  [err, user] = await to(UserAccount.update({ active: body.active, modified: new Date(Date.now()) }, { where: { id: body.id } }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { user: user });
};
module.exports.changeUserStatus = changeUserStatus;

/**
 * asnync function to edit the user details.
 * If error occurs return the error response 
 * otherwise return the suceess response with updated user row count.
 */
const editUser = async function (req, res) {
  let body = req.body;
  //update the name column of the user account row
  [err, user] = await to(UserAccount.update(body.user, { where: { id: body.id } }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { user: user });
};
module.exports.editUser = editUser;

const changepassword = async function (req, res) {
  let body = req.body;
  let user;
  [err, user] = await to(UserAccount.findOne({
    where: {
      id: req.user.id
    }
  }));
  if (err) return ReE(res, err, 422);

  [err, isCheck] = await to(user.comparePassword(body.password));
  if (err) return ReE(res, ERROR.invalid_pwd, 422);;
  if (isCheck) {
    [err, userChanged] = await to(UserAccount.update({ password: body.newPassword }, {
      where: {
        id: req.user.id
      }, individualHooks: true
    }));
  }
  return ReS(res, { user: userChanged });
};
module.exports.changepassword = changepassword;

const configurePassword = async function (req, res) {
  let body = req.body;
  //update the name column of the user account row
  [err, user] = await to(UserAccount.update({ password: body.password }, {
    where: {
      resetPasswordToken: body.token
    }, individualHooks: true
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { user: user });
};
module.exports.configurePassword = configurePassword;

const getUser = async function (req, res) {
  const userId = req.user.id;
  [err, user] = await to(UserAccount.findOne({
    attributes: ['id', 'firstName', 'lastName', 'userRoleId', 'customerId', 'email', 'active', 'clientId'],
    where: { id: userId },
    include: {
      model: UserRole,
      attributes: ['name']
    }
  }));
  if (err) ReE(res, err, 422);
  return ReS(res, { user: user });
}
module.exports.getUser = getUser;

const checkEmail = async function (req, res) {
  const body = req.body;
  if (body.email && req.user && req.user.email) {

  }
  [err, user] = await to(UserAccount.findOne({
    where: { email: body.email }
  }));
  if (err) ReE(res, err, 422);
  return ReS(res, { emailExist: user ? true : false });
}
module.exports.checkEmail = checkEmail;

const refreshToken = async function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens && refreshTokens[refreshToken].expiryTime > Date.now()) {
    return ReS(res, { accessToken: refreshTokens[refreshToken].user.getJWT() });
  } else {
    return ReE(res, pe({ message: ERROR.invalid_token }), 422);
  }
}
module.exports.refreshToken = refreshToken;