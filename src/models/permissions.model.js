const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Permissions = sequelize.define('Permissions', {
    idPermiso: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nombrePermiso: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'permisos',
    timestamps: false
});

//....
Permissions.associate = (models) => {
    Permissions.hasMany(models.PermissionRole, { foreignKey: 'idPermiso' });
};

module.exports = Permissions;
