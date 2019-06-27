'use strict';

// Define a model for client table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull:false,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    clientName: {
      type: DataTypes.STRING,
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
    tableName: 'client' });

//Adding a class level method.
  Model.associate = function (models) {
    //client model belongs to the customer model
    this.customer = this.belongsTo(models.customer);
     //id of client table connected with multiple clientWindFarm rows
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