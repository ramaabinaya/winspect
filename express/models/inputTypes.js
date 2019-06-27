'use strict';

// Define a model for inputTypes table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('inputTypes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    inputTypeName: {
      type:DataTypes.STRING,
      allowNull: false
    },
    displayName: DataTypes.STRING,
    iconName: DataTypes.STRING,
    description: DataTypes.STRING,
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
    tableName: 'inputTypes' });

//Adding a class level method.
  Model.associate = function (models) {
    this.questions = this.hasMany(models.questions);
    this.inputType = this.hasMany(models.dynamicInputModelProperties);
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};