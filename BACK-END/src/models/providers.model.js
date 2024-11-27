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
      name: 'unique_nitProveedor',
      msg: 'El NIT del proveedor debe ser único.'
    }
  },
  nombreProveedor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'unique_nombreProveedor',
      msg: 'El nombre de la empresa debe ser único.'
  },
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
  defaultScope: {
    order: [['idProveedor', 'DESC']]
  },
  tableName: 'proveedores',
  timestamps: false
});

module.exports = Proveedor;