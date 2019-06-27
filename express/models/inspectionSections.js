'use strict';

// Define a model for inspectionSection table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('inspectionSections', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    inspectionHeaderId:DataTypes.INTEGER,
    sectionName: DataTypes.STRING,
    sectionDesc: DataTypes.STRING,
    condition: DataTypes.STRING,
    sectionState: DataTypes.STRING,
    showNext: DataTypes.TINYINT,
    showPrev: DataTypes.TINYINT,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isCommon:DataTypes.TINYINT
  }, { 
    tableName: 'inspectionSections' });

//Adding a class level method.
  Model.associate = function (models) {
    this.belongsTo(models.inspectionHeader);
    this.hasMany(models.questions);
  };

//Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};