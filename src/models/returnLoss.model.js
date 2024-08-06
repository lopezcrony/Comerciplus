const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const returnLoss=sequelize.define('returnLoss',{
    idDevolucionDeBaja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },    
    idCodigoBarra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'codigoBarras',
            key: 'idCodigoBarra'
        }
    },
    cantidad:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            min:0
        }
    },
    fechaDeBaja:{
        type: DataTypes.DATE,
        allowNull:false
    },
    motivo:{
        type: DataTypes.STRING(100),
        allowNull:false,
        validate: {
            is: /^[a-zA-Záéíóúñ ]+$/,
        },
    }
    
},{tableName:'darDeBaja',
    timestamps:false
});

returnLoss.associate = (models) => {
    detailVenta.belongsTo(models.CodigoBarra, {
        foreignKey: 'idCodigoBarra',
        as: 'codigoBarras'
    });    

    
}


module.exports=returnLoss