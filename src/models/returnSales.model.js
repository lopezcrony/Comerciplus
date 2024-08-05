const { DataTypes } = require ('sequelize');
const { sequelize } = require('../config/db');

const returnSales = sequelize.define('returnSales', {
    idDevolucionVenta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idDetalleVenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'detalleVentas',
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
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    fechaDevolucion: {
        type: DataTypes.DATE,
        allowNull: false
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
        allowNull: false,
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

    returnSales.hasMany(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        as: 'codigoBarras'
    });

    

};

module.exports = returnSales;
