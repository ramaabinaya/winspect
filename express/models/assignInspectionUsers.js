'use strict';

// Define a model for assignInspectionUsers table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('assignInspectionUsers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    inspectionHeaderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    inspectionStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comments: DataTypes.STRING,
    attachments: DataTypes.STRING,
    dueDate: DataTypes.DATE,
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
    groupId: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
      tableName: 'assignInspectionUsers'
    });

  //Adding a class level method.
  Model.associate = function (models) {
    //customerId of the windFarm model belongs to the customer model
    this.user = this.belongsTo(models.userAccount, { foreignKey: 'userId', as: 'user' });
    this.inspectionHeader = this.belongsTo(models.inspectionHeader, { as: 'inspectionHeader' });
    this.inspectionStatus = this.belongsTo(models.inspectionStatus);
    this.windFarm = this.belongsTo(models.windFarm, { foreignKey: 'windMillFormId', as: 'windfarm' });
    this.report = this.hasOne(models.report, { as: 'report', foreignKey: 'assignedInspectionUserId' });
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};