
module.exports = function (sequelize, DataTypes) {
	var Model = sequelize.define('report', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'Id'
		},
		windturbineId: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true,
			field: 'name'
		},
		active: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: 1,
			field: 'active'
		},
		created: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: 'created'
		},
		modified: {
			type: DataTypes.DATE,
			allowNull: false,
			 defaultValue: DataTypes.NOW,
			field: 'modified'
		},
		bladeType: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'M'
		}
	}, {
			tableName: 'report'
		});
	Model.associate = function (models) {
		//customerId of the windFarm model belongs to the customer model
		this.assignInspectionUsers = this.belongsTo(models.assignInspectionUsers, { foreignKey: 'assignedInspectionUserId', onDelete: 'CASCADE' });
		this.winturbines = this.belongsTo(models.windTurbines, { foreignKey: 'windturbineId' });
		this.answers = this.hasMany(models.answers, { foreignKey: 'reportId' });
	};
	return Model;
};
