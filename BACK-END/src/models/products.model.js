const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

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
      model: 'categorias_productos',
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
    unique: {
      name: 'unique_nombreProducto', 
      msg: 'El nombre del producto debe ser único.'
    },
    validate: {
      is: /^[a-zA-Záéíóúñ ]+$/,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
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
  defaultScope: {
    order: [['idProducto', 'DESC']],
  },
  tableName: 'productos',
  timestamps: false,
});

Producto.associate = (models) => {
    Producto.belongsTo(models.CategoriaProducto, {
        foreignKey: 'idCategoria',
        as: 'categoriaProducto'
    });

    Producto.hasMany(models.detalleVenta, {
      foreignKey: 'idDetalleVenta',
      as: 'detalleVenta'
    });

    Producto.hasMany(models.CodigoBarra, {
      foreignKey: 'idProducto',
      as: 'producto'
    });
};

module.exports = Producto;
