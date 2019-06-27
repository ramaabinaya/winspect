'use strict';

// Define a model for optionChoices table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('optionChoices', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull:false,
      autoIncrement: true
    },
    optionGroupId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    optionChoiceName: {
      type: DataTypes.STRING,
      unique:true
    },
    optionChoicesValue: {
      type: DataTypes.STRING,
      unique:true
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
    tableName: 'optionChoices' });

//Adding a class level method.
  Model.associate = function (models) {
    //optionChoices model belongs to the question model
    this.optionGroups = this.belongsTo(models.optionGroups,{foreignKey:'optionGroupId'});
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};