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
        unique:true,
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
    tableName: 'categorias_productos',
    timestamps: false,
});

module.exports = CategoriaProducto;
