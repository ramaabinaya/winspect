'use strict';

// Model Definition for menuItem table.
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('roleBasedMenu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userRoleId: {
      type: DataTypes.INTEGER,
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
  }, {
      tableName: 'roleBasedMenu'
    });

  //Adding a class level method.
  Model.associate = function (models) {
    this.userRoleId = this.belongsTo(models.userRole);
    this.menuItemsId = this.belongsTo(models.menuItems, { foreignkey: 'menuItemId' });
    this.permissionId = this.belongsTo(models.permission);
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};