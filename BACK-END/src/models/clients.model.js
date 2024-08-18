const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const Cliente = sequelize.define('Cliente', {
    idCliente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cedulaCliente: {
        type: DataTypes.STRING(20),
        unique: {
            name: 'unique_cedulaCliente', // Nombre del índice existente
            msg: 'La cédula del cliente debe ser única.'
          },
        allowNull: false
    },
    nombreCliente: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellidoCliente: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    direccionCliente: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefonoCliente: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    estadoCliente: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'clientes', 
    timestamps: false // Es para integrar las columnas de createdAt/updatedAt
});

module.exports = Cliente;
