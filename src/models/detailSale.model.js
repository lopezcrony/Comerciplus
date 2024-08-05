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
        unique: true,
        allowNull: false,
        references: {
            model: 'ventas',
            key: 'idVenta'
        }
    },
    idCodigoBarra: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
            model: 'codigoBarras',
            key: 'idCodigoBarra'
        }
    },
    cantidadProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'detalleVentas',
    timestamps: false

});

detalleVenta.associate = (models) => {
    detalleVenta.belongsTo(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        as: 'codigoBarra'
    });

    detalleVenta.belongsTo(models.ventas, {
        foreignKey: 'idVenta',
        as: 'ventas'

    });

    detalleVenta.belongsTo(models.returnSales,{
        foreignKey: 'idDetalleVenta'        
    })
}

module.exports = detalleVenta
