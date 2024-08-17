const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

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
    idCodigoBarra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'codigoBarras',
            key: 'idCodigoBarra'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
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