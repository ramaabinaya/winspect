'use strict';

//Define a model for userRole table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('userRole', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    descripton: DataTypes.STRING,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { 
    tableName: 'userRole',});

  Model.associate = function (models) {
    //id of the userRole table connected with multipe userAccount rows
    this.userAccount = this.hasMany(models.userAccount);
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function (pw) {
    //convert to json
    let json = this.toJSON();    
    return json;
  };

  return Model;
};