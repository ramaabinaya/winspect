'use strict';

// Define a model for windTurbines table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('windTurbines', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    buildYear: DataTypes.INTEGER,
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { 
    tableName: 'windTurbines' });

//Adding a class level method.
  Model.associate = function (models) {
    //windMillId of the windTurbines model belongs to the windFarm model
    this.windFarm = this.belongsTo(models.windFarm,{foreignKey: 'windMillId'});
    this.report = this.hasMany(models.report,{as:'report',foreignKey: 'windturbineId'});
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};