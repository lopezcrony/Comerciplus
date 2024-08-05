const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Sales= sequelize.define('ventas', {
    idVenta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fechaVenta:{
        type: DataTypes.DATE,
        allowNull:false
    },
    totalVenta: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull:false,
        validate: {
            min: 0
        }
    },
    estadoVenta:{
        type:DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {tableName:'ventas',
    timestamps:false
});

Sales.associate = (models) => {

    Sales.hasMany(models.detallecredito, {
        foreignKey: 'idVenta',
        as: 'DetalleCredito'
    });    
};

module.exports=Sales;