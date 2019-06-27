'use strict';

// Define a model for clientWindFarm table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('clientWindFarm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull:false,
      autoIncrement: true
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    windFarmId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull:false
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull:false
    }
  }, { 
    tableName: 'clientWindFarm' });

//Adding a class level method.
  Model.associate = function (models) {
    //clientWindFarm model belongs to the client model
    this.client = this.belongsTo(models.client);
    //windFarm model belongs to the windFarm model
    this.windFarm = this.belongsTo(models.windFarm);
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};