'use strict';

// Define a model for answers table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('answers', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    reportId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    answer_numeric: {
      type: DataTypes.INTEGER
    },
    answer_text: {
      type: DataTypes.STRING
    },
    answer_yn: {
      type: DataTypes.BOOLEAN
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
    },
    value: DataTypes.STRING,
    elementArray: DataTypes.INTEGER
  }, {
      tableName: 'answers'
    });

  //Adding a class level method.
  Model.associate = function (models) {
    //answer model belongs to the question model
    this.questions = this.belongsTo(models.questions);
    this.optionChoiceAnswers = this.hasMany(models.optionChoiceAnswers);
    this.imageAnswers = this.hasMany(models.imageAnswers);
    //answer model belongs to the reports model
    this.reports = this.belongsTo(models.report, { onDelete: 'CASCADE' });
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};