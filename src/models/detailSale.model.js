const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const detailVenta=sequelize.define('detailVenta',{
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

},

detailVenta.associate = (models) => {
    detailVenta.belongsTo(models.Sales, {
        foreignKey: 'idVenta',
        as: 'ventas'
    });    

    detailVenta.hasMany(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        as: 'codigoBarras'
    });
});

module.exports=detailVenta
