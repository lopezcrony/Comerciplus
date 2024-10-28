const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Credito = sequelize.define('Credito', {
    idCredito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idCliente: {
        type: DataTypes.INTEGER,
        unique : true,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'idCliente'
        }
    },
    totalCredito: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    defaultScope: {
        order: [['idCredito', 'DESC']],  // Aplicar orden descendente por defecto
    },
    tableName: 'creditos',
    timestamps: false
});

Credito.associate = (models) => {
    Credito.belongsTo(models.Cliente, {
        foreignKey: 'idCliente',
        as: 'cliente'
    });

    Credito.hasMany(models.DetalleCredito, {
        foreignKey: 'idCredito',
        as: 'detallesCredito'
    });

    Credito.hasMany(models.Abono, {
        foreignKey: 'idCredito',
        as: 'abonos'
    });
};

module.exports = Credito;
