'use strict';

// Model Definition for menuItem table.
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('menuItems', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    routerLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iconName: {
      type: DataTypes.STRING
    },
    subName: {
      type: DataTypes.STRING
    },
    isMenu: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    mainMenuId: {
      type: DataTypes.INTEGER
    },
    displayPosition: {
      type: DataTypes.INTEGER
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
      tableName: 'menuItems'
    });

  //Adding a class level method.
  Model.associate = function (models) {
    this.mainMenuId = this.belongsTo(models.menuItems, { foreignKey: 'mainMenuId' });
    this.mainMenuId = this.hasMany(models.menuItems, { foreignKey: 'mainMenuId', as: 'subMenu' });
    this.roleBasedMenu = this.hasMany(models.roleBasedMenu);
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};