'use strict';

// Define a model for optionChoiceAnswers table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('imageAnswers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    answerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sectionName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumnailImage: {
      type: DataTypes.STRING
    },
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
      tableName: 'imageAnswers'
    });

  //Adding a class level method.
  Model.associate = function (models) {
    //optionChoiceAnswers model belongs to answers model.
    this.Answers = this.belongsTo(models.answers, { foreignKey: 'answerId', onDelete: 'CASCADE' });
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};