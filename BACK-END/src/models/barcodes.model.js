const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CodigoBarra = sequelize.define('CodigoBarra', {
  idCodigoBarra: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'idProducto'
    }
  },
  codigoBarra: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      name: 'unique_codigoBarra', // Nombre del índice existente
      msg: 'El codigo de barra debe ser único.'
    }
  },
}, {
  defaultScope: {
    order: [['idCodigoBarra', 'DESC']],
  },
  tableName: 'codigoBarras',
  timestamps: false,
});

CodigoBarra.associate = (models) => {
  CodigoBarra.belongsTo(models.Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
  });


  CodigoBarra.hasMany(models.returnProvider, {
    foreignKey: 'idDevolucionLocal',
    as: 'devolucionLocal'
  });

  CodigoBarra.hasMany(models.returnSales, {
    foreignKey: 'idDevolucionVenta',
    as: 'devolucionVenta'
  });

  CodigoBarra.hasMany(models.returnSales, {
    foreignKey: 'idDevolucionVenta',
    as: 'devolucionVenta'
  });

  CodigoBarra.hasMany(models.returnLoss, {
    foreignKey: 'idDevolucionDeBaja',
    as: 'perdida'
  });

};

module.exports = CodigoBarra;
