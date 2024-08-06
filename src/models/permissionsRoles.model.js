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
    allowNull: false
  },
  idPermisos: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'permissionsRoles',
  timestamps: false
});

module.exports = PermissionRole;
