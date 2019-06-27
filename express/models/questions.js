'use strict';

// Define a model for questions table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('questions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    inspectionSectionId:DataTypes.INTEGER,
    inputTypeId: DataTypes.INTEGER,
    questionName: DataTypes.STRING,
    questionRequiredYN: DataTypes.TINYINT,
    optionGroupId: DataTypes.INTEGER,
    allowMultipleOptionsAnswerYN: DataTypes.TINYINT,
    answerRequiredYN: DataTypes.TINYINT,
    inputTypePropertyId: DataTypes.INTEGER,
    displayPositionIndex: DataTypes.INTEGER,
    subCategory: DataTypes.TINYINT,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    dynamicFieldQuestionId:DataTypes.INTEGER
  }, { 
    tableName: 'questions' });

//Adding a class level method.
  Model.associate = function (models) {
    this.inspectionSections = this.belongsTo(models.inspectionSections);
    this.inputTypes = this.belongsTo(models.inputTypes,{foreignKey: 'inputTypeId'});
    this.inputTypesProperties = this.belongsTo(models.inputTypesProperties,{foreignKey: 'inputTypePropertyId'});
    this.optionGroups = this.belongsTo(models.optionGroups);
    this.validators = this.hasMany(models.validators,{as:'validators',foreignKey:'questionId'});
    this.answers = this.hasMany(models.answers)
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};