const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Abono = sequelize.define('Abono', {
    idAbono: {
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
    montoAbonado: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 50
        }
    },
    fechaAbono: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estadoAbono: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    defaultScope: {
        order: [['idAbono', 'DESC']],  // Aplicar orden descendente por defecto
    },
    tableName: 'abonos',
    timestamps: false
});

Abono.associate = (models) => {
    Abono.belongsTo(models.Credito, {
        foreignKey: 'idCredito',
        as: 'credito'
    });
};

module.exports = Abono;
