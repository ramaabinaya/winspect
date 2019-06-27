'use strict';

// Define a model for inputTypeProperties table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('inputTypesProperties', {
    propertyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id: {
      type:DataTypes.STRING,
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
    },
    autoFocus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    cols: DataTypes.INTEGER,
    filterable: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    focusedDate: DataTypes.DATE,
    format: DataTypes.STRING,
    inline: {
      type:DataTypes.TINYINT,
      defaultValue:0
    },
    inputType: DataTypes.STRING,
    label: DataTypes.STRING,
    legend: DataTypes.STRING,
    mask: DataTypes.STRING,
    max: DataTypes.INTEGER,
    meridian: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    min: DataTypes.INTEGER,
    mutliple: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    pattern: DataTypes.STRING,
    placeholder: DataTypes.STRING,
    prefix: DataTypes.STRING,
    readOnly: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    rows: DataTypes.INTEGER,
    showSeconds: {
      type:DataTypes.TINYINT,
      defaultValue: 0
    },
    step: DataTypes.INTEGER,
    suffix: DataTypes.STRING,
    toggleIcon: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    vertical: DataTypes.TINYINT,
    wrap: DataTypes.STRING,
    disabled: DataTypes.BOOLEAN,
    hasMethod: DataTypes.BOOLEAN,
    buttonType: DataTypes.STRING,
    value: DataTypes.STRING,
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    fieldId: DataTypes.INTEGER,
    element:DataTypes.STRING
  }, {
      tableName: 'inputTypesProperties'
    });

  //Adding a class level method.
  Model.associate = function (models) {

  };

  //Adding the instance level methods
  Model.prototype.toWeb = function () {
    //convert to json data
    let json = this.toJSON();
    return json;
  };

  return Model;
};