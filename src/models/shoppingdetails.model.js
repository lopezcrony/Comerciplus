const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DetalleCompra = sequelize.define('DetalleCompra', {
    idDetalleCompra: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    idCompra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'compras', 
            key: 'idCompra'
        }
    },
    idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'productos', 
            key: 'idProducto'
        }
    },
    codigoBarra: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    cantidadProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioCompraUnidad: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'detalleCompra',
    timestamps: false,
});

// Definir las relaciones

DetalleCompra.associate = (models) => {
    DetalleCompra.belongsTo(models.Compra, {
        foreignKey: 'idCompra',
        as: 'compra'
    });
};

DetalleCompra.associate = (models) => {
    DetalleCompra.belongsTo(models.Producto, {
        foreignKey: 'idProducto',
        as: 'producto'
    });
};

module.exports = DetalleCompra;
