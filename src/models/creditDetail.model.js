const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DetalleCredito = sequelize.define('DetalleCredito', {
    idDetalleCredito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
            min: 0
        }
    },
    plazoMaximo: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'detalleCredito',
    timestamps: false
});

DetalleCredito.associate = (models) => {
    DetalleCredito.belongsTo(models.Credito, {
        foreignKey: 'idCredito',
        as: 'credito'
    });

    DetalleCredito.belongsTo(models.Venta, {
        foreignKey: 'idVenta',
        as: 'venta'
    });
};

module.exports = DetalleCredito;
