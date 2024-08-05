const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

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
  hooks: {
    beforeCreate: async (user) => {
      if (user.contraseñaUsuario) {
        const salt = await bcrypt.genSalt(10);
        user.contraseñaUsuario = await bcrypt.hash(user.contraseñaUsuario, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.contraseñaUsuario) {
        const salt = await bcrypt.genSalt(10);
        user.contraseñaUsuario = await bcrypt.hash(user.contraseñaUsuario, salt);
      }
    }
  }
});

module.exports = User;
