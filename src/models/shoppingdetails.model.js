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
    // CAMBIO: Se agrega el campo subtotal que se calcula automáticamente.
    subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0, // Valor inicial
    },
}, {
    tableName: 'detalle_compras',
    timestamps: false,
    // CAMBIO: Hooks que calculan el subtotal antes de crear o actualizar un registro.
    hooks: {
        beforeCreate: (detalleCompra, options) => {
            // Calcula el subtotal antes de crear un nuevo detalle de compra
            detalleCompra.subtotal = detalleCompra.cantidadProducto * detalleCompra.precioCompraUnidad;
        },
        beforeUpdate: (detalleCompra, options) => {
            // Recalcula el subtotal antes de actualizar un detalle de compra existente
            detalleCompra.subtotal = detalleCompra.cantidadProducto * detalleCompra.precioCompraUnidad;
        }
    }
});

DetalleCompra.associate = (models) => {
    DetalleCompra.belongsTo(models.Compra, {
        foreignKey: 'idCompra',
        as: 'compra'
    });
    DetalleCompra.belongsTo(models.Producto, {
        foreignKey: 'idProducto',
        as: 'producto'
    });
};

module.exports = DetalleCompra;
