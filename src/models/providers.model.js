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
    allowNull: false,
    unique: {
      name: 'unique_nitProveedor', // Nombre del índice existente
      msg: 'El NIT del proveedor debe ser único.'
    }
  },
  nombreProveedor: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  direccionProveedor: {
    type: DataTypes.STRING(100),
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
