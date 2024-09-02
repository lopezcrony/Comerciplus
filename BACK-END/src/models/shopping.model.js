const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Compra = sequelize.define('Compra', {
    idCompra: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    idProveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'proveedores', 
            key: 'idProveedor'
        }
    },
    fechaCompra: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    numeroFactura: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            name: 'unique_numeroFactura', // Nombre del índice existente
            msg: 'El numero de la factura debe ser único.'
          },
    },
    valorCompra: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    estadoCompra: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'compras',
    timestamps: false,
});

Compra.associate = (models) => {
    Compra.belongsTo(models.Proveedor, {
        foreignKey: 'idProveedor',
        as: 'proveedor'
    });
    Compra.hasMany(models.DetalleCompra, {
        foreignKey: 'idCompra',
        as: 'detallesCompra'
    });
};

module.exports = Compra;
