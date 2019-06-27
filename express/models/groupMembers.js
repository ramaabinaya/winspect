'use strict'

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('groupMembers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        groupId: {
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
          }
    }, { 
        tableName: 'groupMembers'
    });

    //Adding a class level methods.
    Model.associate = function(models) {
    //groups model belongs to the groups model
    this.groups = this.belongsTo(models.groups, { onDelete: 'CASCADE' });
    //customerId of the windFarm model belongs to the customer model
    this.userAccount = this.belongsTo(models.userAccount, { foreignKey:'memberId', onDelete: 'CASCADE' });
    };

    //Adding the instance level methods.
    Model.prototype.toWeb = function() {
        //convert to json data
        let json = this.toJSON();
        return json;
    };
    return Model;
}