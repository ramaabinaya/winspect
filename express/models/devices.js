'use strict';

// Define a model for client table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('devices', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    deviceUid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    deviceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
      tableName: 'devices'
    });
  //Adding a class level method.
  Model.associate = function (models) {
    //user model may has many devices associated with that.
    this.user = this.belongsTo(models.userAccount, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};