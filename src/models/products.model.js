const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const CategoriaProducto = require('./categoriaProducto');

const Producto = sequelize.define('Producto', {
  idProducto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CategoriaProducto,
      key: 'idCategoria'
    }
  },
  imagenProducto: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  nombreProducto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-zA-Záéíóúñ ]+$/,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  precioVenta: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  estadoProducto: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'productos',
  timestamps: false,
});

module.exports = Producto;
