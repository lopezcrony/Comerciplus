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
    idCodigoBarra: {
        type: DataTypes.INTEGER,
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
}, {tableName: 'detalleVenta',
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

    detalleVenta.belongsTo(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        as: 'codigoBarra'
    }); 
    
    
};

module.exports = detalleVenta