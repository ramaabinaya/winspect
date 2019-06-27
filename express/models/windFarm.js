'use strict';

// Define a model for windFarm table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('windFarm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    active: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { 
    tableName: 'windFarm' });

//Adding a class level method.
  Model.associate = function (models) {
    this.windTubines = this.hasMany(models.windTurbines,{foreignKey: 'windMillId'});
    //customerId of the windFarm model belongs to the customer model
    this.customer = this.belongsTo(models.customer);
     //id of windFarm table connected with multiple clientWindFarm rows
    this.clientWindFarm = this.hasMany(models.clientWindFarm);
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};