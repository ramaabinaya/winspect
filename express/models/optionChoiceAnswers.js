'use strict';

// Define a model for optionChoiceAnswers table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('optionChoiceAnswers', {
    answerId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    optionChoiceId: {
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
    tableName: 'optionChoiceAnswers' });

//Adding a class level method.
  Model.associate = function (models) {
    //optionChoiceAnswers model belongs to optionChoices model.
    this.optionChoices = this.belongsTo(models.optionChoices);
    //optionChoiceAnswers model belongs to answers model.
    this.Answers = this.belongsTo(models.answers,{foreignKey:'answerId',onDelete: 'CASCADE'});
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};