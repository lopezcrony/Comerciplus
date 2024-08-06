const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PermissionRole = sequelize.define('PermissionRole', {
  idPermisosRol: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  idRol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'idRol'
  }
  },
  idPermisos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'permisos',
      key: 'idPermiso'
  }
  }
}, {
  tableName: 'permissionsRoles',
  timestamps: false
});

//Acá es para relacionar las tablas.
PermissionRole.associate = (models) => {
  PermissionRole.belongsTo(models.Role, { foreignKey: 'idRol' });
  PermissionRole.belongsTo(models.Permission, { foreignKey: 'idPermisos' });
};


module.exports = PermissionRole;
