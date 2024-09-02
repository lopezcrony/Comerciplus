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
        unique: {
            name: 'unique_nombrePermiso', // Nombre del índice existente
            msg: 'El nombre del permiso debe ser único.'
        },
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
