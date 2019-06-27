'use strict';

// Define a model for optionGroup table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('optionGroups', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    optionGroupName: DataTypes.STRING,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isResource: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 0
    }
  }, { 
    tableName: 'optionGroups' });

//Adding a class level method.
  Model.associate = function (models) {
    this.optionChoices = this.hasMany(models.optionChoices);

  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};