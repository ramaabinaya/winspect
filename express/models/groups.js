'use strict'

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('groups', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creatorId: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        tableName: 'groups'
    });

    //Adding a class level methods.
    Model.associate = function(models) {
        this.groupMembers = this.hasMany(models.groupMembers);
    };

    //Adding the instance level methods.
    Model.prototype.toWeb = function() {
        //convert to json data
        let json = this.toJSON();
        return json;
    };
    return Model;
}