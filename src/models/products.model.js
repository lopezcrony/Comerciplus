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
      model: 'categorias_productos', // Asegúrate de que coincida con el nombre de la tabla
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

Producto.associate = (models) => {
    Producto.belongsTo(models.CategoriaProducto, {
        foreignKey: 'idCategoria',
        as: 'categoriaProducto'
    });
};

// Exportar el modelo
module.exports = Producto;
