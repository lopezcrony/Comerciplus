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
      name: 'unique_nombrePermiso',
      msg: 'El nombre del permiso debe ser único.'
    },
    allowNull: false
  }
}, {
  defaultScope: {
    order: [['idPermiso', 'DESC']]
  },
  tableName: 'permisos',
  timestamps: false
});

module.exports = Permissions;