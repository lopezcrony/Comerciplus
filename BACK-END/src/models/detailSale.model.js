const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const detalleVenta = sequelize.define('detalleVenta', {
    idDetalleVenta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idVenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ventas',
            key: 'idVenta'
        }
    },
    idProducto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'productos',
            key: 'idProducto'
        }
    },
    cantidadProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    defaultScope: {
        order: [['idDetalleVenta', 'DESC']],  // Aplicar orden descendente por defecto
    },
    tableName: 'detalleVenta',
    timestamps: false
});

detalleVenta.associate = (models) => {
    detalleVenta.belongsTo(models.Sales, {
        foreignKey: 'idVenta',
        as: 'venta'
    });
    detalleVenta.hasMany(models.returnSales, {
        foreignKey: 'idDevolucionVenta',
        as: 'devolucionVenta'
    });

    detalleVenta.belongsTo(models.Producto, {
        foreignKey: 'idProducto',
        as: 'productos'
    });

};

module.exports = detalleVenta;