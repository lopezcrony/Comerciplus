const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const detalleVenta=sequelize.define('detalleVenta',{
    idDetalleVenta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idVenta: {
        type: DataTypes.INTEGER,
        unique : true,
        allowNull: false,
        references: {
            model: 'Sales',
            key: 'idVenta'
        }
    },
    idCodigoBarra: {
        type: DataTypes.INTEGER,
        unique : true,
        allowNull: false,
        references: {
            model: 'CodigoBarra',
            key: 'idCodigoBarra'
        }
    },
    cantidadProducto:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            min:0
        }
    }
},{
    tableName:'detalleVenta',
    timestamps: false

});

detalleVenta.associate = (models) => {
    detalleVenta.belongsTo(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        as: 'ventas'
    });    

    detalleVenta.hasMany(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        
    });
}

module.exports=detalleVenta
