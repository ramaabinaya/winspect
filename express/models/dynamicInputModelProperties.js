'use strict';
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('dynamicInputModelProperties', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    inputTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    propertyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    propertyType: {
      type: DataTypes.STRING,
      defaultValue: 'string',
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
    isValidator: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    errorMessage: {
      type: DataTypes.STRING,
    },
  }, {
      tableName: 'dynamicInputModelProperties'
    });

  //Adding a class level method.
  Model.associate = function (models) {
    this.inputTypeId = this.belongsTo(models.inputTypes);
  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};