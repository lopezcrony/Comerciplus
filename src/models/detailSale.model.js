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
        unique: false,
        allowNull: false,
        references: {
            model: 'ventas',
            key: 'idVenta'
        }
    },
    idCodigoBarra: {
        type: DataTypes.INTEGER,
        unique: false,
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
    tableName: 'detalleVenta',
    timestamps: false

});

detalleVenta.associate = (models) => {
    detalleVenta.belongsTo(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        as: 'ventas'
    });    

    detalleVenta.hasMany(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        
    });

    detalleVenta.belongsTo(models.ventas, {
        foreignKey: 'idVenta',
        as: 'ventas'

    });

    detalleVenta.hasMany(models.returnSales,{
        foreignKey: 'idDetalleVenta',
        as : 'devolucionVenta'
    })
};

module.exports = detalleVenta
