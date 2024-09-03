const { DataTypes } = require ('sequelize');
const { sequelize } = require('../config/db');

const returnSales = sequelize.define('returnSales', {
    idDevolucionVenta: {
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
    idDetalleVenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'detalleVenta',
            key: 'idDetalleVenta'
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
    CodigoProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    NombreProducto: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            is: /^[a-zA-Záéíóúñ0-9 ]+$/,
        },
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    fechaDevolucion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    motivoDevolucion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            is: /^[a-zA-Záéíóúñ ]+$/,
        },
    },
    tipoReembolso: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            is: /^[a-zA-Záéíóúñ ]+$/,
        },
    },
    valorDevolucion: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'devolucionVenta',
    timestamps: false
});

// Define las asociaciones después de definir el modelo
returnSales.associate = (models) => {
    returnSales.belongsTo(models.detalleVenta, {
        foreignKey: 'idDetalleVenta',
        as: 'detalleVenta'
    });

    returnSales.belongsTo(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        as: 'codigoBarras'
    });

    returnSales.associate = (models) => {
        detailVenta.belongsTo(models.Proveedor, {
            foreignKey: 'idProveedor',
            as: 'proveedores'
        });
    }
};

module.exports = returnSales;
