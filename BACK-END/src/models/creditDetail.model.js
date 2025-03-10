const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DetalleCredito = sequelize.define('detallecredito', {
    idDetalleCredito: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    idCredito: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'creditos',
            key: 'idCredito'
        }
    },
    idVenta: {
        type: DataTypes.INTEGER,
        unique:true,
        allowNull: false,
        references: {
            model: 'ventas',
            key: 'idVenta'
        }
    },
    montoAcreditado: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 50
        }
    },
    plazoMaximo: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    
    defaultScope: {
        order: [['idDetalleCredito', 'DESC']],  // Aplicar orden descendente por defecto
    },
    tableName: 'detalle_credito',
    timestamps: true 
});

DetalleCredito.associate = (models) => {
    DetalleCredito.belongsTo(models.Credito, {
        foreignKey: 'idCredito',
        as: 'credito'
    });

    DetalleCredito.belongsTo(models.Sales, {
        foreignKey: 'idVenta',
        as: 'venta'
    });
};

module.exports = DetalleCredito;