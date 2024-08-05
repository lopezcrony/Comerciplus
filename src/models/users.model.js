const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cedulaUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidoUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefonoUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correoUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contraseñaUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = User;
