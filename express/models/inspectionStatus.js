'use strict';

// Define a model for inspectionStatus table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('inspectionStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { 
    tableName: 'inspectionStatus' });

//Adding a class level method.
  Model.associate = function (models) {
    this.assignInspectionUsers = this.hasMany(models.assignInspectionUsers);
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};