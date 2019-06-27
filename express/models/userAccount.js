'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');

//Define a model for userAccount table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('userAccount', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customerId: DataTypes.INTEGER,
    userRoleId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email address must be valid"
        }
      }
    },
    active: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    },
    password: DataTypes.STRING,
    clientId: DataTypes.INTEGER,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
      tableName: 'userAccount'
    });

  Model.associate = function (models) {
    //customerId of the user table belongs to the customer model
    this.customer = this.belongsTo(models.customer);
    //userRoleId of the user table belongs to the userRole model
    this.userRole = this.belongsTo(models.userRole);
    //clientId of the user table belongs to the client model
    this.clientId = this.belongsTo(models.client);
    this.groupId = this.hasMany(models.groupMembers, { foreignKey: 'memberId' });
  };

  //Class level methods to making the encrypted password and save this.
  Model.beforeSave(async (user, options) => {
    let err;
    // Hash the password if it has been changed or is new
    if (user.changed('password')) {
      let salt, hash;
      //Asynchronously generates a salt.
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) {
        logger.error('error in encryption in user account' + err.message);
      };

      //Asynchronously generates a hash with salt
      [err, hash] = await to(bcrypt.hash(user.password, salt));
      if (err) {
        logger.error('error in hash method in encryption' + err.message);
      };

      user.password = hash;
    }
  });

  //Instance level methods to compare the password 
  Model.prototype.comparePassword = async function (pw) {
    let err, pass
    if (!this.password) TE('password not set');

    //Password verification
    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE('Invalid username or password, please try again');

    return this;
  };

  //Instance level methods to get the jsonWebToken
  Model.prototype.getJWT = function () {
    //convert a string to integer
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    //return the signature for given payload and secretkey
    return "Bearer " + jwt.sign(
      {
        id: this.id,
        customerId: this.customerId,
        userRoleId: this.userRoleId,
        userRole: this.userRole.name,
        clientId: this.clientId
      }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function (pw) {
    //convert to json
    let json = this.toJSON();
    return json;
  };


  return Model;
};