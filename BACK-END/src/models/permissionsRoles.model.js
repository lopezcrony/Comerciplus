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
  idPermiso: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'permisosrol',
  timestamps: false
});

module.exports = PermissionRole;