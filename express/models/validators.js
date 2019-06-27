'use strict';

// Define a model for validators table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('validators', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionId: DataTypes.INTEGER,
    keyName: DataTypes.STRING,
    keyValue: DataTypes.STRING,
    errorMessage: DataTypes.STRING,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, { 
    tableName: 'validators' });

//Adding a class level method.
  Model.associate = function (models) {
    //questionId of the validators model belongs to the questions model
    this.questions = this.belongsTo(models.questions,{foreignKey:'questionId'});
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};