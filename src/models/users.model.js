const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idRol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'idRol'
    }
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
        console.log('Encriptando contraseña antes de crear:', user.contraseñaUsuario);
        user.contraseñaUsuario = await bcrypt.hash(user.contraseñaUsuario, 10);
        console.log('Contraseña encriptada:', user.contraseñaUsuario);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('contraseñaUsuario')) {
        console.log('Contraseña cambiada, encriptando...');
        user.contraseñaUsuario = await bcrypt.hash(user.contraseñaUsuario, 10);
        console.log('Contraseña encriptada:', user.contraseñaUsuario);
      }
    }
  }
});

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.contraseñaUsuario);
};

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: 'idRol' });
};

module.exports = User;


