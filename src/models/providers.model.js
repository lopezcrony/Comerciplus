const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Proveedor = sequelize.define('Proveedor', {
  idProveedor: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  nitProveedor: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  nombreProveedor: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  direccionProveedor: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  telefonoProveedor: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  estadoProveedor: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'proveedores',
  timestamps: false
});

module.exports = Proveedor;
