'use strict';

// Define a model for customer table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull:false
    },
    logoLocation: {
      type:DataTypes.STRING,
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
    tableName: 'customer' });

//Adding a class level method.
  Model.associate = function (models) {
    //id of customer table connected with multiple userAccount rows
    this.userAccount = this.hasMany(models.userAccount);
     //id of customer table connected with multiple client rows
    this.client = this.hasMany(models.client);
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};