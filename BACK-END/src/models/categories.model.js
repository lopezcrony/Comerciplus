const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const CategoriaProducto = sequelize.define('CategoriaProducto', {
    idCategoria: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nombreCategoria: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
            name: 'unique_nombreCategoria', // Nombre del índice existente
            msg: 'El nombre de la categoria debe ser único.'
          },
        validate: {
            is: /^[a-zA-Záéíóúñ ]+$/,
        },
    },
    descripcionCategoria: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    estadoCategoria: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    defaultScope: {
        order: [['idCategoria', 'DESC']],
    },
    tableName: 'categorias_productos',
    timestamps: false,
});

module.exports = CategoriaProducto;
