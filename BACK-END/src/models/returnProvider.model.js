const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const CodigoBarra = require('./Barcode.model');

const returnProvider = sequelize.define('returnProvider', {
    idDevolucionLocal: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idProveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'proveedores',
            key: 'idProveedor'
        }
    },
    NombreProveedor:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    idCodigoBarra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'codigoBarras',
            key: 'idCodigoBarra'
        }
    },
    CodigoProducto:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW
    },
    motivoDevolucion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            is: /^[a-zA-Záéíóúñ ]+$/,
        },
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Por notificar"
    }
}, {
    tableName: 'devolucionLocal',
    timestamps: false
});

    returnProvider.associate = (models) => {
        detailVenta.belongsTo(models.Proveedor, {
            foreignKey: 'idProveedor',
            as: 'proveedores'
        });

        returnProvider.belongsTo(models.CodigoBarra, {
            foreignKey: 'idCodigoBarra',
            as: 'codigoBarras'
        });
    }


module.exports = returnProvider