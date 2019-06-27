'use strict';

// Define a model for inspectionHeader table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('inspectionHeader', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'Id'
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructions: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileAttachment: DataTypes.STRING,
    isForm: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false
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
    inspectionReportType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Master'
    },
    isCustom: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    isActive: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
      tableName: 'inspectionHeader'
    });

  //Adding a class level method.
  Model.associate = function (models) {
    this.customer = this.belongsTo(models.customer);
    this.assignInspectionUsers = this.hasMany(models.assignInspectionUsers);
    this.inspectionSections = this.hasMany(models.inspectionSections);
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};